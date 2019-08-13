var express = require("express");
var Hospital = require("../models/hospitales");
var Medico = require("../models/medicos");
var usuario = require("../models/usuarios");

var app = express();

//Busqueda por colección
app.get("/coleccion/:tabla/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var tabla = req.params.tabla;
  var regex = new RegExp(busqueda, "i");
  var promesa;

  switch (tabla) {
    case "usuarios":
      promesa = buscarUsuarios(busqueda, regex);
      break;
    case "medicos":
      promesa = buscarMedicos(busqueda, regex);
      break;
    case "hospitales":
      promesa = buscarHospitales(busqueda, regex);
      break;
    default:
      return res.status(400).json({
        ok: false,
        mensaje: 'Error al buscar datos: usuarios, medicos y hospitales',
        error: {message: 'La tabla/coleccion no son correctos'}
  });
}

promesa.then( data => {
  res.status(200).json({
    ok: true,
    [tabla]: data
  });
});

});

//Busqueda General
app.get("/todo/:busqueda", (req, res, next) => {
  var busqueda = req.params.busqueda;
  var regex = new RegExp(busqueda, "i");

  Promise.all([
    buscarHospitales(busqueda, regex),
    buscarMedicos(busqueda, regex),
    buscarUsuarios(busqueda.regex)
  ]).then(respuesta => {
    res.status(200).json({
      ok: true,
      hospitales: respuesta[0],
      medicos: respuesta[1],
      usuarios: respuesta[2]
    });

    buscarHospitales(busqueda, regex).then(hospitales => {
      res.status(200).json({
        ok: true,
        hospitales: hospitales
      });
    });
  });
});

function buscarHospitales(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Hospital.find({ nombre: regex })
      .populate({ path: "usuario", select: "nombre email" })
      .exec((err, hospitales) => {
        if (err) {
          reject("Error al cargar hospitales", err);
        } else {
          resolve(hospitales);
        }
      });
  });
}

function buscarMedicos(busqueda, regex) {
  return new Promise((resolve, reject) => {
    Medico.find({ nombre: regex })
      .populate({ path: "usuario", select: "nombre email" })
      .populate({ path: "hospital" })
      .exec((err, medicos) => {
        if (err) {
          reject("Error al cargar los medicos", err);
        } else {
          resolve(medicos);
        }
      });
  });
}

function buscarUsuarios(busqueda, regex) {
  return new Promise((resolve, reject) => {
    usuario
      .find({}, "nombre email img role")
      .or([{ nombre: regex }, { enail: regex }])
      .exec((err, usuarios) => {
        if (err) {
          reject("Error al cargar usuarios", err);
        } else {
          resolve(usuarios);
        }
      });
  });
}

module.exports = app;
