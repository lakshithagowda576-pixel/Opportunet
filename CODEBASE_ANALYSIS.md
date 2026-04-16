# Codebase Analysis: Job Portal & Exam Hub

## 1. MESSAGES FEATURE (✅ FULLY IMPLEMENTED)

### Location
- **Frontend**: [Build-Project/artifacts/job-portal/src/pages/Messages.tsx](Build-Project/artifacts/job-portal/src/pages/Messages.tsx)
- **Backend**: [Build-Project/artifacts/api-server/src/routes/messages.ts](Build-Project/artifacts/api-server/src/routes/messages.ts)
- **Job Details Contact Form**: [Build-Project/artifacts/job-portal/src/pages/JobDetails.tsx#L335-L365](Build-Project/artifacts/job-portal/src/pages/JobDetails.tsx#L335-L365)

### Implementation Details

#### API Endpoints
```typescript
// GET /api/messages - List all messages for user
router.get("/messages", async (req, res) => {
  // Fetches messages where user is sender OR receiver
  // Privileged users (admin/hr) see all messages
  // Regular users see only their own
});

// POST /api/messages - Send new message to HR
router.post("/messages", async (req, res) => {
  // Requires auth
  // Creates message thread with HR
  // Sends to job.hrEmail or builds default HR email
});

// POST /api/messages/:id/reply - HR reply endpoint
router.post("/messages/:id/reply", requireAdminOrHR, async (req, res) => {
  // Requires admin/hr role
  // Creates reply message with isReply: true
  // Marks sender as HR Team
});
```

#### Frontend Components
```tsx
// Full-featured message UI with:
// - Sidebar list of all messages
// - Message detail view
// - Reply composition for HR
// - Search functionality
// - Status indicators (You vs HR Team)
// - Date formatting with date-fns

// Job Details quick contact form
<div className="bg-card rounded-2xl p-6">
  <h3>Contact HR</h3>
  <input placeholder="Subject" />
  <textarea placeholder="Ask HR about..." rows={4} />
  <button onClick={handleSendToHr}>Send to HR</button>
</div>
```

---

## 2. BROKEN/INCOMPLETE API ENDPOINTS ⚠️

### Issue #1: Missing `/api/messages/:id/reply` Endpoint Registration
**Status**: ✅ FIXED - Endpoint exists but frontend might have issues

**File**: [Build-Project/artifacts/api-server/src/routes/messages.ts#L97](Build-Project/artifacts/api-server/src/routes/messages.ts#L97)

```typescript
// ✅ ENDPOINT EXISTS
router.post("/messages/:id/reply", requireAdminOrHR, async (req, res) => {
  // Takes: { body: string, subject?: string }
  // Returns: reply message object
});
```

**Frontend Call** ([Messages.tsx#L44](Build-Project/artifacts/job-portal/src/pages/Messages.tsx#L44)):
```tsx
const res = await fetch(`${BASE}/api/messages/${selectedMessage.id}/reply`, {
  method: "POST",
  credentials: "include",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ body: replyBody }),
});
```

---

### Issue #2: Coverage Mismatch - `/applications/track` Endpoint
**File**: [Build-Project/artifacts/api-server/src/routes/applications.ts#L141](Build-Project/artifacts/api-server/src/routes/applications.ts#L141)

```typescript
router.post("/applications/track", async (req, res) => {
  // Purpose: Create tracking record for external job applications
  // Status: Creates application with status: "REDIRECTED"
  const [app] = await db
    .insert(applicationsTable)
    .values({
      jobId,
      applicantName,
      applicantEmail,
      status: "REDIRECTED" as any,  // ⚠️ TYPE ISSUE - REDIRECTED not in ApplicationStatus enum
    })
    .returning();
});
```

**Issue**: `REDIRECTED` status is hardcoded but not in the proper enum. Check [api-zod generated types](Build-Project/lib/api-zod/src/generated/types/applicationStatus.ts).

---

### Issue #3: Missing `coverLetter` in Application Creation Response
**File**: [Build-Project/artifacts/api-server/src/routes/applications.ts#L55-L90](Build-Project/artifacts/api-server/src/routes/applications.ts#L55-L90)

```typescript
// Application is created with coverLetter:
const [app] = await db
  .insert(applicationsTable)
  .values({
    jobId: body.jobId,
    applicantName: user.name || body.applicantName,
    applicantEmail: user.email || body.applicantEmail,
    coverLetter: body.coverLetter,  // ⚠️ Accepted but not returned
    // ... status, appliedAt auto-generated
  })
  .returning();

res.status(201).json({ ...app, appliedAt: app.appliedAt.toISOString() });
```

**Fix Needed**: Include `coverLetter` in response transformation.

---

## 3. OAUTH / GOOGLE LOGIN IMPLEMENTATION

### Location
- **Auth Routes**: [Build-Project/artifacts/api-server/src/routes/auth.ts](Build-Project/artifacts/api-server/src/routes/auth.ts)
- **Login UI**: [Build-Project/artifacts/job-portal/src/pages/LoginPage.tsx](Build-Project/artifacts/job-portal/src/pages/LoginPage.tsx)
- **Configuration**: [Build-Project/artifacts/api-server/src/index.ts#L12-L38](Build-Project/artifacts/api-server/src/index.ts#L12-L38)

### Google OAuth Flow

#### 1. Initialization Check
```typescript
// File: artifacts/api-server/src/index.ts
function validateIntegrationConfig() {
  const oauthProviders = [
    { name: "Google", id: process.env.GOOGLE_CLIENT_ID, secret: process.env.GOOGLE_CLIENT_SECRET },
    // ...
  ];
  for (const provider of oauthProviders) {
    if (!provider.id || !provider.secret) {
      logger.warn({ provider: provider.name }, "OAuth provider not fully configured");
    }
  }
}
```

#### 2. OAuth Initiation Endpoint
```typescript
// GET /api/auth/google
router.get("/google", (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.redirect(getFrontendLoginErrorUrl("Google OAuth not configured"));
  const redirectUri = getOAuthRedirectUri(req, "google");
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email profile`);
});
```

#### 3. Callback Endpoint
```typescript
// GET /api/auth/google/callback
router.get("/google/callback", async (req, res) => {
  const { code } = req.query;
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });
  const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokenData.access_token}` },
  });
  await handleSocialLogin(req, res, ghUser, ghUser.email, "google");
});
```

### Configuration Issues ⚠️

**Required Environment Variables**:
```bash
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
OAUTH_CALLBACK_BASE_URL=http://localhost:3001  # or production URL
FRONTEND_URL=http://localhost:5173  # for redirects after login
```

**Warnings:** If not set properly, you'll see:
- `"OAUTH_CALLBACK_BASE_URL is not set. Falling back to request host for OAuth callbacks."`
- `"OAuth provider not fully configured"` logs

### Frontend OAuth Buttons
```tsx
// LoginPage.tsx
const oauthOptions = [
  {
    name: "Google",
    icon: <Chrome />,
    href: `${BASE}/api/auth/google`,  // Points to /api/auth/google endpoint
  },
  {
    name: "GitHub",
    href: `${BASE}/api/auth/github`,
  },
  {
    name: "LinkedIn",
    href: `${BASE}/api/auth/linkedin`,
  },
];
```

### User Role Determination
```typescript
async function determineUserRole(email: string) {
  const [hrEmail] = await db.select().from(hrEmailsTable)
    .where(eq(hrEmailsTable.email, email));
  if (hrEmail) return "hr";
  return "user";
}
// Automatically assigns "hr" role if email is in hrEmailsTable
```

---

## 4. BROKEN/MISSING LINKS

### Issue #1: Favicon Missing
**File**: [Build-Project/artifacts/job-portal/index.html#L7](Build-Project/artifacts/job-portal/index.html#L7)
```html
<link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```
**Status**: ✅ FIXED - `favicon.svg` exists in [public/ folder](Build-Project/artifacts/job-portal/public/)

---

### Issue #2: External Job Application Links
**File**: [Build-Project/artifacts/api-server/src/lib/seed-data.ts](Build-Project/artifacts/api-server/src/lib/seed-data.ts)

Sample links that may be broken or outdated:
```typescript
{ 
  title: "Revenue Manager – Airlines", 
  company: "SpiceJet", 
  applicationLink: "https://www.spicejet.com/careers",  // Verify still works
},
{ 
  title: "RBI Assistant", 
  company: "Reserve Bank of India (RBI)", 
  applicationLink: "https://www.rbi.org.in/Scripts/Opportunities.aspx",  // Government site
},
```

**Recommendation**: Validate these URLs periodically as they may change.

---

### Issue #3: Missing Image Assets
**Files with potential missing images**:
- [Build-Project/artifacts/job-portal/index.html#L7](Build-Project/artifacts/job-portal/index.html#L7) - favicon.svg (✅ exists)
- Logo/branding images referenced in JobCard components

**Available assets**:
```
public/
├── favicon.svg
├── logo.png
├── opengraph.jpg
└── images/
```

---

## 5. APPLICATION TRACKING / STATUS FEATURES ✅

### Location
- **Frontend**: [Build-Project/artifacts/job-portal/src/pages/ApplicationTracker.tsx](Build-Project/artifacts/job-portal/src/pages/ApplicationTracker.tsx)
- **Backend**: [Build-Project/artifacts/api-server/src/routes/applications.ts](Build-Project/artifacts/api-server/src/routes/applications.ts)
- **Admin Panel**: [Build-Project/artifacts/job-portal/src/pages/AdminPanel.tsx](Build-Project/artifacts/job-portal/src/pages/AdminPanel.tsx)

### Status Workflow
```typescript
// Valid application statuses
type ApplicationStatus = 
  | "Pending"      // Initial application
  | "Reviewed"     // HR reviewed
  | "Interview"    // Interview scheduled
  | "Offered"      // Offer made
  | "Rejected"     // Application rejected
  | "REDIRECTED"   // External job application tracking
```

### User Tracking Page
```tsx
// ApplicationTracker.tsx shows:
const STATUS_STEPS = ["Pending", "Reviewed", "Interview", "Offered"];

// Each application displayed with:
// - Status badge
// - Applied date
// - Step-by-step progress indicator
// - Job details (title/company)
// - Link to job listing
// - Rejection notification for failed applications
```

### Admin Status Update API
```typescript
// PATCH /api/applications/:id/status
router.patch("/applications/:id/status", async (req, res) => {
  const { status } = req.body;  // One of: Pending, Reviewed, Interview, Offered, Rejected
  // Updates application status
  // Admin panel auto-sends notifications on status changes
});
```

### Dashboard Stats
```typescript
// GET /api/admin/stats
// Returns:
{
  totalApplications: number,
  totalJobs: number,
  totalUsers: number,
  pendingApplications: number,
  offeredApplications: number,
  rejectedApplications: number,
  byStatus: { Pending: X, Reviewed: Y, ... },
  byCategory: { IT: X, NON_IT: Y, ... }
}
```

---

## 6. EXAM / STUDY MATERIALS ENDPOINTS ✅

### Location
- **API**: [Build-Project/artifacts/api-server/src/routes/exams.ts](Build-Project/artifacts/api-server/src/routes/exams.ts)
- **Frontend**: [Build-Project/artifacts/job-portal/src/pages/PgCetHub.tsx](Build-Project/artifacts/job-portal/src/pages/PgCetHub.tsx)

### API Endpoints
```typescript
// GET /api/exams - List all exams
router.get("/exams", async (req, res) => {
  const exams = await db.select().from(examsTable);
  const formatted = exams.map((e: any) => normalizeExamRecord(e));
  res.json(formatted);
});

// GET /api/exams/:id - Get specific exam
router.get("/exams/:id", async (req, res) => {
  // Returns exam with related study materials
});

// GET /api/study-materials - List all study materials
router.get("/study-materials", async (req, res) => {
  const materials = await db.select().from(studyMaterialsTable);
  res.json(formatted);
});
```

---

## SUMMARY TABLE

| Feature | Status | Location | Notes |
|---------|--------|----------|-------|
| Messages Feature | ✅ Complete | Messages.tsx + messages.ts | Full two-way messaging, HR replies |
| Message Reply API | ✅ Complete | messages.ts#L97 | Requires admin/hr role |
| Google OAuth | ⚠️ Config Needed | auth.ts | Requires env vars setup |
| Application Tracking | ✅ Complete | ApplicationTracker.tsx | 5-step workflow + admin control |
| Exams/Study Materials | ✅ Complete | exams.ts | Fully implemented |
| External Job Links | ⚠️ Verify | seed-data.ts | Links should be validated |
| Favicon | ✅ Fixed | public/favicon.svg | Asset exists |

---

## ENVIRONMENT VARIABLES CHECKLIST

```bash
# OAuth Configuration
GOOGLE_CLIENT_ID=<required>
GOOGLE_CLIENT_SECRET=<required>
GITHUB_CLIENT_ID=<required>
GITHUB_CLIENT_SECRET=<required>
LINKEDIN_CLIENT_ID=<required>
LINKEDIN_CLIENT_SECRET=<required>
FACEBOOK_CLIENT_ID=<required>
FACEBOOK_CLIENT_SECRET=<required>

# Core URLs
OAUTH_CALLBACK_BASE_URL=http://localhost:3001
FRONTEND_URL=http://localhost:5173

# Database & Email
DATABASE_URL=postgresql://...
SMTP_HOST=<required for email>
SMTP_USER=<required>
SMTP_PASS=<required>
API_KEY=<optional for 3rd party APIs>
```

---

## ACTION ITEMS

1. **Verify OAuth Environment Variables** - Check `.env` and ensure Google/GitHub credentials are set
2. **Test Message Reply Endpoint** - Verify admin can reply to applicant messages
3. **Validate External Job Links** - Periodically check if applicationLink URLs are still active
4. **Fix `coverLetter` Response** - Include in application creation response
5. **Review "REDIRECTED" Status** - Ensure proper enum handling in zod schemas
6. **Test Favicon** - Confirm SVG loads in browser (should work, file exists)
7. **Check Email Configuration** - Ensure SMTP credentials are set for notifications
