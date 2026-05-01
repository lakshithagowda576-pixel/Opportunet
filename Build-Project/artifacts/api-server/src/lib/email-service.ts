import nodemailer from "nodemailer";
import { db } from "@workspace/db";
import { usersTable, applicationsTable, jobsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { sendEmail } from "./mailer";

// Create transporter for direct email sending (used in cron jobs)
const createTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });
};

function getStatusColor(status: string): string {
  const colors = {
    Pending: "#f59e0b",
    Reviewed: "#3b82f6",
    Interview: "#8b5cf6",
    Offered: "#10b981",
    Rejected: "#ef4444",
    "Pre-Registered": "#10b981",
  };
  return colors[status as keyof typeof colors] || "#6b7280";
}

export async function sendPreRegistrationEmail(userEmail: string, userName: string, job: any) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; }
            .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; border: 1px solid #e5e7eb; }
            .job-box { background: #f0fdf4; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
            .button { display: inline-block; background-color: #10b981; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">✅ Pre-Registration Confirmed</h1>
            </div>
            <div class="content">
              <p>Hi <strong>${userName}</strong>,</p>
              <p>You have successfully pre-registered for the following position:</p>
              
              <div class="job-box">
                <h2 style="margin: 0; color: #065f46;">${job.title}</h2>
                <p style="margin: 5px 0; color: #047857;"><strong>${job.company}</strong></p>
              </div>

              <h3 style="color: #1f2937;">What's Next?</h3>
              <p>Official applications for this position are scheduled to open on <strong>${new Date(job.startDate).toLocaleDateString(undefined, { dateStyle: 'full' })}</strong>.</p>
              
              <h3 style="color: #1f2937;">About the Job</h3>
              <p>${job.description.substring(0, 300)}${job.description.length > 300 ? '...' : ''}</p>

              <p>We will send you another email as soon as the application link goes live so you can be among the first to apply!</p>
              
              <a href="${process.env.FRONTEND_URL}/jobs/${job.id}" class="button">View Job Details</a>
            </div>
            <div class="footer">
              <p>© 2026 OpportuNet. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "OpportuNet <noreply@opportunet.com>",
        to: userEmail,
        subject: `Pre-Registration Confirmed: ${job.title} at ${job.company}`,
        html,
      });
      console.log(`Pre-registration email sent to ${userEmail}`);
    }
  } catch (error) {
    console.error(`Failed to send pre-registration email to ${userEmail}:`, error);
  }
}

export async function sendJobStartingSoonEmail(userEmail: string, userName: string, job: any) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; }
            .header { background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
            .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">🚀 Applications Are Now Open!</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>Great news! The job you pre-registered for is now accepting applications.</p>
              
              <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin: 0; color: #1e40af;">${job.title}</h2>
                <p style="margin: 5px 0;">at <strong>${job.company}</strong></p>
              </div>

              <p>Don't wait! Early applicants often have a better chance of being reviewed.</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL}/jobs/${job.id}" class="button">Apply Now</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 OpportuNet. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "OpportuNet <noreply@opportunet.com>",
        to: userEmail,
        subject: `🚀 Now Open: Apply for ${job.title} at ${job.company}`,
        html,
      });
    }
  } catch (error) {
    console.error(`Failed to send job starting email to ${userEmail}:`, error);
  }
}

export async function sendJobClosingSoonEmail(userEmail: string, userName: string, job: any) {
  try {
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #fef2f2; padding: 20px; }
            .header { background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 30px; border-radius: 8px; text-align: center; }
            .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
            .button { display: inline-block; background-color: #dc2626; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin:0;">⚠️ Application Closing Soon</h1>
            </div>
            <div class="content">
              <p>Hi ${userName},</p>
              <p>This is a reminder that the application for the following position closes <strong>tomorrow</strong>:</p>
              
              <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h2 style="margin: 0; color: #991b1b;">${job.title}</h2>
                <p style="margin: 5px 0;">at <strong>${job.company}</strong></p>
                <p style="margin: 5px 0; color: #b91c1c;"><strong>Deadline:</strong> ${new Date(job.endDate).toLocaleDateString()}</p>
              </div>

              <p>If you haven't finished your application yet, now is the time!</p>
              
              <div style="text-align: center; margin-top: 30px;">
                <a href="${process.env.FRONTEND_URL}/jobs/${job.id}" class="button">Finish Application</a>
              </div>
            </div>
            <div class="footer">
              <p>© 2026 OpportuNet. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "OpportuNet <noreply@opportunet.com>",
        to: userEmail,
        subject: `⚠️ Reminder: ${job.title} application closes tomorrow!`,
        html,
      });
    }
  } catch (error) {
    console.error(`Failed to send job closing email to ${userEmail}:`, error);
  }
}

