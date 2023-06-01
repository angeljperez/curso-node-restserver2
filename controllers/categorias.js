const { response, request } = require("express");
const {Categoria} = require('../models');

//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req = request ,res = response)=>{
    
    const {limite = 6, desde = 0} = req.query
    const query = {estado : true}
   
 

    const [total,categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
        

    ]);

   

    res.json({
        total,
        categorias
    })
}
//obtenerCategoria - populate {}
const obtenerCategoria = async(req, res = response) =>{
    const {id} = req.params;
    const categoria = await Categoria.findById( id ).populate('usuario', 'nombre');
    

    res.json({
        categoria
    })
}

const crearCategoria = async(req, res = response) =>{

    const nombre = req.body.nombre.toUpperCase();
    const categoriaDb = await Categoria.findOne({ nombre });

    if( categoriaDb ){
        return res.status(400).json({
            msg: `La Categoria ${ categoriaDb.nombre }, ya existe`
        })
    }

    //generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria( data );

    //guardar DB

    await categoria.save();

    res.status(201).json(categoria);


}


// actualizarCategoria
const actualizarCategoria = async(req, res = response)=>{
    const { id } = req.params;
    const {estado,usuario, ...data} = req.body;

    data.nombre = data.nombre.toUpperCase();
    data.usuario = req.usuario._id;

    const categoria = await Categoria.findByIdAndUpdate(id, data, {new: true});
    
    res.status(201).json({
        msg: 'put api- Categoria Actualizada',
        categoria
    })
}

const categoriaDelete = async(req, res = response)=> {
   
    const { id } = req.params;

  const categoria = await Categoria.findByIdAndUpdate( id, {estado : false}, {new: true});


    res.json(categoria);

  }

//borrarCategoria - estado : false

module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    categoriaDelete
}