'use strict'

var express = require('express');
var ArticleController =require('../controller/article');
var token = require('../services/index');
var router = express.Router();
var multipart= require('connect-multiparty');
var md_upload= multipart({uploadDir:'./upload/article'});

//RUTAS DE PRUEBAS

router.post('/datos-curso', ArticleController.datosCurso);
router.get('/test-de-controlador', ArticleController.test);

//RUTAS PARA ÚTILES

router.post('/save',ArticleController.save);
router.post('/savecategori', ArticleController.saveCategori);
router.get('/getcategori', ArticleController.getCategoria);
router.get('/articles/:last?', ArticleController.getArticles);
router.get('/article/:id', ArticleController.getArticle);
router.get('/articlecategoria/:categoria', ArticleController.getArticleCategoria);
router.put('/article/:id', ArticleController.update);
router.delete('/article/:id', ArticleController.delete);
router.post('/upload-image/:id', md_upload, ArticleController.upload);
router.get('/get-image/:image', ArticleController.getImage);
router.get('/search/:search', ArticleController.search);
router.get('/searchCategori/:search', ArticleController.searchCategoria);
router.delete('/categori/:id' ,ArticleController.deleteCategori);

module.exports = router;
