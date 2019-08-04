var express = require('express');
var Usuario = require('../models/usuarios');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEDD;

var app = express();

app.post('/', (req, res) => {

    var body = req.body;

    Usuario.findOne({ email: body.email}, (err, usuarioDB) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                message: 'Error to find user',
                erros: err
            });
        }

        if ( !usuarioDB) {
            return res.status(400).json({
                ok: false,
                message: 'Credentia fail - email',
                erros: { message: 'La credencial es incorrecta'}
            });
        }

        if ( !bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                message: 'Credentia fail- password',
                erros: { message: 'La credencial es incorrecta'}
            });
        }

        //crear token
        var token = jwt.sign({ usuario: usuarioDB}, SEED, {expiresIn: 14400});
        
        res.status(200).json({
            ok: true,
            usuario: 'ok',
            token: token,
            id: usuarioDB._id
    
        });

    });

});



module.exports = app;