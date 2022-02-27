USE QuickTrip
GO

INSERT INTO QuickTripTables.tblMAKE(MakeName) SELECT DISTINCT MAKE FROM dbo.Car_Model_List
GO

CREATE TABLE tempMakeModelContainer (
	id int identity(1,1),
	MakeName VARCHAR(50),
	ModelName VARCHAR(50)
)

INSERT INTO tempMakeModelContainer(MakeName, ModelName)
select distinct Make, Model from dbo.Car_Model_List
go


DECLARE @RUN INT
SET @RUN = (select COUNT(*) FROM dbo.tempMakeModelContainer)

WHILE @RUN != 0 BEGIN
	DECLARE @MakeID INT, @MakeName VARCHAR(50), @ModelName  VARCHAR(50)
	SET @MakeName = (SELECT MakeName FROM tempMakeModelContainer WHERE id = @RUN)
	SET @ModelName = (SELECT ModelName FROM tempMakeModelContainer WHERE id = @RUN)
	EXEC QuickTripStoredProcs.GET_MAKE_ID @Make_Name = @MakeName, @M_ID = @MakeID OUTPUT

	INSERT INTO QuickTripTables.tblMODEL(MakeId, ModelName) VALUES (@MakeID, @ModelName)
	SET @RUN = @RUN - 1
END