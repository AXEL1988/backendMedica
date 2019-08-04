var express = require('express');
var Usuario = require('../models/usuarios');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middleware/autentitacion');

var app = express();

app.get('/', (req, res, next) => {

    Usuario.find({ },(err, usuarios) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'No se pudo obtener los usuarios',
                errors: err
            });               
        }

        res.status(200).json({
            ok: true,
            usuarios: usuarios            
        });
    });
});


//Method create User
//To create user you should install body-parser

app.post('/', mdAutenticacion.verificaToken, (req, res) =>{
    
    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save( (err, usuarioGuardado) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }


        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });
    
    });
});

//Method to Update user
app.put('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, (err, usuario) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error al buscar usuario',
                errors: err
            });
        }

        if ( !usuario ) {

            return res.status(400).json({
                ok: false,
                message: `El usuario no existe con el id ${id}`,
                errors: { message: 'No existe el usuario con el ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;


        usuario.save( (err, usuarioGuardado ) => {
            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    message: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = 'ok';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });
});


//Method to Delete user use id

app.delete('/:id', mdAutenticacion.verificaToken, (req, res) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el usuario',
                errors: { mensaje: 'No existe el usuario con el ID'}
            });
        }

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error al eliminar el usuario',
                errors: err
            });
        }


        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});




module.exports = app;