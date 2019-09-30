var express = require('express');

var fileUpload = require('express-fileupload');

var fs = require('fs');

var app = express();

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');

// default options
app.use(fileUpload());




app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // TIPOS DE COLECCION 

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'] ;
    if( tiposValidos.indexOf(tipo) < 0){
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo de coleccion no es valida ',
            errors: { message: 'Tipo de coleccion no es valida' }
        });
    }

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada ',
            errors: { message: 'Debe sellecionar una Imagen' }
        });
    }


    /// OBTENER EL NOBRE DEL ARCHIVO 

    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length - 1];


    /// SOLO ESTAS EXTENSIONES ACEPTAMOS

    var extesencionesValidas = ['png', 'jpg', 'gif', 'jpeg'];


    if (extesencionesValidas.indexOf(extensionArchivo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no valida',
            errors: { message: 'Debe seleccionar una extension valida, las extensiones validas son:' + extesencionesValidas.join(', ') }
        });
    }


    /// NOMBRE DE ARCHIVO PERSONALIZADO
    /// 1214554-123.png

    var nombreArchivo = `${ id }-${new Date().getMilliseconds()}.${extensionArchivo}`;


    /// MOVER EL ARCHIVO DEL TEMPORAL A UN PATH 

    var path = `./uploads/${ tipo }/${ nombreArchivo}`;
    archivo.mv( path, err =>{
       if(err){
        return res.status(500).json({
            ok: false,
            errors: err,
    
        });
       }

       subirPorTipo(tipo, id, nombreArchivo, res);
    
    });
});

function subirPorTipo(tipo, id, nombreArchivo, res){

    if(tipo === 'usuarios'){

        Usuario.findById(id, (err, usuario) => {

            var  pathViejo = './uploads/usuarios/'+ usuario.img;
            
           

            /// si existe, elimina la imagen anterior
            if(fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);
            }
            usuario.img = nombreArchivo;

            usuario.save((err, usuarioActualizado)=>{
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado

                });

            });

        });
    }
    if (tipo === 'medicos'){
        Medico.findById(id, (err, medico) => {

            var pathViejo = './uploads/medicos/'+ medico.img;

            // si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)){
                fs.unlinkSync(pathViejo);

            }
            medico.img = nombreArchivo;
            
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });
            });

        });

    }
    if (tipo === 'hospitales') {
        Hospital.findById(id, (err, hospital) => {
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe, elmina la imagen anterior

            if (fs.existsSync(pathViejo)) {
                fs.unlinkSync(pathViejo);

            }
            hospital.img = nombreArchivo;

            hospital.save((err, hospitalActulizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualiozada',
                    hospital: hospitalActulizado
                });
            });

        });

    }
}



module.exports = app;