
var express = require('express');

var app = express();

var bcrypt = require('bcryptjs');


var mdAutenticacion = require('../middlewares/autenticacion');

var Usuario = require('../models/usuario');





//====================================================
//                OBTENER TODOS LOS USUARIOS GET
//===================================================
app.get('/', (req, res, next) => {

    ///paginado
    var desde =  req.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role google')
        .skip(desde)
        .limit(5)
        .exec(

            (err, usuario) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, ( err, conteo)=>{

                    res.status(200).json({
                        ok: true,
                        usuario: usuario,
                        total: conteo
                    });
                })
               

            });


});




//====================================================
//                ACTUALIZAR UN  USUARIO PUT
//===================================================

   
app.put('/:id', mdAutenticacion.verificaToken ,( req, res) =>{
var id = req.params.id;
var body = req.body;

Usuario.findById(id, (err, usuario)=>{
    if (err) {
        return res.status(500).json({
            ok: false,
            mensaje: 'Error al buscar usuario',
            errors: err
        });
    }
    if (!usuario) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El usuario con el id'+ id + 'no existe' ,
            errors: { message: 'No existe el usuario con el ID'}
        });
    }

    usuario.nombre = body.nombre;
    usuario.email = body.email;
    usuario.role = body.role;

    usuario.save((err, usuarioGuardado)=>{
        if(err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al actualizar el usuario',
                errors: err
            });
        }

            usuarioGuardado.password = ':)';       
        
             res.status(200).json({
             ok: true,
             usuario: usuarioGuardado,
             usuarioToken: req.usuario
             });

        
    });

});

 

});


//====================================================
//                CREAR UN NUEVO USUARIO POST
//===================================================

app.post('/',  ( req, res) =>{

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        img: body.img,
        role: body.role,
       
    });


    usuario.save((err, UsuarioGuardado)=>{
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuarios',
                errors: err
            });
        }
        
        usuario.password =':)';
    res.status(201).json({
        ok: true,
        usuario: UsuarioGuardado,
        usuarioToken: req.usuario
    });
    });


});




//====================================================
//                ELIMINAR UN USUARIO POR EL ID
//===================================================

app.delete('/:id', mdAutenticacion.verificaToken , (req, res)=>{
    var id = req.params.id;

    Usuario.findByIdAndRemove(id,(err, usuarioBorrado)=>{
        if(err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar el usuario',
                errors: err
            });
        }
             res.status(200).json({
             ok: true,
             usuario: usuarioBorrado,
             usuarioToken: req.usuario
             });

    })



});

module.exports = app;



