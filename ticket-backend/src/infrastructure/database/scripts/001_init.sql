-- 001_init.sql
-- Create Users Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Users' AND xtype='U')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(100) NOT NULL,
        Email NVARCHAR(255) NOT NULL UNIQUE,
        PasswordHash NVARCHAR(255) NOT NULL,
        Role NVARCHAR(50) NOT NULL DEFAULT 'USER', -- 'USER' or 'IT_AGENT'
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NULL
    );
END
GO

-- Create Tickets Table
IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Tickets' AND xtype='U')
BEGIN
    CREATE TABLE Tickets (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Title NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        Priority NVARCHAR(50) NOT NULL DEFAULT 'Low', -- 'Low', 'Medium', 'High', 'Critical'
        Status NVARCHAR(50) NOT NULL DEFAULT 'Open', -- 'Open', 'InProgress', 'Resolved'
        Category NVARCHAR(100) NULL,
        UserId INT NOT NULL FOREIGN KEY REFERENCES Users(Id),
        AssignedAgentId INT NULL FOREIGN KEY REFERENCES Users(Id),
        CreatedAt DATETIME NOT NULL DEFAULT GETDATE(),
        UpdatedAt DATETIME NULL
    );
END
GO
