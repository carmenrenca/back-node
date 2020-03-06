'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var EventoSchema = Schema({
titulo: String,
lugar: String,
date : {type:Date, default: Date.now},
imagen: String,
descripcion:String,
enlace:String

});

module.exports = mongoose.model('Evento',EventoSchema);
