const sql = require("mssql");

class Customer {
  static async getCustomerByEmail(email) {
    const customers = await sql.query(`SELECT * FROM QuickTripTables.tblCustomer WHERE Email = '${email}'`);
    return customers;
  }

  static async saveCustomer(body) {
    await sql.query(`INSERT INTO QuickTripTables.tblCustomer (CustomerFName, CustomerLName, Email, Password, DriversLicense) VALUES('${body.CustomerFName}', '${body.CustomerLName}', '${body.Email}', '${body.Password}', '${body.DriversLicense}')`);

    const customer = await Customer.getCustomerByEmail(body.Email)
    return customer;
  }
}

exports.Customer = Customer
