var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs');

//import Models
var Usuario = require('../models/usuarios');
var Medico = require('../models/medicos');
var Hospitales = require('../models/hospitales');

app.use(fileUpload());

app.put('/:tipo/:id', ( req, res, next ) => {
    
  var tipo = req.params.tipo;
  var id = req.params.id;
  //tipos de colecciones validas
  var tiposValidos = ['hospitales', 'medicos', 'usuarios'];
      if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Tipo de coleccion no validad',
          errors: {message: 'ipo de coleccion no validad'}
      });   
      }
    if( !req.files ){
      
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: {message: 'Debe selecionar la imagen'}
        });               
    
    }


    //Obtener datos del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    //Extensiones permitidas
    var extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if ( extensionesValidas.indexOf( extensionArchivo ) < 0) {
      return res.status(400).json({
        ok: false,
        mensaje: 'Error del tipo de imagen',
        errors: {message: 'Debe selecionar la imagen valida por ejemplo:' + extensionesValidas.join(', ')}
    });
    }

    //Nombre del archivo
    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extensionArchivo}`;

    //Mover el archivo
    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, err => {

      if (err) {
        return res.status(500).json({
          ok: false,
          mensaje: 'Error no se pudo mover la imagen',
          errors: err
      });
      }
      subirPorTipo(tipo, id, nombreArchivo, res );
    });
});

//subir por tipo

function subirPorTipo( tipo, id, nombreArchivo, res) {

  if (tipo === 'usuarios') {
    
    Usuario.findById( id, (err, usuario ) => {

      if (!usuario) {
        return res.status(400).json({
          ok: true,
          mensaje: 'El id de usuario no existe',
          errors: { message: 'El id del usuario no existe!'}
        });
      }
      var pathViejo = './upload/usuarios/' + usuario.img;

      //si existe elimina la anterior
      if( fs.existsSync(pathViejo)){
        fs.unlink(pathViejo);
      }

      usuario.img = nombreArchivo;
      usuario.save( (err, usuarioActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Petición realizada correctamente',
          usuario: usuarioActualizado
      });
      });

    });
  }

  if (tipo === 'medicos') {

    Medico.findById( id, (err, medico ) => {
  
      if (!medico) {
        return res.status(400).json({
          ok: true,
          mensaje: 'El id de medico no existe',
          errors: { message: 'El id del medico no existe!'}
        });
      }
      var pathViejo = './upload/medicos/' + medico.img;

      //si existe elimina la anterior
      if( fs.existsSync(pathViejo)){
        fs.unlink(pathViejo);
      }

      medico.img = nombreArchivo;
      medico.save( (err, medicoActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Petición realizada correctamente',
          medico: medicoActualizado
      });
      });
    });
  }

  if (tipo === 'hospitales') {
    Usuario.findById( id, (err, hospital ) => {

      if (!hospital) {
        return res.status(400).json({
          ok: true,
          mensaje: 'El id de hospital no existe',
          errors: { message: 'El id del hospital no existe!'}
        });
      }
      var pathViejo = './upload/medicos/' + hospital.img;

      //si existe elimina la anterior
      if( fs.existsSync(pathViejo)){
        fs.unlink(pathViejo);
      }

      hospital.img = nombreArchivo;
      hospital.save( (err, hospitalActualizado) => {
        return res.status(200).json({
          ok: true,
          mensaje: 'Petición realizada correctamente',
          hospital: hospitalActualizado
      });
      });

    });
  }

}

module.exports = app;