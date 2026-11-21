const assert = require("node:assert/strict");
const { beforeEach, test } = require("node:test");
const Module = require("node:module");
const jwt = require("jsonwebtoken");

process.env.JWT_SECRET = "test-only-sevana-auth-secret";

const users = new Map();
const organizations = new Map();
const campaigns = new Map();
const messages = new Map();
const auditEntries = [];
let sequence = 1;

const fakePrisma = {
  user: {
    findMany: async ({ where = {}, take, skip }) => [...users.values()].filter((row) => !where.OR || where.OR.some((part) => Object.values(part)[0].contains && String(row.fullName || row.email).toLowerCase().includes(Object.values(part)[0].contains.toLowerCase()))).slice(skip, skip + take).map(({ id, fullName, email, platformRole, isActive, createdAt }) => ({ id, fullName, email, platformRole, isActive, createdAt })),
    findUnique: async ({ where }) => users.get(where.id) || [...users.values()].find((user) => user.email === where.email) || null,
    update: async ({ where, data }) => { const row = users.get(where.id); Object.assign(row, data); return row; },
  },
  organization: {
    groupBy: async ({ by }) => grouped([...organizations.values()], by[0], "verificationStatus"),
    findMany: async ({ where = {}, take, skip }) => [...organizations.values()].filter((row) => !where.verificationStatus || row.verificationStatus === where.verificationStatus).slice(skip, skip + take),
    findUnique: async ({ where }) => organizations.get(where.id) || null,
    update: async ({ where, data }) => {
      const current = organizations.get(where.id);
      if (!current) throw new Error("missing organization");
      Object.assign(current, data, { updatedAt: new Date() });
      return current;
    },
  },
  campaign: {
    groupBy: async ({ by }) => grouped([...campaigns.values()], by[0], "status"),
    findMany: async ({ where = {}, take, skip }) => [...campaigns.values()].filter((row) => !where.status || row.status === where.status).slice(skip, skip + take),
    findUnique: async ({ where }) => campaigns.get(where.id) || null,
    update: async ({ where, data }) => {
      const current = campaigns.get(where.id);
      if (!current) throw new Error("missing campaign");
      Object.assign(current, data, { updatedAt: new Date() });
      return current;
    },
  },
  contactMessage: {
    groupBy: async ({ by }) => grouped([...messages.values()], by[0], "status"),
    create: async ({ data }) => {
      const row = { id: `message-${sequence++}`, ...data, status: "NEW", reviewedAt: null, createdAt: new Date(), updatedAt: new Date() };
      messages.set(row.id, row);
      return row;
    },
    findMany: async ({ where = {}, take, skip }) => [...messages.values()].filter((row) => !where.status || row.status === where.status).slice(skip, skip + take),
    findUnique: async ({ where }) => messages.get(where.id) || null,
    update: async ({ where, data }) => {
      const current = messages.get(where.id);
      if (!current) throw new Error("missing message");
      Object.assign(current, data, { updatedAt: new Date() });
      return current;
    },
  },
  adminAuditLog: {
    create: async ({ data }) => {
      const entry = { id: `audit-${sequence++}`, ...data, createdAt: new Date() };
      auditEntries.push(entry);
      return entry;
    },
    findMany: async ({ take, skip }) => auditEntries.slice(skip, skip + take),
  },
  $transaction: async (operation) => operation(fakePrisma),
  $disconnect: async () => {},
};

function grouped(rows, key) {
  const counts = new Map();
  for (const row of rows) counts.set(row[key], (counts.get(row[key]) || 0) + 1);
  return [...counts].map(([value, count]) => ({ [key]: value, _count: { _all: count } }));
}

const prismaPath = require.resolve("../src/config/prisma");
const mockModule = new Module(prismaPath, module);
mockModule.filename = prismaPath;
mockModule.loaded = true;
mockModule.exports = fakePrisma;
require.cache[prismaPath] = mockModule;

const { requireAuth, requirePlatformAdmin } = require("../src/middleware/auth.middleware");
const adminController = require("../src/controllers/admin.controller");
const contactController = require("../src/controllers/contact.controller");
const adminRoutes = require("../src/routes/admin.routes");
const contactRoutes = require("../src/routes/contact.routes");
const campRoutes = require("../src/routes/camp.routes");
const campaignRoutes = require("../src/routes/campaign.routes");
const organizationRoutes = require("../src/routes/organization.routes");
const { registerSchema } = require("../src/validators/auth.validator");
const { updateProfileSchema } = require("../src/validators/user.validator");

function token(id, claim = "INDIVIDUAL") {
  return jwt.sign({ sub: id, platformRole: claim }, process.env.JWT_SECRET, { expiresIn: "5m" });
}

