/*
  Warnings:

  - You are about to drop the column `summary` on the `Candidate` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phone]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('ACTIVE', 'BLOCKED', 'PENDING_VERIFICATION');

-- CreateEnum
CREATE TYPE "JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP');

-- CreateEnum
CREATE TYPE "WorkMode" AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');

-- CreateEnum
CREATE TYPE "TicketPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "TicketCategory" AS ENUM ('TECHNICAL', 'BILLING', 'ACCOUNT', 'OTHER');

-- AlterTable
ALTER TABLE "AuditLog" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "new_values" JSONB,
ADD COLUMN     "old_values" JSONB,
ADD COLUMN     "resource_url" TEXT,
ADD COLUMN     "status" TEXT,
ADD COLUMN     "user_agent" TEXT;

-- AlterTable
ALTER TABLE "Candidate" DROP COLUMN "summary",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "current_ctc" DOUBLE PRECISION,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "expected_ctc" DOUBLE PRECISION,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "languages_known" TEXT[],
ADD COLUMN     "nationality" TEXT,
ADD COLUMN     "notice_period" TEXT,
ADD COLUMN     "preferred_locations" TEXT[],
ADD COLUMN     "state" TEXT,
ADD COLUMN     "willing_to_relocate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "zip_code" TEXT;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "benefits" TEXT[],
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'INR',
ADD COLUMN     "department" TEXT,
ADD COLUMN     "experience_max" INTEGER,
ADD COLUMN     "experience_min" INTEGER,
ADD COLUMN     "job_type" "JobType" NOT NULL DEFAULT 'FULL_TIME',
ADD COLUMN     "location" TEXT,
ADD COLUMN     "skills" TEXT[],
ADD COLUMN     "work_mode" "WorkMode" NOT NULL DEFAULT 'ONSITE';

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN     "address" JSONB,
ADD COLUMN     "branding_color" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "founded_year" INTEGER,
ADD COLUMN     "gst_certificate_url" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "size" TEXT,
ADD COLUMN     "social_links" JSONB,
ADD COLUMN     "status" "OrganizationStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "TASProfile" ADD COLUMN     "pan_file_url" TEXT;

-- AlterTable
ALTER TABLE "Ticket" ADD COLUMN     "assigned_to_id" TEXT,
ADD COLUMN     "attachments" TEXT[],
ADD COLUMN     "category" "TicketCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "priority" "TicketPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "subject" TEXT NOT NULL DEFAULT 'Support Request';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "full_name" TEXT,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_phone_verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_login_at" TIMESTAMP(3),
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "preferences" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
