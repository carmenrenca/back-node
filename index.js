'use strict'
var mongoose = require('mongoose');
 var app = require('./app');
 var port = 3900;
mongoose.set('useFindAndModify', false);
mongoose.Promise= global.Promise;

mongoose.connect('mongodb+srv://crendon:Nervion1**@basedatos-zew5r.mongodb.net/api_rest_blog?retryWrites=true&w=majority',{useNewUrlParser: true} ).then(()=>{

console.log('conexion a la base de datos se ha realizado con exito!!!');
//crear servidor y ponerme a escuchar peticiones http
app.listen(port, ()=>{
    console.log('Sevidor corriendo en http://localhost:'+port);
})
});
