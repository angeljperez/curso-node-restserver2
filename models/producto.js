const {Schema, model} = require('mongoose');


const ProductoShema = Schema({
    nombre:{
        type: String,
        required: [true,'El nombre es obligatorio'],
        unique: true
    },
    estado:{
        type: Boolean,
        default: true,
        required: true
    },
    usuario:{
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    precio:{
        type: Number,
        default: 0
        
    },
    categoria:{
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
        
    },
    descripcion: { type: String},
    disponible: {type:Boolean, default: true}
});

ProductoShema.methods.toJSON = function(){
    const { __V,_id,estado, ...data} = this.toObject();
    data.uid = _id;
    return data;
}

module.exports = model('Producto', ProductoShema)