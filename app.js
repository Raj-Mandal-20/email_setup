const express = require('express');
const path = require('path');
const { send } = require('process');
const bodyParser = require('body-parser');
require('dotenv').config();
// const sendEmail = require('./awsConfig');
const mailSendFrom = require('./routers/sendingMail');



const app = express();
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
const port =  5000;


app.use(bodyParser.urlencoded({extented : true}));

app.use(mailSendFrom);



app.listen(port , ()=>{
    console.log(`APP runngin on PORT ${port}`)
});