export async function sendDailyJobUpdateEmail(userId: number) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      console.log(`User ${userId} not found for email notification`);
      return;
    }

    // Get user's applications with status updates
    const userApplications = await db
      .select({
        id: applicationsTable.id,
        jobId: applicationsTable.jobId,
        status: applicationsTable.status,
        appliedAt: applicationsTable.appliedAt,
        jobTitle: jobsTable.title,
        company: jobsTable.company,
        jobDescription: jobsTable.description,
      })
      .from(applicationsTable)
      .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
      .where(eq(applicationsTable.applicantEmail, user.email));

    if (userApplications.length === 0) {
      console.log(`No applications found for user ${user.email}`);
      return;
    }

    const statusCounts = {
      Pending: 0,
      Reviewed: 0,
      Interview: 0,
      Offered: 0,
      Rejected: 0,
    };

    let applicationsList = "";
    for (const app of userApplications) {
      statusCounts[app.status as keyof typeof statusCounts]++;
      applicationsList += `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left;">${app.jobTitle}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: left;">${app.company}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <span style="background-color: ${getStatusColor(app.status)}; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 500;">${app.status}</span>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #666;">${new Date(app.appliedAt).toLocaleDateString()}</td>
        </tr>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: white; padding: 20px; margin-top: 20px; border-radius: 8px; }
            .stats { display: flex; gap: 10px; margin: 20px 0; }
            .stat-box { background: #f3f4f6; padding: 15px; border-radius: 6px; text-align: center; flex: 1; }
            .stat-number { font-size: 24px; font-weight: bold; color: #667eea; }
            .stat-label { font-size: 12px; color: #666; margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📊 Daily Job Application Update</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Your application status for ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="content">
              <p>Hi ${user.name},</p>
              <p>Here's your daily update on all job applications:</p>

              <div class="stats">
                <div class="stat-box">
                  <div class="stat-number">${userApplications.length}</div>
                  <div class="stat-label">Total Applications</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${statusCounts.Pending}</div>
                  <div class="stat-label">Pending</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${statusCounts.Interview}</div>
                  <div class="stat-label">Interviews</div>
                </div>
                <div class="stat-box">
                  <div class="stat-number">${statusCounts.Offered}</div>
                  <div class="stat-label">Offers</div>
                </div>
              </div>

              <h2 style="margin-top: 25px; margin-bottom: 15px; color: #1f2937;">Application Status Details</h2>
              <table>
                <thead>
                  <tr>
                    <th>Job Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Applied Date</th>
                  </tr>
                </thead>
                <tbody>
                  ${applicationsList}
                </tbody>
              </table>

              <div style="margin-top: 25px; padding: 15px; background: #f0f9ff; border-left: 4px solid #667eea; border-radius: 4px;">
                <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                  <strong>💡 Tip:</strong> Keep checking back daily for updates. If your status changes, you'll see it here immediately!
                </p>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 OpportuNet. All rights reserved.<br/>
              You're receiving this email because you have active job applications on our platform.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await sendEmail({
      to: user.email,
      subject: `📊 Daily Job Application Update - ${userApplications.length} applications`,
      body: applicationsList,
      applicantName: user.name,
    });

    // If sendEmail is using HTML, we need to send directly
    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "OpportuNet <noreply@opportunet.com>",
        to: user.email,
        subject: `📊 Daily Job Application Update - ${userApplications.length} applications`,
        html,
      });
      console.log(`Daily update email sent to ${user.email}`);
    } else {
      console.log(`[SIMULATED EMAIL] Daily update would be sent to ${user.email}`);
    }
  } catch (error) {
    console.error(`Failed to send email to user ${userId}:`, error);
  }
}

export async function sendApplicationStatusChangeEmail(applicationId: number, newStatus: string) {
  try {
    const [application] = await db
      .select({
        applicantEmail: applicationsTable.applicantEmail,
        applicantName: applicationsTable.applicantName,
        jobTitle: jobsTable.title,
        company: jobsTable.company,
        status: applicationsTable.status,
      })
      .from(applicationsTable)
      .leftJoin(jobsTable, eq(applicationsTable.jobId, jobsTable.id))
      .where(eq(applicationsTable.id, applicationId));

    if (!application) {
      return;
    }

    const statusMessages = {
      Pending: "Your application has been received and is pending review.",
      Reviewed: "Your application has been reviewed! We'll contact you soon if you're selected for the next round.",
      Interview: "Great news! You've been selected for an interview. Please check your email for interview details.",
      Offered: "Congratulations! You've received a job offer. Please check your email for offer details.",
      Rejected: "Thank you for applying. Unfortunately, you weren't selected for this position. We encourage you to apply for other opportunities.",
    };

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; }
            .content { background: white; padding: 30px; margin-top: 20px; border-radius: 8px; }
            .status-badge { display: inline-block; background-color: ${getStatusColor(newStatus)}; color: white; padding: 10px 20px; border-radius: 6px; font-weight: bold; margin: 15px 0; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Application Status Update</h1>
            </div>

            <div class="content">
              <p>Hi ${application.applicantName},</p>
              
              <p>We have an update on your application for:</p>
              <h2 style="margin: 10px 0; color: #667eea;">${application.jobTitle}</h2>
              <p style="color: #666; margin: 0;">at <strong>${application.company}</strong></p>

              <div class="status-badge">${newStatus}</div>

              <p style="margin-top: 20px;">${statusMessages[newStatus as keyof typeof statusMessages] || "Your application status has been updated."}</p>

              <p style="margin-top: 20px;">If you have any questions, please don't hesitate to reach out.</p>
              
              <p style="margin-top: 30px;">Best regards,<br/>
              <strong>OpportuNet Team</strong></p>
            </div>

            <div class="footer">
              <p>© 2026 OpportuNet. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "OpportuNet <noreply@opportunet.com>",
        to: application.applicantEmail,
        subject: `Application Status Update: ${newStatus} - ${application.jobTitle}`,
        html,
      });
      console.log(`Status change email sent to ${application.applicantEmail}`);
    } else {
      console.log(`[SIMULATED EMAIL] Status update email would be sent to ${application.applicantEmail}`);
    }
  } catch (error) {
    console.error(`Failed to send status change email for application ${applicationId}:`, error);
  }
}

export async function sendDailyJobOpeningsEmail(userId: number) {
  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId));

    if (!user) {
      return;
    }

    // Get all jobs (or filter by user preferences if available)
    const allJobs = await db.select().from(jobsTable);

    if (allJobs.length === 0) {
      return;
    }

    let jobsList = "";
    for (const job of allJobs.slice(0, 10)) {
      jobsList += `
        <div style="padding: 15px; background: #f9fafb; border-radius: 6px; margin-bottom: 10px; border-left: 4px solid #667eea;">
          <h3 style="margin: 0 0 5px 0; color: #1f2937;">${job.title}</h3>
          <p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">
            <strong>${job.company}</strong> • ${job.location}
            <br/>
            <strong>Package:</strong> ${job.salary} | <strong>Openings:</strong> ${job.openings}
          </p>
          <a href="${process.env.FRONTEND_URL}/jobs/${job.id}" style="color: #667eea; text-decoration: none; font-weight: bold; font-size: 14px;">View Details →</a>
        </div>
      `;
    }

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px; }
            .header h1 { margin: 0; font-size: 24px; }
            .content { background: white; padding: 20px; margin-top: 20px; border-radius: 8px; }
            .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎯 New Job Opportunities</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Latest openings for ${new Date().toLocaleDateString()}</p>
            </div>

            <div class="content">
              <p>Hi ${user.name},</p>
              <p>We found <strong>${allJobs.length}</strong> new job opportunities that might interest you!</p>

              ${jobsList}

              <div style="margin-top: 25px; padding: 15px; background: #f0f9ff; border-left: 4px solid #667eea; border-radius: 4px;">
                <p style="margin: 0; color: #1e3a8a; font-size: 14px;">
                  <strong>📌 Don't miss out!</strong> New jobs are posted regularly. Check back daily or apply now to increase your chances.
                </p>
              </div>
            </div>

            <div class="footer">
              <p>© 2026 OpportuNet. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    const transporter = createTransporter();
    if (transporter) {
      await transporter.sendMail({
        from: process.env.SMTP_FROM || "OpportuNet <noreply@opportunet.com>",
        to: user.email,
        subject: `🎯 Today's Top Job Opportunities - ${allJobs.length} New Openings`,
        html,
      });
      console.log(`Job openings email sent to ${user.email}`);
    } else {
      console.log(`[SIMULATED EMAIL] Job openings email would be sent to ${user.email}`);
    }
  } catch (error) {
    console.error(`Failed to send job openings email to user ${userId}:`, error);
  }
}
