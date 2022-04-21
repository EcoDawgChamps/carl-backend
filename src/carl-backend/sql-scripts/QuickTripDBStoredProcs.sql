USE QuickTrip
GO

DROP SCHEMA IF EXISTS QuickTripStoredProcs
GO

CREATE SCHEMA QuickTripStoredProcs
GO

-- Create a new stored procedure called 'ADD_NEW_CUSTOMER' in schema 'QuickTripStoredProcs'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'QuickTripStoredProcs'
    AND SPECIFIC_NAME = N'ADD_NEW_CUSTOMER'
)
DROP PROCEDURE QuickTripStoredProcs.ADD_NEW_CUSTOMER
GO

CREATE PROCEDURE QuickTripStoredProcs.ADD_NEW_CUSTOMER
    @Fname VARCHAR(50),
    @Lname VARCHAR(50),
    @License VARCHAR(8)
AS
    IF @Fname IS NULL OR @Lname IS NULL OR @License IS NULL
    BEGIN;
        THROW 50001, 'One or more of your parameters are null', 1
    END;
    INSERT INTO QuickTripTables.tblCUSTOMER
    (
     CustomerFName, CustomerLName, DriversLicense
    )
    VALUES
    (
        @Fname, @Lname, @License
    )
    GO
GO

-- Create a new stored procedure called 'GET_MAKE_ID' in schema 'QuickTripStoredProcs'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'QuickTripStoredProcs'
    AND SPECIFIC_NAME = N'GET_MAKE_ID'
)
DROP PROCEDURE QuickTripStoredProcs.GET_MAKE_ID
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE QuickTripStoredProcs.GET_MAKE_ID
    @Make_Name VARCHAR(50),
    @M_ID INT OUTPUT
AS
    SET @M_ID = (SELECT MakeID FROM QuickTripTables.tblMAKE WHERE @Make_Name = MakeName)
GO

-- Create a new stored procedure called 'ADD_NEW_MAKE' in schema 'QuickTripStoredProcs'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'QuickTripStoredProcs'
    AND SPECIFIC_NAME = N'ADD_NEW_MAKE'
)
DROP PROCEDURE QuickTripStoredProcs.ADD_NEW_MAKE
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE QuickTripStoredProcs.ADD_NEW_MAKE
    @M_Name VARCHAR(50)
AS
    IF @M_name IS NULL
    BEGIN;
        THROW 50001, 'One or more of your parameters are null', 1
    END;
    INSERT INTO QuickTripTables.tblMAKE (MakeName) VALUES (@M_Name)
GO

-- Create a new stored procedure called 'ADD_NEW_MODEL' in schema 'QuickTripStoredProcs'
-- Drop the stored procedure if it already exists
IF EXISTS (
SELECT *
    FROM INFORMATION_SCHEMA.ROUTINES
WHERE SPECIFIC_SCHEMA = N'QuickTripStoredProcs'
    AND SPECIFIC_NAME = N'ADD_NEW_MODEL'
)
DROP PROCEDURE QuickTripStoredProcs.ADD_NEW_MODEL
GO
-- Create the stored procedure in the specified schema
CREATE PROCEDURE QuickTripStoredProcs.ADD_NEW_MODEL
    @M_ID INT,
    @M_name VARCHAR(50)
AS
    IF @M_ID IS NULL OR @M_name IS NULL
    BEGIN;
        THROW 50001, 'One or more of your parameters are null', 1
    END;
    INSERT INTO QuickTripTables.tblMODEL (MakeID, ModelName) VALUES (@M_ID, @M_name)
    GO
GO