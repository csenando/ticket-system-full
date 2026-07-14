-- 002_add_imageurl_to_tickets.sql
-- Add ImageUrl column to Tickets table if it doesn't exist
IF COL_LENGTH('Tickets', 'ImageUrl') IS NULL
BEGIN
    ALTER TABLE Tickets
    ADD ImageUrl NVARCHAR(MAX) NULL;
END
GO
