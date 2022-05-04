const sql = require('mssql')

const config = {
  user: 'sa',
  password: 'Itsyalla@088',
  server: 'localhost',
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
