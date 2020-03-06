'use strict'

var express = require('express');
var RouterEvento =require('../controller/evento');

var router = express.Router();
var multipart= require('connect-multiparty');
var md_upload= multipart({uploadDir:'./upload/evento'});


//RUTAS PARA ÚTILES
router.get('/evento/get-image/:image', RouterEvento.getImage);
router.post('/evento/save',RouterEvento.save);
router.get('/evento/getenventos', RouterEvento.getEventos);
router.get('/evento/getEvento/:id', RouterEvento.getEvento);
router.post('/evento/upload-image/:id', md_upload, RouterEvento.upload);
router.delete('/evento/delete/:id',  RouterEvento.delete);
router.put('/evento/update/:id',  RouterEvento.update);
module.exports = router;
