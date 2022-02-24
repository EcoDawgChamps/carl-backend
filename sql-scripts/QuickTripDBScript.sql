DROP DATABASE IF EXISTS QuickTrip
GO

CREATE DATABASE QuickTrip
GO

USE QuickTrip
GO

CREATE SCHEMA QuickTripTables
GO

-- Create a new table called 'Make' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblMAKE', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblMAKE
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblMAKE
(
    MakeId INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
    MakeName VARCHAR(50)
);
GO

-- Create a new table called 'Model' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblMODEL', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblMODEL
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblMODEL
(
    ModelId INT IDENTITY(1,1) NOT NULL PRIMARY KEY, -- primary key column
    MakeId INT NOT NULL FOREIGN KEY REFERENCES QuickTripTables.tblMAKE(MakeId),
    ModelName VARCHAR(50)
);
GO

-- Create a new table called 'Trim' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblTRIM', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblTRIM
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblTRIM
(
    TrimId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    TrimName VARCHAR(50)
);
GO

-- Create a new table called 'Rating' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblRATING', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblRATING
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblRATING
(
    RatingId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    Score INT
);
GO

-- Create a new table called 'EventType' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblEVENT_TYPE', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblEVENT_TYPE
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblEVENT_TYPE
(
    EventTypeId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    EventTypeName VARCHAR(50)
)
GO

-- Create a new table called 'Customer' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblCUSTOMER', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblCUSTOMER
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblCUSTOMER
(
    CustomerId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    CustomerFName VARCHAR(50),
    CustomerLName VARCHAR(50),
    DriversLicense VARCHAR(8)
);
GO

-- Create a new table called 'Insurance' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblINSURANCE', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblINSURANCE
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblINSURANCE
(
    InsuranceId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    CustomerID INT FOREIGN KEY REFERENCES QuickTripTables.tblCUSTOMER(CustomerID),
    InsuranceName VARCHAR(50)
);
GO

-- Create a new table called 'Car' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblCAR', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblCAR
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblCAR
(
    CarId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	ModelID INT FOREIGN KEY REFERENCES QuickTripTables.tblMODEL(ModelID),
    TrimID INT FOREIGN KEY REFERENCES QuickTripTables.tblTRIM(TrimID),
    CarYear INT,
    Color VARCHAR(20),
    VIN VARCHAR(20),
    Capacity int,
    Price NUMERIC(5, 2),
    CarLocation VARCHAR(75)
);
GO

-- Create a new table called 'Ownership' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblOWNERSHIP', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblOWNERSHIP
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblOWNERSHIP
(
    OwnershipId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    CustomerID INT FOREIGN KEY REFERENCES QuickTripTables.tblCUSTOMER(CustomerID),
    CarID INT FOREIGN KEY REFERENCES QuickTripTables.tblCAR(CarID),
    StartDate DATE,
    EndDate DATE,
    Cost NUMERIC(5, 2)
);
GO

-- Create a new table called 'Event' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblEVENT', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblEVENT
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblEVENT
(
    EventId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    CustomerID INT FOREIGN KEY REFERENCES QuickTripTables.tblCUSTOMER(CustomerID),
    OwnershipID INT FOREIGN KEY REFERENCES QuickTripTables.tblOWNERSHIP(OwnershipID),
    EventTypeID INT FOREIGN KEY REFERENCES QuickTripTables.tblEVENT_TYPE(EventTypeID),
    EventStartDate DATE,
    EventEndDate DATE
);
GO

-- Create a new table called 'Reviews' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblREVIEWS', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblREVIEWS
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblREVIEWS
(
    ReviewsId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    EventID INT FOREIGN KEY REFERENCES QuickTripTables.tblEVENT(EventID),
    RatingID INT FOREIGN KEY REFERENCES QuickTripTables.tblRATING(RatingID),
    ReviewBody VARCHAR(2000)
);
GO

-- Create a new table called 'Detail' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblDETAIL', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblDETAIL
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblDETAIL
(
    DetailId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    DetailName VARCHAR(100),
    DetailDescription VARCHAR(2000)
);
GO

-- Create a new table called 'Event_Detail' in schema 'QuickTripTables'
-- Drop the table if it already exists
IF OBJECT_ID('QuickTripTables.tblEVENT_DETAIL', 'U') IS NOT NULL
DROP TABLE QuickTripTables.tblEVENT_DETAIL
GO
-- Create the table in the specified schema
CREATE TABLE QuickTripTables.tblEVENT_DETAIL
(
    Event_DetailId INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
    EventID INT FOREIGN KEY REFERENCES QuickTripTables.tblEVENT(EventID),
    DetailID INT FOREIGN KEY REFERENCES QuickTripTables.tblDETAIL(DetailID)
);
GO