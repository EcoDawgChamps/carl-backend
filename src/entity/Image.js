const sql = require("mssql");

class Image {
  static async saveCarImage(carID, name, path) {
    await sql.query(`INSERT INTO QuickTripTables.tblCar_Images (CarID, CarImageName, CarImagePath) VALUES (${carID}, '${name}', '${path}')`);
  }

  static async updateCarImage(carID, name, path) {
    await sql.query(`UPDATE QuickTripTables.tblCar_Images SET CarImageName = '${name}', CarImagePath = '${path}' WHERE CarId='${carID}';`);

  }
}

exports.Image = Image
