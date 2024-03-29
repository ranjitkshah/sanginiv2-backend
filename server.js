const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const nconf = require('nconf');
const app = express();

const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

var fileUpload = require('express-fileupload');
app.use(fileUpload({
  useTempFiles: true
}));
const cookieParser = require('cookie-parser');

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(cookieParser());
// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//swagger ui
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const db = require("./app/models");
if (process.env.NODE_ENV !== "test" ){

 db.sequelize.sync();
// db.sequelize.sync({alter: true});
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
// console.log('Drop and Resync Database with { force: true }');
// });
}


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Sangini-Backend " });
});

// routes
require("./app/routes/auth.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/spotify.routes")(app);
// set port, listen for requests
const PORT = process.env.PORT || 3001;
console.log(nconf.get('path'));
console.log('line no 55',nconf.get('NODE_ENV'));
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = app;