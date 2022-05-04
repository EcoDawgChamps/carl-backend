const cors = require("cors");
const express = require('express');
const app = express();
const sql = require("mssql");
const multer = require('multer')
const path = require('path')
const bp = require("body-parser");
const bcrypt = require('bcryptjs');

const dbConnect = require('./db')
const { Customer } = require("./entity/Customer");
const { Car } = require("./entity/Car");
const { generateToken } = require('./utils/jwt.utils');
const { authorize } = require('./middlewares/auth.middleware')


dbConnect()

// Middlewares
app.use(cors());
app.use(bp.json())

// Display all cars
app.get('/list/cars', authorize(['customer']), async (req, res) => {
  try {
    const allCars = await sql.query(`SELECT * FROM QuickTripTables.tblCAR;`);
    return res.status(200).json({
      status: 'SUCCESS',
      data: allCars.recordset
    })
  }catch(err) {
    return res.status(400).json({
      status: 'FAILURE',
      message: `${err}`
    })
  }
})

// Display car with ID
app.get('/list/cars/:id', authorize(['customer']), async (req, res) => {
  try {
    const car = await sql.query(`SELECT * FROM QuickTripTables.tblCAR where CarID=${req.params.id};`);
    return res.status(200).json({
      status: 'SUCCESS',
      data: car.recordset
    })
  }catch(err) {
    return res.status(400).json({
      status: 'FAILURE',
      message: `${err}`
    })
  }
})

var storage = multer.diskStorage({
  destination: (req, file, callBack) => {
      callBack(null, './public/images/')     // './public/images/' directory name where save the file
  },
  filename: (req, file, callBack) => {
      callBack(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

var upload = multer({
  storage: storage
});

// Create a new car
app.post('/list/cars/new', authorize(['customer']), upload.single('image'), async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;
    const car = await Car.saveCar(body, file);

    return res.status(200).json({
      status: 'SUCCESS',
      data: car
    })
  }catch(err) {
    return res.status(400).json({
      status: 'FAILURE',
      message: `${err}`
    })
  }
})

// Update an existing car
app.put('/list/cars/:id', authorize(['customer']), async (req, res) => {
  try {
    const body = req.body;
    const file = req.file;
    const cID = req.params.id;

    const car = await Car.updateCar(body, cID, file);

    // let mID = req.body.modelID,
    //     year = req.body.carYear,
    //     color = req.body.color,
    //     vin = req.body.vin,
    //     capacity = req.body.capacity,
    //     features = req.body.features,
    //     location = req.body.carLocation;

    // const car = await sql.query(`UPDATE QuickTripTables.tblCAR SET ModelID = ${mID}, CarYear = ${year}, Color = '${color}', VIN = '${vin}', Capacity = ${capacity}, CarLocation = '${location}', Features = '${features}' WHERE CarId=${req.params.id};`);

    return res.status(200).json({
      status: 'SUCCESS',
      data: car
    })
  }catch(err) {
    return res.status(400).json({
      status: 'FAILURE',
      message: `${err}`
    })
  }
})

// Plan a new trip
app.post('/rent/trip/new', authorize(['customer']), async (req, res) => {
  try {
    let cID = req.body.customerID,
        oID = req.body.ownershipID,
        sDate = req.body.startDate,
        eDate = req.body.endDate;

    const trip = await sql.query(`INSERT INTO QuickTripTables.tblEVENT (CustomerID, OwnershipID, EventStartDate, EventEndDate) VALUES (${cID}, ${oID}, '${sDate}', '${eDate}')`);

    return res.status(200).json({
      status: 'SUCCESS',
      data: trip
    })
  }catch(err) {
    return res.status(400).json({
      status: 'FAILURE',
      message: `${err}`
    })
  }
})

// Create a new review
app.post('/event/:event_id/review/new', authorize(['customer']), async (req, res) => {
  try {
    let eID = req.params.event_id,
        stars = req.body.stars,
        body = req.body.reviewBody;

    const review = await sql.query(`INSERT INTO QuickTripTables.tblREVIEWS (EventID, Stars, ReviewBody) VALUES (${eID}, ${stars}, '${body}')`);

    return res.status(200).json({
      status: 'SUCCESS',
      data: review
    })
  }catch(err) {
    return res.status(400).json({
      status: 'FAILURE',
      message: `${err}`
    })
  }
})

// Get all cars owned by specific customer with customer_id
app.get('/firends/:friend_id/cars', authorize(['customer']), async (req, res)=> {
  try {
    const cars = await sql.query(`SELECT a.CarId, CarYear, VIN, CarLocation FROM QuickTripTables.tblCAR AS a LEFT OUTER JOIN QuickTripTables.tblOWNERSHIP AS b ON a.CarId = b.CarID  WHERE CustomerID=${req.params.friend_id};`)
    return res.status(200).json({
      status: 'SUCCESS',
      data: cars.recordset
    })
  }catch(err) {
    return res.status(400).json({
      status: 'FAILURE',
      message: `${err}`
    })
  }
})

// Login without SSO
app.post('/login', async(req, res) => {
  try {
    if(req.body.sso === false){
      const customer = await Customer.getCustomerByEmail(req.body.email)
      if (!customer.recordset.length) return res.status(200).send({ error: 'Customer does not exist' });
      const pass = await bcrypt.compare(req.body.password, customer.recordset[0].Password)
      if (!pass) return res.status(200).send({ error: 'Invalid Username or Password' });
      const resPayload = {
        email: customer.recordset[0].Email,
      }
      const token = generateToken(resPayload)
      resPayload['token'] = token
      return res.status(200).send(resPayload);
    }
    else{
      Customer.login(req, res)
    }

  } catch (e) {
    return res.status(500).send({
      'error': e.message
    });
  }
})

// Sign up
app.post('/signup', async (req, res) => {
  try {
    const body = req.body
    let customer = await Customer.getCustomerByEmail(req.body.email)
    if (customer.recordset.length) return res.status(200).send({ error: 'Email already in use!' });
    body.password = await bcrypt.hash(body.password, 5)
    const customerNew = await Customer.saveCustomer(body)
    if (!customerNew.recordset.length) {
      return res.status(200).send({ error: 'Unable to save customer' });
    }
    return res.status(200).send(customerNew.recordset[0]);
  } catch (e) {
    return res.status(500).send({
      'error': e.message
    });
  }
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('Example app listening at http://localhost:PORT')
})

