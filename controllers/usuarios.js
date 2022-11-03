const { response, request } = require('express');
const Usuario = require('../models/usuario');


const usuariosGet = (req = request, res = response)=> {
    
    const {q,nombre = "no name",apikey,page = 1,limit} = req.query;

    res.json({
        msg: 'get api - usuariosGet' ,
        q,
        nombre,
        apikey,
        page,
        limit
    })
  }

 const usuariosPost = async(req, res = response)=> {

    const body = req.body;
    const usuario = new Usuario( body );

    await usuario.save();

    res.json({
        msg: 'post api - usuariosPost' ,
        usuario
    })
  }

 const usuariosPut = (req, res = response)=> {

    const {id} = req.params;

    res.status(201).json({
        msg: 'put api - usuariosPut'  ,
        id
    })
  }

const usuariosPatch = (req, res = response)=> {
    res.json({
        msg: 'patch api - usuariosPatch'   
    })
  }

const usuariosDelete = (req, res = response)=> {
    res.json({
        msg: 'delete api - usuariosDelete'   
    })
  }

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}