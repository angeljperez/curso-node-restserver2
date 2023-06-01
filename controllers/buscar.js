const { response } = require("express");
const { Usuario, Categoria, Producto } = require("../models");
const { ObjectId } = require("mongoose").Types;

const coleccionesPermitidas = [
    'usuarios',
    'categoria',
    'productos',
    'roles'
];

const buscarCategoria = async( termino= '', res=response) =>{

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID){
        const categoria= await Categoria.findById ( termino );
        return res.json({
            results: ( categoria ) ? [categoria] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const categorias = await Categoria.find({nombre: regex, estado:true});

    res.json({
        results: categorias
    })

}

const buscarProducto = async( termino= '', res=response) =>{

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID){
        const productos= await Producto.findById ( termino )
                                       .populate('categoria', 'nombre');
        return res.json({
            results: ( productos ) ? [productos] : []
        })
    }


    const regex = new RegExp( termino, 'i');

    const productos = await Producto.find({nombre: regex, estado:true})
                                    .populate('categoria', 'nombre');;

    res.json({
        results: productos
    })

}


const buscarUsuarios = async( termino= '', res=response) => {

    const esMongoID = ObjectId.isValid( termino );

    if( esMongoID){
        const usuario = await Usuario.findById ( termino );
        return res.json({
            results: ( usuario ) ? [usuario] : []
        })
    }

    const regex = new RegExp( termino, 'i');

    const usuarios = await Usuario.find({
        $or: [ { nombre: regex}, { correo: regex } ],
        $and: [ { estado: true }]
    });

    res.json({
        results: usuarios
    })

}

const buscar = (req, res = response)=>{

   const { coleccion, termino} = req.params;

   if ( !coleccionesPermitidas.includes( coleccion ) ){
        res.status(400).json({
            msg: `Las conecciones permitidas son : ${ coleccionesPermitidas }`
        })
   }

   switch (coleccion) {
    case 'usuarios':
        buscarUsuarios(termino, res);
    
    break;
    case 'categorias':
        buscarCategoria(termino, res);
    break;
    case 'productos':
        buscarProducto(termino, res);
    break;

    default:
        res.status(500).json({
            msg: 'Se le olvido hacer esta busqueda'
        })
   }


}


module.exports = {
    buscar
}