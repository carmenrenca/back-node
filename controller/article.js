'use strict'
var validator = require('validator');
var Article = require('../models/articles');
var fs = require('fs');
var path = require('path');
var Categoria= require('../models/categoria')
var index = require('../services/index');
var controller = {

    datosCurso: (req, res) => {
        var hola = req.body.hola;

        return res.status(200).send({
            curso: 'Master en Framenworks JS',
            autor: 'carmen Rendon WEB',
            URL: 'carmenrendon.es',
            hola

        });


    },

    decotoken: (req, res) => {

        try{
            var token = req.params.token;
            var tokendeco =index.decodeToken(token);
            return res.status(200).send({
                curso: 'token deco',
              tokendeco
    
            });
        }catch(err){
            return res.status(500).send({
                curso: 'error al devolver el token decodificado',
             
                tokendeco
    
            });
        }
    


    },

    test: (req, res) => {
        return res.status(200).send({
            message: 'Soy la acción test de mi controlador de articulos'
        });
    },

    //CREAR NUEVO ARTICULO

    save: (req, res) => {

        //recoger parametros por post 
        var params = req.body;

        console.log(params);

        //VALIDAR DATOS
        try {
            var validateTitle = !validator.isEmpty(params.title);
            var validate_cotent = !validator.isEmpty(params.content);
            var validate_stock = validator.isFloat(params.stock);
            var validate_precio = validator.isFloat(params.precio);
        } catch (err) {
           console.log("entra en catch")
            return res.status(200).send({
                message: 'Datos No validos!!'
            });
        }

        if (validateTitle && validate_cotent && validate_stock && validate_precio) {
            //crear el objeto a guardar
            var article = new Article();
            article.title = params.title;
            article.precio = params.precio;
            article.content = params.content;
        
            article.imagen = null;
            article.categoria=params.categoria;
            article.stock=params.stock;
            //asignar valores

            //guardar el articulo
            article.save((err, articleStore) => {


                if (err || !articleStore) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'El artículo no se ha guardado !!'
                    })
                }
                //devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    article: articleStore,
                    message:'El Articulo se ha guardado correctamente!!'
                });
            });

        } else {
            console.log("Los datos no son validos!!")
            return res.status(200).send({
               
                status: 'error',
                message: 'Los datos no son validos!!'
            });
        }

    },

    //SACAR TODOS LOS ARTÍCULOS

    getArticles: (req, res) => {

        var query = Article.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //Find sacar los datos de la bd
        query.sort('-_id').exec((err, articles) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  al  devolver los articulos!!'
                })
            }

            if (!articles) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay articulos para mostrar!!'
                })
            }

            return res.status(200).send({
                status: 'success',
                articles
            });
        });


    },


    getArticle: (req, res) => {

        //recoger el id de la URL

        var articleId = req.params.id;

        //comprobar que existe
        if (!articleId || articleId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el articulo!!'
            });
        }

        //buscar el articulo
        Article.findById(articleId, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulos!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                article
            });
        });
        //Devolver en json

    },


    getArticleCategoria: (req, res) => {

        //recoger el id de la URL

        var categoria = req.params.categoria;
console.log(categoria)
        //comprobar que existe
        if (!categoria || categoria == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe la categoria!!'
            });
        }
     
        //buscar el articulo
        Article.find({"categoria":categoria}, (err, article) => {

            if (err || !article) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulos!!'
                });
            }else{
                return res.status(200).send({
                    status: 'success',
                    article
                });
            }
         
        });
        //Devolver en json

    },
    //EDITAR ARTICULOS

    update: (req, res) => {

        //Recoger el ID del articulo por la URL

        var articleId = req.params.id;


        //Regoger los datos que llegan por put 
        var params = req.body;

        //Validar datos

        try {
            var validate_title = !validator.isEmpty(params.title);
            var validate_content = !validator.isEmpty(params.content);
            //var precio=  !validator.isEmpty(params.precio);

        } catch (err) {

            return res.status(200).send({
                status: 'error',
                message: 'Faltan datos por enviar!!'
            });

        }

        if (validate_title && validate_content) {
            //Find and Update
            console.log("entraa" + articleId);
            Article.findOneAndUpdate({ _id: articleId }, params, { new: true }, (err, articleUpdate) => {
                if (err) {
                    return res.status(500).send({
                        status: 'error',
                        message: 'Error al actualizar'
                    });
                }


                if (!articleUpdate) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'No existe el articulo!!'
                    });
                }
                return res.status(404).send({
                    status: 'success',
                    article: articleUpdate
                });

            });
        } else {
            return res.status(200).send({
                status: 'error',
                message: 'La validación no es correcta'
            });
        }


    },

    //ELIMINAR ARTICULO

    delete: (req, res) => {


        //RECOGER EL ID DEL LA URL
        var articleId = req.params.id;

        //fing and delete

        Article.findOneAndDelete({ _id: articleId }, (err, articleremove) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            if (!articleremove) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el articulo!!'
                });
            }
            return res.status(200).send({
                status: 'succes',
                article: articleremove
            });

        });



    },

    //SUBIDA DE ARCHIVOS 

    upload: (req, res) => {

        //configurar el modulo connect multiparty router/article.js (hecho)


        //recoger el fichero de la peticion 
        var file_name = 'imagen no subida..';

        console.log(req.files);
        if (!req.files) {
            return res.status(404).send({
                status: 'error',
                message: file_name
            });
        }
        //conseguir el nombre y la extensión del archivo

        var file_path = req.files.file0.path;
        var file_split = file_path.split('\\');

        var file_name = file_split[2];

        //extension del fichero 
        var extension_split = file_name.split('\.');
        var file_ext = extension_split[1];

        //comproba la extencion (solo imagenes )

        if (file_ext != 'png' && file_ext != 'jpg' && file_ext != 'jpeg' && file_ext != 'gif') {
            //borrar el artivo subido
            console.log("entra");
            fs.unlink(file_path, (err) => {
                return res.status(200).send({
                    status: "error",
                    message: 'La extension de la imagen no es valida!!!'
                });
            })
        } else {
            //Si todo es valido, bucar el artículo asignarle el nombre la img y actualizar
            var articleId = req.params.id;
            console.log(articleId);
            Article.findOneAndUpdate({ _id: articleId }, { imagen: file_name }, { new: true }, (err, articleUpdated) => {
                console.log(articleUpdated);
                if (err || !articleUpdated) {
                    return res.status(200).send({
                        status: "error",
                        message: "Error al guardar la imagen de articulo"
                    });
                }

                return res.status(200).send({
                    status: "success",
                    article: articleUpdated
                });
            });


        }



    },

    getImage: (req, res) => {
        var file = req.params.image;
        console.log(file);
        var path_file = './upload/article/' + file;

        fs.exists(path_file, (exists) => {
            console.log(exists);
            if (exists) {
                console.log("exiii");
                return res.sendFile(path.resolve(path_file));
            } else {
                return res.status(404).send({
                    status: 'error',
                    message: 'La imagen no existe'
                });
            }
        });
    },

    search: (req, res) => {

        //SACAR EL STRING A BUSCAR

        var searchstring = req.params.search;


        //FIND OR
        Article.find({
            "$or": [
                { "title": { "$regex": searchstring, "$options": "i" } },
                { "content": { "$regex": searchstring, "$options": "i" } },

            ]
        }).sort([['date', 'descending']]).exec((err, articles) => {


            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error en la petición!!!"

                });
            }
            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: "No hay articulos para mostrar con tu busquedad!!"

                });
            }
            return res.status(200).send({
                status: 'success',
                articles

            });
        })



    },

    
    searchCategoria: (req, res) => {

        //SACAR EL STRING A BUSCAR

        var searchstring = req.params.search;


        //FIND OR
        Article.find({
            "$or": [
                { "categoria": { "$regex": searchstring, "$options": "i" } },
              

            ]
        }).sort([['date', 'descending']]).exec((err, articles) => {


            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: "Error en la petición!!!"

                });
            }
            if (!articles || articles.length <= 0) {
                return res.status(404).send({
                    status: 'error',
                    message: "No hay articulos para mostrar con tu busquedad!!"

                });
            }
            return res.status(200).send({
                status: 'success',
                articles

            });
        })



    },


    
    saveCategori: (req, res) => {

        //recoger parametros por post 
        var params = req.body;

        console.log(params);

        //VALIDAR DATOS
        try {
            var validateTitle = !validator.isEmpty(params.title);
           
        } catch (err) {
            status: 'error'
            return res.status(200).send({
                message: 'Faltan datos por enviar!!'
            });
        }

        if (validateTitle) {
            //crear el objeto a guardar
            var categoria = new Categoria();
            categoria.title = params.title;
            categoria.imagen = null;
          categoria.artitulos=null;
            //asignar valores

            //guardar el articulo
            categoria.save((err, categoriaStore) => {


                if (err || !categoriaStore) {
                    return res.status(404).send({
                        status: 'error',
                        message: 'La categoria no se ha guardado !!'
                    })
                }
                //devolver una respuesta
                return res.status(200).send({
                    status: 'success',
                    categoria: categoriaStore
                });
            });

        } else {
            return res.status(200).send({
                status: 'error',
                message: 'Los datos no son validos!!'
            });
        }

    },

    getCategoria: (req, res) => {

        var query = Categoria.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //Find sacar los datos de la bd
        query.sort('-_id').exec((err, Categoria) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error  al  devolver la categoria!!'
                })
            }

            if (!Categoria) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay categoria para mostrar!!'
                })
            }

            return res.status(200).send({
                status: 'success',
                Categoria
            });
        });


    },

    deleteCategori: (req, res) => {


        //RECOGER EL ID DEL LA URL
        var categoriId = req.params.id;

        //fing and delete

        Categoria.findOneAndDelete({ _id: categoriId }, (err, categoriaremove) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al eliminar'
                });
            }
            if (!categoriaremove) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe la categoria!!'
                });
            }
            return res.status(200).send({
                status: 'succes',
                categoria: categoriaremove
            });

        });



    },
}; //end controller

module.exports = controller;