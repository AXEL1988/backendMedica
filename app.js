//Requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Inicializar variable
var app = express();

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Importar Rutas
var appRoutes = require('./routes/app');
var usuarioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medicos');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');

//Conexion a la BD
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
if ( err ) throw err;
console.log('Base de datos: \x1b[32m%s\x1b[0m', 'online');
});

//Rutas
app.use('/usuarios', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/', appRoutes);

//Escuchar peticiones
app.listen(3000, () => {
    console.log('Servicio Express en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');    
});