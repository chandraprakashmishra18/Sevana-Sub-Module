CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'DECLINED', 'REVOKED');

CREATE TABLE "Notification" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "title" VARCHAR(180) NOT NULL,
  "message" TEXT NOT NULL,
  "type" VARCHAR(40) NOT NULL DEFAULT 'update',
  "href" VARCHAR(500),
  "isRead" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Notification_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "Notification_userId_isRead_createdAt_idx" ON "Notification"("userId", "isRead", "createdAt");

CREATE TABLE "CampFeedback" (
  "id" UUID NOT NULL,
  "campId" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "rating" INTEGER NOT NULL,
  "comment" TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "CampFeedback_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CampFeedback_campId_fkey" FOREIGN KEY ("campId") REFERENCES "Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CampFeedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CampFeedback_rating_check" CHECK ("rating" BETWEEN 1 AND 5)
);
CREATE UNIQUE INDEX "CampFeedback_campId_userId_key" ON "CampFeedback"("campId", "userId");
CREATE INDEX "CampFeedback_campId_createdAt_idx" ON "CampFeedback"("campId", "createdAt");

CREATE TABLE "CampInvitation" (
  "id" UUID NOT NULL,
  "campId" UUID NOT NULL,
  "inviterId" UUID NOT NULL,
  "inviteeId" UUID,
  "inviteeEmail" VARCHAR(255) NOT NULL,
  "role" VARCHAR(50) NOT NULL DEFAULT 'worker',
  "message" TEXT,
  "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMPTZ(6) NOT NULL,
  CONSTRAINT "CampInvitation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CampInvitation_campId_fkey" FOREIGN KEY ("campId") REFERENCES "Camp"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CampInvitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "CampInvitation_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX "CampInvitation_campId_inviterId_inviteeEmail_key" ON "CampInvitation"("campId", "inviterId", "inviteeEmail");
CREATE INDEX "CampInvitation_inviteeEmail_status_idx" ON "CampInvitation"("inviteeEmail", "status");
CREATE INDEX "CampInvitation_inviterId_createdAt_idx" ON "CampInvitation"("inviterId", "createdAt");

CREATE TABLE "UserXP" (
  "id" UUID NOT NULL,
  "userId" UUID NOT NULL,
  "eventType" VARCHAR(50) NOT NULL,
  "eventId" VARCHAR(120) NOT NULL,
  "amount" INTEGER NOT NULL,
  "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserXP_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserXP_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "UserXP_amount_check" CHECK ("amount" > 0)
);
CREATE UNIQUE INDEX "UserXP_userId_eventType_eventId_key" ON "UserXP"("userId", "eventType", "eventId");
CREATE INDEX "UserXP_userId_createdAt_idx" ON "UserXP"("userId", "createdAt");
