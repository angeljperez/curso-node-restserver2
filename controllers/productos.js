const { response, request } = require("express");
const { Producto } = require("../models");
const producto = require("../models/producto");


const obtenerProductos = async(req = request, res = response)=>{
    const {limite = 6, desde = 0} = req.query;
    const query = {estado : true};

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
        .populate('usuario', 'nombre')
        .populate('categoria', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })
}


const obtenerProducto = async(req, res=response)=>{
    const { id } = req.params;
    const productos = await Producto.findById( id )
                            .populate('usuario', 'nombre')
                            .populate('categoria', 'nombre')
    res.json({
        productos
    })
}

const crearProducto = async(req, res= response)=>{
    
    const {estado, usuario, ...body} = req.body
  
    const productoDb = await Producto.findOne({ nombre: body.nombre });

    if( productoDb ){
        return res.status(400).json({
            msg: `El producto ${ productoDb.nombre }, ya existe`
        })
    }

    //generar la data a guardar del producto
    const data = {
        ...body,
        nombre : body.nombre.toUpperCase(),
        usuario : req.usuario._id
    }

   const producto = new Producto( data );
   
   //guardar en DB
   await producto.save();

   res.status(201).json(producto);

}


const actualizarProducto = async(req,res=response)=>{
    const { id } = req.params;
    const {estado, usuario, ...data} = req.body;

    if( data.nombre){
        data.nombre = data.nombre.toUpperCase();
    }
   
    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true});

    res.status(201).json({
        msg: 'put api - producto actualizado',
        producto
    })


}

const productoDelete = async(req, res= response)=>{
    const { id } = req.params;

    const producto = await Producto.findByIdAndUpdate (id , {estado: false}, {new : true});

    res.json(producto)
}




module.exports = {
    crearProducto,
    obtenerProductos,
    obtenerProducto,
    actualizarProducto,
    productoDelete
}