-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_QuoteRequest" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_QuoteRequest" ("company", "createdAt", "email", "id", "name", "notes", "phone", "status", "updatedAt")
SELECT "company", "createdAt", "email", "id", "name", "notes", "phone",
  CASE
    WHEN "status" = 'pending' THEN 'NEW'
    WHEN "status" = 'contacted' THEN 'IN_REVIEW'
    WHEN "status" = 'approved' THEN 'ANSWERED'
    WHEN "status" = 'rejected' THEN 'CLOSED'
    ELSE "status"
  END,
  "updatedAt"
FROM "QuoteRequest";
DROP TABLE "QuoteRequest";
ALTER TABLE "new_QuoteRequest" RENAME TO "QuoteRequest";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
