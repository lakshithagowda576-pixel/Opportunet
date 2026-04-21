import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { messagesTable, jobsTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { SendMessageBody } from "@workspace/api-zod";

const router: IRouter = Router();

const HR_REPLIES = [
  "Thank you for reaching out. We have received your message and will get back to you within 2-3 business days.",
  "We appreciate your interest in this position. Our team is currently reviewing applications and will contact shortlisted candidates shortly.",
  "Thank you for contacting us. Please ensure you have submitted all required documents via our portal. We will reach out with further details.",
  "Your message has been received. Our HR team is actively reviewing profiles. Please check your email regularly for updates.",
  "Thank you for your inquiry. We appreciate your enthusiasm. You will be contacted if your profile matches our requirements.",
];

router.get("/messages", async (req, res) => {
  const msgs = await db
    .select({
      id: messagesTable.id,
      jobId: messagesTable.jobId,
      senderName: messagesTable.senderName,
      senderEmail: messagesTable.senderEmail,
      hrEmail: messagesTable.hrEmail,
      subject: messagesTable.subject,
      body: messagesTable.body,
      isReply: messagesTable.isReply,
      sentAt: messagesTable.sentAt,
      job: jobsTable,
    })
    .from(messagesTable)
    .leftJoin(jobsTable, eq(messagesTable.jobId, jobsTable.id));

  const formatted = msgs.map((m) => ({
    ...m,
    sentAt: m.sentAt.toISOString(),
    job: m.job ? { ...m.job, createdAt: m.job.createdAt.toISOString() } : undefined,
  }));
  res.json(formatted);
});

router.post("/messages", async (req, res) => {
  const body = SendMessageBody.parse(req.body);

  const [job] = await db.select().from(jobsTable).where(eq(jobsTable.id, body.jobId));
  if (!job) {
    res.status(404).json({ error: "Job not found" });
    return;
  }

  const [msg] = await db
    .insert(messagesTable)
    .values({
      jobId: body.jobId,
      senderName: body.senderName,
      senderEmail: body.senderEmail,
      hrEmail: job.hrEmail,
      subject: body.subject,
      body: body.body,
      isReply: false,
    })
    .returning();

  const randomReply = HR_REPLIES[Math.floor(Math.random() * HR_REPLIES.length)];
  await db.insert(messagesTable).values({
    jobId: body.jobId,
    senderName: `HR - ${job.company}`,
    senderEmail: job.hrEmail,
    hrEmail: body.senderEmail,
    subject: `Re: ${body.subject}`,
    body: randomReply,
    isReply: true,
  });

  res.status(201).json({ ...msg, sentAt: msg.sentAt.toISOString() });
});

export default router;
