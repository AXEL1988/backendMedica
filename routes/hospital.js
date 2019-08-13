var express = require('express');
var Hospital = require('../models/hospitales');
var mdAutenticacion = require('../middleware/autentitacion');

var app = express();

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
        desde = Number(desde);

    Hospital.find({})
    .skip(desde)
    .limit(5)
    .populate({path: 'usuario',select: 'nombre email'})
    .exec(
        (err, hospitales) => {

            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'No se pudo obtener los hospitales',
                    errors: err
                });               
            }
    
            Hospital.count({}, (err, conteo) => {
                res.status(200).json({
                    ok: true,
                    hospitales: hospitales,
                    total: conteo           
                });
            });
        }
    )
});


//Method create Hospital
//To create user you should install body-parser

app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
    
    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( (err, hospitalGuardado) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: {message: 'Campo duplicado'}
            });
        }


        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    
    });
});

//Method to Update hospital
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar hospital',
                errors: err
            });
        }

        if ( !hospital ) {

            return res.status(400).json({
                ok: false,
                message: `El hospital no existe con el id ${id}`,
                errors: { message: 'No existe el hospital con el ID'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( (err, hospitalGuardado ) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar hospital',
                    errors: err
                });
            }

            hospitalGuardado.password = 'ok';

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });
    });
});


//Method to Delete hospital use id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el hospital',
                errors: { mensaje: 'No existe el hospital con el ID'}
            });
        }

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el hospital',
                errors: err
            });
        }


        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});




module.exports = app;