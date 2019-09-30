var express = require('express');

var app = express();




var mdAutenticacion = require('../middlewares/autenticacion');

var Medico = require('../models/medico');




//====================================================
//                OBTENER TODOS LOS MEDICOS  GET
//===================================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);
    
    Medico.find({})
        .skip(desde)
        .limit(5)
       
        .exec(

            (err, medico) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medico',
                        errors: err
                    });
                }
                Medico.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        medico: medico,
                        total: conteo
                    });
                });
               

            });


});



//====================================================
//                ACTUALIZAR UN  MEDICO PUT
//===================================================

   
app.put('/:id', mdAutenticacion.verificaToken ,( req, res) =>{
    var id = req.params.id;
    var body = req.body;
    var usuario = req.usuario._id;
    var hospital = body.hospital
    Medico.findById(id, (err, medico)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }
        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico con el id'+ id + 'no existe' ,
                errors: { message: 'No existe el medico con el ID'}
            });
        }
    
        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.usuario = usuario;
        medico.hospital= body.hospital;
       
       
    
        medico.save((err, medicoGuardado)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el medico',
                    errors: err
                });
            }
    
                    
            
                 res.status(200).json({
                 ok: true,
                 medico: medicoGuardado,
               
                 });
    
            
        });
    
    });
    
     
    
    });

//====================================================
//                CREAR UN NUEVO MEDICO POST
//===================================================

app.post('/', mdAutenticacion.verificaToken , ( req, res) =>{

    var body = req.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
       usuario: req.usuario._id,
       hospital: body.hospital,
       
    });


    medico.save((err, medicoGuardado)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando medico',
                errors: err
            });
        }
        
    res.status(201).json({
        ok: true,
        medico: medicoGuardado,
       
    });
    });


});


//====================================================
//                ELIMINAR UN MEDICO POR EL ID
//===================================================

app.delete('/:id', mdAutenticacion.verificaToken , (req, res)=>{
    var id = req.params.id;
    Medico.findByIdAndRemove(id,  (err, medicoBorrado)=>{
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el medico',
                errors: err
            });
        }
             res.status(200).json({
             ok: true,
             medico: medicoBorrado,
            
             });

    })



});




module.exports = app;
