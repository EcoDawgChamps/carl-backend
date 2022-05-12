const nodemailer = require('nodemailer');
const sql = require("mssql");
const { Encrypter } = require("../utils/Encrypter")
require('dotenv').config();


class Customer {
  static async getCustomerByEmail(email) {
    const customers = await sql.query(`SELECT * FROM QuickTripTables.tblCustomer WHERE Email = '${email}'`);
    return customers;
  }

  static async saveCustomer(body) {
    await sql.query(`INSERT INTO QuickTripTables.tblCustomer (FName, LName, Email, Password, DriversLicense) VALUES('${body.fName}', '${body.lName}', '${body.email}', '${body.password}', '${body.driversLicense}')`);

    const customer = await Customer.getCustomerByEmail(body.email)
    return customer;
  }

  static async generateSSOLink (email) {
    const encrypter = new Encrypter("secret");
    const timestamp = Date.now();
    const encryptedEmail = encodeURIComponent(encrypter.encrypt(email));
    const encryptedStamp = encodeURIComponent(encrypter.encrypt(timestamp.toString()));
    const link = `http://localhost:4000/sso-login?email=${encryptedEmail}&timestamp=${encryptedStamp}`

    return link;
    // const dencrypted = encrypter.dencrypt(encrypted);
    // console.log({ worked: clearText === dencrypted });
  }

  static async sendMail(payload) {

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      }
    });

    let info = await transporter.sendMail({
      from: process.env.NODEMAILER_EMAIL, // sender address
      to: `${payload.email}`, // list of receivers
      subject: "Login to your app", // Subject line
      html: `
       <b>Click below link to get login to your app</b><br><br>
       <b>Link:</b> ${payload.link}
      `,
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
}

exports.Customer = Customer
