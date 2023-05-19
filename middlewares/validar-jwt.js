const {response, request} = require('express');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request,res = response, next)=>{

    const token = req.header('x-token');

    if(!token){
        return res.status(401).json({
            msg: 'No hay Token en la peticion'
        })
    }

    try {

        const {uid} = jwt.verify( token , process.env.SECRETORPRIVATEKEY);
        const usuario = await Usuario.findById(uid);

        if( !usuario){
            return res.status(401).json({
                msg: 'Token no falido - usuario no existe en BD'
            })
        }

        //verificar si el uid si esta en true el estado
        if(!usuario.estado){
            return res.status(401).json({
                msg: 'Token no falido - usuario con estado en false'
            })
        }

        req.usuario = usuario;

        //console.log(payload);

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msg: 'Token no valido'
        })
        
    }

    //console.log(token);

   

}


module.exports = {
    validarJWT
}