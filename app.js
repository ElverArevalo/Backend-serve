//PUNTO DE ENTRADA PARA NUESTRA APLICACION 

//Requires

var express =  require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')

//Inicializar variablers

var app = express();

// CORS

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
  });


// Body Parser

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// Importar Rutas

var appRoutes = require('./routes/app');
var MedicoRoutes = require('./routes/medico');
var UsuarioRoutes = require('./routes/usuario');
var LoginRoutes = require('./routes/login')
var HospitalRoutes = require('./routes/hospital');
var BusquedaRoutes = require('./routes/busqueda');
var UploadRoutes = require('./routes/upload');
var ImagenRoutes = require('./routes/imagenes')
//Conexion a la BD

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, res)=>{
 
if(err) throw err;
console.log('Base de datos: \x1b[32m%s\x1b[0m ',' online')
});

// Rutas
app.use('/medico', MedicoRoutes);
app.use('/hospital', HospitalRoutes);
app.use('/login', LoginRoutes);
app.use('/usuario', UsuarioRoutes);
app.use('/busqueda', BusquedaRoutes);
app.use('/upload', UploadRoutes);
app.use('/img', ImagenRoutes);
app.use('/', appRoutes);



//escuchar peticiones

app.listen(3000, ()=>{
console.log('Express serve puerto 3000: \x1b[32m%s\x1b[0m ',' online')
})