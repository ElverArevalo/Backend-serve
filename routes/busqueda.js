
var express = require('express');

var app = express();

var Hospital = require('../models/hospital');
var Medico = require ('../models/medico');
var Usuario = require ('../models/usuario');



///============================================
///     BUSQUEDA POR TABLA O COLECCION
///============================================

app.get('/coleccion/:tabla/:busqueda', (req, res) =>{
    var busqueda  = req.params.busqueda;
    var tabla  = req.params.tabla;
    var regex = new RegExp(busqueda, 'i');

    var promesa;

    switch (tabla) {
        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;
        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        default:
               return res.status(400).json({
                    ok: false,
                    mensaje: 'Los tipos de busquedas son: medicos, hospitales, usuarios  ',                 
                    err: {message: 'Tipo de talbla/coleccion no valido '},
                  
                });
          
    }

        promesa.then(data =>{
            res.status(200).json({
                ok: true,
              
                [tabla]: data,
        });

    });
    

});





///============================================
///              BUSQUEDA GENERAL
///============================================


app.get('/todo/:busqueda', (req, res, next)=> {


    var busqueda  = req.params.busqueda;
    var regex = new RegExp(busqueda, 'i');


    Promise.all ([
        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ])
    .then(respuesta =>{
        res.status(200).json({
            ok: true,
            hospitales: respuesta[0],
            medicos: respuesta[1],
            usuarios: respuesta[2]
        });
    })

    
});

function buscarHospitales(busqueda, regex){

    return new Promise((resolve, reject) =>{
        Hospital.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) =>{
            if(err){
                reject('Error al cargar hospitales', err);
            }else{
                resolve(hospitales)
            }

        });
    

    } );

  
}

function buscarMedicos(busqueda, regex){

    return new Promise((resolve, reject) =>{
        Medico.find({nombre: regex})
        .populate('usuario', 'nombre email')
        .exec((err, medicos) =>{
            if(err){
                reject('Error al cargar medicos', err);
            }else{
                resolve(medicos)
            }
            

        });

    } );
    

  
}

function buscarUsuarios(busqueda, regex){

    return new Promise((resolve, reject) =>{
       Usuario.find({}, 'nombre email role img')
       .or([{ 'nombre': regex  }, {'email': regex} ])
       .exec((err, usuarios)=>{

        if(err){
            reject('error al cargar usuario ', err)
        }else{
            resolve(usuarios)
        }
      

       });
       

    } );

  
}

  module.exports = app;