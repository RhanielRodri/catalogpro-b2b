-- AlterDefault
ALTER TABLE "QuoteRequest" ALTER COLUMN "status" SET DEFAULT 'NEW';

-- NormalizeStatusValues
UPDATE "QuoteRequest"
SET "status" = CASE
  WHEN "status" = 'pending' THEN 'NEW'
  WHEN "status" = 'contacted' THEN 'IN_REVIEW'
  WHEN "status" = 'approved' THEN 'ANSWERED'
  WHEN "status" = 'rejected' THEN 'CLOSED'
  ELSE "status"
END;
