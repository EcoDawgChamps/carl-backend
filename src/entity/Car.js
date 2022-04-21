const sql = require("mssql");
const { Image } = require("./Image");

class Car {
  static async getLastCar() {
    const car = await sql.query(`SELECT * FROM QuickTripTables.tblCAR WHERE CarId=(SELECT max(CarId) FROM QuickTripTables.tblCAR);`)

    return car;
  }

  static async saveCar(body, file) {
    const car = await sql.query(`INSERT INTO QuickTripTables.tblCAR (ModelID, CarYear, Color, VIN, Capacity,  CarLocation, Features) VALUES (${body.modelID}, ${body.carYear}, '${body.color}', '${body.vin}', ${body.capacity}, '${body.carLocation}', '${body.features}')`);

    const lastCar = await Car.getLastCar()
    await Image.saveCarImage(lastCar.recordset[0].CarId, body.CarImageName, file.path)

    return car;
  }

  static async updateCar(body, id, file) {
    // const car = await sql.query(`UPDATE QuickTripTables.tblCAR SET ModelID = ${body.modelID}, CarYear = ${body.carYear}, Color = '${body.color}', VIN = '${body.vin}', Capacity = ${body.capacity}, CarLocation = '${body.carLocation}', Features = '${body.features}' WHERE CarId = ${id};`);

    await Image.updateCarImage(id, body.CarImageName, file.path)

    return car;
  }

}

exports.Car = Car
