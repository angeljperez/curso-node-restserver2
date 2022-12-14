
const Role = require('../models/roles');
const Usuario = require('../models/usuario');


const esRoleValido = async(rol = '')=>{
    const existeRol = await Role.findOne({rol});
    if( !existeRol){
      throw new Error(`el rol ${rol} no esta registrado en la BD`)
    }
  }

const emailExiste = async(correo ='')=>{
 const existeEmail = await Usuario.findOne({correo});

    if(existeEmail){
      throw new Error(`el Email ${correo}, ya esta registrado en la BD`)
    }

}

const existeUsuarioPorId = async(id)=>{
  const existeUsuario = await Usuario.findById(id);
 
     if( !existeUsuario ){
       throw new Error(`el id  no existe: ${id}`);
     }
 
 }

  module.exports ={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId
  }