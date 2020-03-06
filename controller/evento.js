'use strict'
var validator = require('validator');
var Evento = require('../models/evento');
var fs = require('fs');
var path = require('path');

var controller = {
  //CREAR NUEVO EVENTO

  save: (req, res) => {

    //recoger parametros por post 
    var params = req.body;

    console.log(params);

    //VALIDAR DATOS
    try {
        var validateTitle = !validator.isEmpty(params.titulo);
        var validate_lugar =  validator.isURL(params.enlace);;
        var validate_descripcion = !validator.isEmpty(params.descripcion);
        var validate_date = !validator.isEmpty(params.date);
        var validate_enlace = validator.isURL(params.enlace);
            
    } catch (err) {
  
        return res.status(200).send({
            message: 'Faltan datos por enviar!!'
        });
    }
    if(!validate_enlace || !validate_lugar) {
      
        return res.status(200).send({
            message: 'Debe de Introducir Una URL Válida!!'
        });
    }
    if (validateTitle && validate_lugar && validate_descripcion && validate_date && validate_enlace ) {
        //crear el objeto a guardar
        var evento = new Evento();
        evento.titulo= params.titulo;
        evento.lugar= params.lugar;
        evento.descripcion= params.descripcion;
        evento.enlace=params.enlace;    
        evento.date=params.date;
        evento.imagen = null;
        evento.maps=params.maps;
        //guardar el evento
        evento.save((err, eventoStore) => {


            if (err || !eventoStore) {
                return res.status(404).send({
                    status: 'error',
                    message: 'El evento no se ha guardado !!'
                })
            }
            //devolver una respuesta
            return res.status(200).send({
                status: 'success',
                evento: eventoStore
            });
        });
      
   
    }  else {
        return res.status(200).send({
            status: 'error',
            message: 'Los datos no son validos!!'
        });
    }

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
            var eventoId = req.params.id;
            console.log(eventoId);
            Evento.findOneAndUpdate({ _id: eventoId }, { imagen: file_name }, { new: true }, (err, articleUpdated) => {
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
        var path_file = './upload/evento/' + file;

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

    //SACAR TODOS LOS EVENTOS

    getEventos: (req, res) => {

        var query = Evento.find({});

        var last = req.params.last;

        if (last || last != undefined) {
            query.limit(5);
        }

        //Find sacar los datos de la bd
        query.sort('-_id').exec((err, eventos) => {

            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al  devolver los eventos!!'
                })
            }

            if (!eventos) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No hay eventos para mostrar!!'
                })
            }

            return res.status(200).send({
                status: 'success',
                eventos
            });
        });


    },

    //BUSCAR POR EVENTO
    getEvento: (req, res) => {

        //recoger el id de la URL

        var EventoId = req.params.id;

        //comprobar que existe
        if (!EventoId || EventoId == null) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el evento!!'
            });
        }

        //buscar el articulo
        Evento.findById(EventoId, (err, evento) => {

            if (err || !evento) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el evento!!'
                });
            }
            return res.status(200).send({
                status: 'success',
                evento
            });
        });
        //Devolver en json

    },
   //EDITAR EVENTO

   update: (req, res) => {

    //Recoger el ID del articulo por la URL

    var eventoId = req.params.id;


    //Regoger los datos que llegan por put 
    var params = req.body;

    //Validar datos

    try {
        var validateTitle = !validator.isEmpty(params.titulo);
        var validate_lugar = !validator.isEmpty(params.lugar);
        var validate_descripcion = !validator.isEmpty(params.descripcion);

    } catch (err) {

        return res.status(200).send({
            status: 'error',
            message: 'Faltan datos por enviar!!'
        });

    }

    if (validateTitle && validate_lugar && validate_descripcion ) {
        //Find and Update
        console.log("entraa" + eventoId);
        Article.findOneAndUpdate({ _id: eventoId }, params, { new: true }, (err, eventoUpdate) => {
            if (err) {
                return res.status(500).send({
                    status: 'error',
                    message: 'Error al actualizar'
                });
            }


            if (!eventoUpdate) {
                return res.status(404).send({
                    status: 'error',
                    message: 'No existe el evento!!'
                });
            }
            return res.status(404).send({
                status: 'success',
                article: eventoUpdate
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
console.log("entra en delete")

    //RECOGER EL ID DEL LA URL
    var eventoId = req.params.id;

    //fing and delete

    Evento.findOneAndDelete({ _id: eventoId }, (err, eventoremove) => {
        if (err) {
            return res.status(500).send({
                status: 'error',
                message: 'Error al eliminar'
            });
        }
        if (!eventoremove) {
            return res.status(404).send({
                status: 'error',
                message: 'No existe el evento!!'
            });
        }
        return res.status(200).send({
            status: 'succes',
            article: eventoremove
        });

    });



},

}; //end controller

module.exports = controller;