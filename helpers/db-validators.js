
const Role = require('../models/roles');
const {Usuario, Categoria, Producto }= require('../models');



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

/** Revisar si existe la categoria */ 

const existeCategoriaPorId = async(id)=>{
   const existeCategoria = await Categoria.findById(id);

   if( !existeCategoria ){
      throw new Error(`el id no existe: ${id}`);
   }
}

//revisar si existe  el producto
const existeProductoPorId = async(id)=>{
  const existeProducto = await Producto.findById(id);

  if( !existeProducto ){
     throw new Error(`el id no existe: ${id}`);
  }
}

  module.exports ={
    esRoleValido,
    emailExiste,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeProductoPorId
  }