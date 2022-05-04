const sql = require('mssql')

const config = {
  user: 'Capstone2022',
  password: 'Graduation!',
  server: 'IS-HAY08.iSchool.uw.edu',
  port: 1433,
  database: 'QuickTrip', //GET NEW DB NAME
  trustServerCertificate: true
};

const dbConnect = async () => {
  try {
    const conn = await sql.connect(config);
    console.log('connected to db')
    return conn;
  } catch(err) {
    console.log('Error connecting to the db: ', err)
  }
}

module.exports = dbConnect;
