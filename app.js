'use strict'

//cargar modulos de node  para crear el sevidor
var express = require('express');
var bodyParser =require('body-parser');


//Ejecurar express (http)
var app = express();

//Cargar ficheros rutas
var article_router = require('./routes/article');
var article_cliente = require('./routes/cliente');
var evento = require('./routes/evento');
//Midelwares

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



//CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

// Añadir prefijos a rutas /cargar rutas
app.use('/',article_router);
app.use('/',article_cliente);
app.use('/',evento);



app.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail has beed send 😃 and the id is ${info.messageId}`);
    res.send(info);
  });
});
async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: details.email,
      pass: details.password
    }
  });

  let mailOptions = {
    from: '"Fun Of Heuristic"<example.gimail.com>', // sender address
    to: user.email, // list of receivers
    subject: "Wellcome to Fun Of Heuristic 👻", // Subject line
    html: `<h1>Hi ${user.name}</h1><br>
    <h4>Thanks for joining us</h4>`
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}
//rutas o metodo de prueba para el API REST
/** 
app.get('/probando', (req, res)=>{
  //  var hola = req.body.hola;
  
return res.status(200).send({
    curso: 'Master en Framenworks JS',
    autor: 'carmen Rendon WEB',
    URL:'carmenrendon.es',
   // hola

});
});*/

//Exportar modulo(fichero actual)

module.exports = app;