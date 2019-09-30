


var express = require('express');

var app = express();




var mdAutenticacion = require('../middlewares/autenticacion');

var Hospital = require('../models/hospital');





//====================================================
//                OBTENER TODOS LOS HOSPITALES GET
//===================================================
app.get('/', (req, res, next) => {
    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre img email')
        .exec(

            (err, hospital) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }
                Hospital.count({}, (err, conteo)=>{
                    res.status(200).json({
                        ok: true,
                        hospital: hospital,
                        total: conteo
                    });
                });
               

            });


});

//====================================================
//                OBTENER  HOSPITAL POR ID GET
//===================================================

app.get('/:id', (req, res, next) => {

var id = req.params.id;
Hospital.findById(id)
.populate('usuario', 'nombre img email' )
.exec((err, hospital) => {
    if(err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar el hopital',
            errors: err
        });
    }

    if(!hospital) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El hospital con el Id ' + id + 'no existe',
            errors: 'No existe el hospital con el Id'
        });
    }

    res.status(200).json({
        ok: true,
        hospital: hospital,
      
        });
});

});

//====================================================
//                ACTUALIZAR UN  HOSPITAL PUT
//===================================================

   
app.put('/:id', mdAutenticacion.verificaToken ,( req, res) =>{
    var id = req.params.id;
    var body = req.body;
    var usuario = req.usuario._id;
    Hospital.findById(id, (err, hospital)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }
        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id'+ id + 'no existe' ,
                errors: { message: 'No existe el hospital con el ID'}
            });
        }
    
        hospital.nombre = body.nombre;
        hospital.img = body.img;
        hospital.usuario = usuario;
       // hospital.usuario = req.usuario._id;
       
    
        hospital.save((err, hospitalGuardado)=>{
            if(err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el hopital',
                    errors: err
                });
            }
    
                    
            
                 res.status(200).json({
                 ok: true,
                 hospital: hospitalGuardado,
               
                 });
    
            
        });
    
    });
    
     
    
    });


//====================================================
//                CREAR UN NUEVO HOSPITAL POST
//===================================================

app.post('/', mdAutenticacion.verificaToken , ( req, res) =>{

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: req.usuario._id
       
    });


    hospital.save((err, hospitalGuardado)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando hospital',
                errors: err
            });
        }
        
    res.status(201).json({
        ok: true,
        hospital: hospitalGuardado,
       
    });
    });


});



//====================================================
//                ELIMINAR UN HOSPITAL POR EL ID
//===================================================

app.delete('/:id', mdAutenticacion.verificaToken , (req, res)=>{
    var id = req.params.id;
    Hospital.findByIdAndRemove(id,  (err, hospitalBorrado)=>{
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el hospital',
                errors: err
            });
        }
             res.status(200).json({
             ok: true,
             hospital: hospitalBorrado,
            
             });

    })



});

module.exports = app;
