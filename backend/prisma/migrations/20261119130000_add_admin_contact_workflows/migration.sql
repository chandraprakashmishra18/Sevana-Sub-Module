CREATE TYPE "ContactMessageStatus" AS ENUM ('NEW', 'REVIEWED', 'CLOSED');

CREATE TABLE "ContactMessage" (
  "id" UUID NOT NULL,
  "name" VARCHAR(120) NOT NULL,
  "email" VARCHAR(255) NOT NULL,
  "subject" VARCHAR(180) NOT NULL,
  "message" VARCHAR(5000) NOT NULL,
  "status" "ContactMessageStatus" NOT NULL DEFAULT 'NEW',
  "reviewedAt" TIMESTAMPTZ(6),
  "reviewedById" UUID,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ContactMessage_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "ContactMessage_status_createdAt_idx" ON "ContactMessage"("status", "createdAt");
CREATE INDEX "ContactMessage_email_createdAt_idx" ON "ContactMessage"("email", "createdAt");

CREATE TABLE "AdminAuditLog" (
  "id" UUID NOT NULL,
  "actorUserId" UUID,
  "actorLabel" VARCHAR(120) NOT NULL,
  "action" VARCHAR(80) NOT NULL,
  "entityType" VARCHAR(80) NOT NULL,
  "entityId" VARCHAR(120) NOT NULL,
  "before" JSONB,
  "after" JSONB,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AdminAuditLog_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AdminAuditLog_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE INDEX "AdminAuditLog_createdAt_idx" ON "AdminAuditLog"("createdAt");
CREATE INDEX "AdminAuditLog_entityType_entityId_createdAt_idx" ON "AdminAuditLog"("entityType", "entityId", "createdAt");
