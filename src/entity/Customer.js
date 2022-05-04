const sql = require("mssql");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;
const { v4: uuidv4 } = require('uuid');
const {send_magic_link} = require('../controllers/emails.js')


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

  static async register(email) {
    try {
      const newCustomer = {
        fName: "",
        lName: "",
        Email:email,
        MagicLink: uuidv4(),
        license: ""
      };
      let customer = await saveCustomer(newCustomer);
      let sendEmail = send_magic_link(email, customer.MagicLink, 'signup')
      return({ ok: true, message: "Customer created"});
    }catch (error) {
    return({ ok: false, error });
    }
  };

  static async login(req, res) {
    const { email, magicLink } = req.body;
    if (!email)
      return res.json({ ok: false, message: "All field are required" });
    if (!validator.isEmail(email))
      return res.json({ ok: false, message: "Invalid email" });
    try {
      const customer = await Customer.getCustomerByEmail(email);
      if(!customer){
        let reg = await register(email)
        res.send({ok:true, message:'Your account has been created, click the link in email to sign in 👻'})
      }else if(!magicLink){
        try{
          const customer = await sql.query(`UPDATE QuickTripTables.tblCustomer SET MagicLink='${uuidv4()}', MagicLinkExpired=${false} WHERE Email=${customer.Email})`)
          send_magic_link(email, customer.MagicLink)
          res.send({ok:true,message:'Hit the link in email to sign in'})
        }catch{
          res.send({ok:false,message:'Something bad happened🤔'})
        }
      }else if(customer.MagicLink == magicLink && !customer.MagicLinkExpired) {
        const token = jwt.sign(customer.toJSON(), jwt_secret, { expiresIn: "365d" }); //{expiresIn:'365d'}
        await sql.query(`UPDATE QuickTripTables.tblCustomer SET MagicLinkExpired=${true} WHERE Email=${customer.Email})`)
        res.json({ ok: true, message: "Welcome back", token, email });
      }else return res.json({ ok: false, message: "Magic link expired or incorrect 🤔" });
    } catch (error) {
      res.json({ ok: false, error });
    }
  };

  static async verify_token(req, res) {
    console.log(req.headers.authorization);
    const token = req.headers.authorization;
    jwt.verify(token, jwt_secret, (err, succ) => {
      err
      ? res.json({ ok: false, message: "something went wrong" })
      : res.json({ ok: true, succ });
    });
  };
}

exports.Customer = Customer
