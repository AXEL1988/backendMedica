var express = require("express");
var Usuario = require("../models/usuarios");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var SEED = require("../config/config").SEDD;

var app = express();
//Google
var CLIENT_ID = require("../config/config").CLIENT_ID;
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(CLIENT_ID);

//===============================
// Auth google
//===============================

async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: CLIENT_ID
  });
  const payload = ticket.getPayload();
  //const userid = payload['sub'];
  return {
    nombre: payload.name,
    email: payload.email,
    img: payload.picture,
    google: true
  };
}

app.post("/google", async (req, res) => {
  var token = req.body.toke;
  var googleUser = await verify(token).catch(e => {
    return res.status(403).json({
      ok: false,
      mensaje: "Token no válido!!"
    });
  });

  res.status(200).json({
    ok: true,
    mensaje: "ok!!",
    googleUser: googleUser
  });
});

//===============================
// Auth normal
//===============================

app.post("/", (req, res) => {
  var body = req.body;

  Usuario.findOne({ email: body.email }, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: "Error to find user",
        erros: err
      });
    }

    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        message: "Credentia fail - email",
        erros: { message: "La credencial es incorrecta" }
      });
    }

    if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        message: "Credentia fail- password",
        erros: { message: "La credencial es incorrecta" }
      });
    }

    //crear token
    var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

    res.status(200).json({
      ok: true,
      usuario: "ok",
      token: token,
      id: usuarioDB._id
    });
  });
});

module.exports = app;