function responseDouble() {
  return {
    statusCode: 200,
    body: undefined,
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

async function dispatchAdmin(handler, { id, claim = "INDIVIDUAL", method = "GET", body, params = {}, query = {} } = {}) {
  const req = { headers: {}, method, body, params, query };
  if (id) req.headers.authorization = `Bearer ${token(id, claim)}`;
  const res = responseDouble();
  let passed = false;
  requireAuth(req, res, () => { passed = true; });
  if (!passed) return { req, res };
  passed = false;
  await requirePlatformAdmin(req, res, () => { passed = true; });
  if (passed) await handler(req, res);
  return { req, res };
}

async function dispatchContact(body) {
  const req = { body };
  const res = responseDouble();
  await contactController.submit(req, res);
  return { req, res };
}

beforeEach(() => {
  users.clear(); organizations.clear(); campaigns.clear(); messages.clear(); auditEntries.length = 0; sequence = 1;
  users.set("admin-id", { id: "admin-id", email: "admin@example.test", platformRole: "ADMIN", isActive: true });
  users.set("ordinary-id", { id: "ordinary-id", fullName: "Ordinary User", email: "ordinary@example.test", platformRole: "INDIVIDUAL", isActive: true, createdAt: new Date() });
  users.set("owner-id", { id: "owner-id", fullName: "Organization Owner", email: "owner@example.test", platformRole: "INDIVIDUAL", isActive: true, createdAt: new Date(), memberships: [{ role: "OWNER", organizationId: "organization-id" }] });
  organizations.set("organization-id", { id: "organization-id", name: "Pending Org", verificationStatus: "PENDING", verifiedAt: null, createdAt: new Date(), type: "NGO", city: "Pune", state: "MH", email: "org@example.test" });
  campaigns.set("campaign-id", { id: "campaign-id", title: "Test campaign", status: "DRAFT", organizationId: "organization-id", organization: { verificationStatus: "PENDING" }, createdAt: new Date() });
});

test("unauthenticated requests cannot reach admin handlers", async () => {
  const { res } = await dispatchAdmin(adminController.listOrganizations);
  assert.equal(res.statusCode, 401);
});

test("moderation and inbox paths are wired behind both authentication and database role checks", () => {
  const protectedMiddleware = adminRoutes.stack.filter((layer) => !layer.route).map((layer) => layer.name);
  const routeMethods = adminRoutes.stack.filter((layer) => layer.route).map((layer) => `${Object.keys(layer.route.methods)[0]} ${layer.route.path}`);
  assert.deepEqual(protectedMiddleware, ["requireAuth", "requirePlatformAdmin"]);
  assert.deepEqual(routeMethods, [
    "get /summary", "get /organizations", "patch /organizations/:id/verification", "get /campaigns",
    "patch /campaigns/:id/moderation", "get /contact-messages", "patch /contact-messages/:id", "get /users", "patch /users/:id/platform-role", "get /audit-logs",
  ]);
  assert.equal(contactRoutes.stack.filter((layer) => layer.route).length, 1);
});

test("admin summary and minimal user search data are available to authorized admins", async () => {
  const summary = await dispatchAdmin(adminController.getSummary, { id: "admin-id" });
  assert.equal(summary.res.statusCode, 200);
  assert.equal(summary.res.body.data.organizations.byStatus.PENDING, 1);
  const listed = await dispatchAdmin(adminController.listAdminUsers, { id: "admin-id", query: { search: "ordinary" } });
  assert.equal(listed.res.statusCode, 200);
  assert.equal(listed.res.body.data[0].id, "ordinary-id");
  assert.equal("passwordHash" in listed.res.body.data[0], false);
});

test("private camp, campaign, and pending-organization reads parse optional bearer auth", () => {
  const protectedPreviews = [
    [campRoutes, "/:id"],
    [campaignRoutes, "/:id"],
    [campaignRoutes, "/:id/donations"],
    [campaignRoutes, "/:id/disbursements"],
    [organizationRoutes, "/:id/campaigns"],
  ];
  for (const [router, path] of protectedPreviews) {
    const route = router.stack.find((layer) => layer.route?.path === path);
    assert.ok(route, `missing GET ${path}`);
    assert.ok(route.route.methods.get, `GET ${path} is not registered`);
    assert.ok(route.route.stack.some((layer) => layer.name === "optionalAuth"), `GET ${path} must parse owner identity when supplied`);
  }
});

test("ordinary users and organization owners are denied even with an ADMIN token claim", async () => {
  for (const id of ["ordinary-id", "owner-id"]) {
    const { res } = await dispatchAdmin(adminController.listOrganizations, { id, claim: "ADMIN" });
    assert.equal(res.statusCode, 403);
  }
});

test("database-authorized admin can verify an organization and records an audit entry", async () => {
  const { res } = await dispatchAdmin(adminController.moderateOrganization, {
    method: "PATCH", id: "admin-id", params: { id: "organization-id" }, body: { status: "VERIFIED", reason: "Reviewed organization documents" },
  });
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.data.verificationStatus, "VERIFIED");
  assert.equal(organizations.get("organization-id").verificationStatus, "VERIFIED");
  assert.equal(auditEntries[0].action, "ORGANIZATION_VERIFICATION_CHANGED");
  const auditView = await dispatchAdmin(adminController.listAuditLogs, { id: "admin-id" });
  assert.equal(auditView.res.statusCode, 200);
  assert.equal(auditView.res.body.data[0].entityId, "organization-id");
});

test("authorized admins can provision and revoke admin roles with audit records", async () => {
  const promoted = await dispatchAdmin(adminController.updatePlatformRole, {
    method: "PATCH", id: "admin-id", params: { id: "ordinary-id" },
    body: { platformRole: "ADMIN", reason: "Assigning approved support access" },
  });
  assert.equal(promoted.res.statusCode, 200);
  assert.equal(users.get("ordinary-id").platformRole, "ADMIN");
  assert.equal(auditEntries.at(-1).action, "ADMIN_ROLE_CHANGED");
  const revoked = await dispatchAdmin(adminController.updatePlatformRole, {
    method: "PATCH", id: "admin-id", params: { id: "ordinary-id" },
    body: { platformRole: "INDIVIDUAL", reason: "Access review completed" },
  });
  assert.equal(revoked.res.statusCode, 200);
  assert.equal(users.get("ordinary-id").platformRole, "INDIVIDUAL");
});

test("ordinary users and organization owners cannot provision administrators", async () => {
  for (const id of ["ordinary-id", "owner-id"]) {
    const { res } = await dispatchAdmin(adminController.updatePlatformRole, {
      method: "PATCH", id, claim: "ADMIN", params: { id: "owner-id" },
      body: { platformRole: "ADMIN", reason: "Attempted self promotion" },
    });
    assert.equal(res.statusCode, 403);
  }
  assert.equal(users.get("owner-id").platformRole, "INDIVIDUAL");
});

test("admin cannot activate a campaign until its owning organization is verified", async () => {
  const { res } = await dispatchAdmin(adminController.moderateCampaign, {
    method: "PATCH", id: "admin-id", params: { id: "campaign-id" }, body: { status: "ACTIVE", reason: "Reviewed campaign content" },
  });
  assert.equal(res.statusCode, 409);
  assert.equal(campaigns.get("campaign-id").status, "DRAFT");
  assert.equal(auditEntries.length, 0);
});

test("contact submissions validate, persist, and do not claim email delivery", async () => {
  const { res } = await dispatchContact({ name: "Test Sender", email: "Sender@example.test", subject: "Question", message: "A sufficiently detailed test message." });
  assert.equal(res.statusCode, 201);
  assert.match(res.body.message, /stored for review/i);
  assert.match(res.body.message, /not been emailed/i);
  assert.equal(messages.size, 1);
  assert.equal([...messages.values()][0].email, "sender@example.test");
});

test("invalid and honeypot contact submissions are not stored", async () => {
  const invalid = await dispatchContact({ name: "x", email: "bad", subject: "a", message: "short" });
  assert.equal(invalid.res.statusCode, 400);
  const spam = await dispatchContact({ name: "Test Sender", email: "sender@example.test", subject: "Question", message: "A sufficiently detailed test message.", website: "spam.example" });
  assert.equal(spam.res.statusCode, 400);
  assert.equal(messages.size, 0);
});

test("only an authorized admin can review stored contact messages", async () => {
  const created = await dispatchContact({ name: "Test Sender", email: "sender@example.test", subject: "Question", message: "A sufficiently detailed test message." });
  const id = created.res.body.data.id;
  const denied = await dispatchAdmin(adminController.listContactMessages, { id: "owner-id", claim: "ADMIN" });
  assert.equal(denied.res.statusCode, 403);
  const reviewed = await dispatchAdmin(adminController.reviewContactMessage, {
    method: "PATCH", id: "admin-id", params: { id }, body: { status: "REVIEWED", reason: "Read by support admin" },
  });
  assert.equal(reviewed.res.statusCode, 200);
  assert.equal(messages.get(id).status, "REVIEWED");
  assert.equal(auditEntries.at(-1).action, "CONTACT_MESSAGE_REVIEWED");
});

test("registration and profile validators reject attempts to assign platformRole", () => {
  const registration = registerSchema.safeParse({ fullName: "Test User", email: "test@example.test", password: "long-enough-password", platformRole: "ADMIN" });
  assert.equal(registration.success, false);
  const profile = updateProfileSchema.safeParse({ fullName: "Test User", platformRole: "ADMIN" });
  assert.equal(profile.success, false);
});
