var express = require('express');
var Medico = require('../models/medicos');
var mdAutenticacion = require('../middleware/autentitacion');

var app = express();


app.get('/', (req, res, next) => {

  var desde = req.query.desde || 0;
      desde = Number(desde);
  Medico.find({})
  .skip(desde)
  .limit(5)
  .populate('usuario', 'nombre email')
  .populate('hospital')
  .exec(
    (err, medicos) => {
      if ( err ) {
       res.status(500).json({
         ok: false,
         mensaje: 'No se pudo obtener los medicos!',
         error: err
       });
     }
     
     Medico.count({}, ( err, conteo) => {
      res.status(200).json({
        ok: true,
        medicos: medicos,
        total: conteo
      });
     });

   });
});


//Method create Medico
//To create user you should install body-parser

app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
    
  var body = req.body;

  var medico = new Medico({
      nombre: body.nombre,
      usuario: req.usuario._id,
      hospital: body.hospital
  });

  medico.save( (err, medicoGuardado) => {

      if ( err ) {
          return res.status(400).json({
              ok: false,
              mensaje: 'Error al crear medico',
              errors: err
          });
      }


      res.status(201).json({
          ok: true,
          medico: medicoGuardado
      });
  
  });
});

//Method to Update medico
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;
  var body = req.body;

  Medico.findById(id, (err, medico) => {
      if ( err ) {
          return res.status(500).json({
              ok: false,
              message: 'Error al buscar hospital',
              errors: err
          });
      }

      if ( !medico ) {

          return res.status(400).json({
              ok: false,
              message: `El medico no existe con el id ${id}`,
              errors: { message: 'No existe el medico con el ID'}
          });
      }

      medico.nombre = body.nombre;
      medico.usuario = req.usuario._id;
      medico.hospital = body.hospital;

      medico.save( (err, medicoGuardado ) => {
          if ( err ) {
              return res.status(400).json({
                  ok: false,
                  message: 'Error al actualizar medico',
                  errors: err
              });
          }

          medicoGuardado.password = 'ok';

          res.status(200).json({
              ok: true,
              medico: medicoGuardado
          });

      });
  });
});


//Method to Delete medico use id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

  var id = req.params.id;

  Medico.findByIdAndRemove(id, (err, medicoBorrado) => {
      if ( err ) {
          return res.status(500).json({
              ok: false,
              message: 'Error al eliminar el medico',
              errors: { mensaje: 'No existe el medico con el ID'}
          });
      }

      if ( err ) {
          return res.status(500).json({
              ok: false,
              message: 'Error al eliminar el medico',
              errors: err
          });
      }


      res.status(200).json({
          ok: true,
          medico: medicoBorrado
      });
  });
});


module.exports = app;