var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

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
      
          res.status(200).json({
              ok: true,
              mensaje: 'Petición realizada correctamente',
              nombre: extensionArchivo
          });
    });

});

module.exports = app;