-- Create enum for user roles
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- Add role column to existing User table
ALTER TABLE "User"
ADD COLUMN "role" "UserRole" NOT NULL DEFAULT 'USER';

-- Create Category table for place types (restaurants, attractions, cinemas, etc.)
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "created_by_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- Ensure category names and slugs are unique
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- Link categories back to the user who created them (optional)
ALTER TABLE "Category"
ADD CONSTRAINT "Category_created_by_id_fkey"
FOREIGN KEY ("created_by_id") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

