const { Router } = require('express');
const { check } = require('express-validator');

const { validarJWT,
        validarCampos, 
        esAdminRole } = require('../middlewares');
const { crearProducto, 
        obtenerProductos, 
        obtenerProducto, 
        actualizarProducto, 
        productoDelete} = require('../controllers/productos');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');




const router = Router();

//obtener todas los productos - publico
router.get('/', obtenerProductos);

//obtener un producto por id - publico
router.get('/:id', [
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
],obtenerProducto);

//crear producto -. privado - cualquier persona con un token valido
router.post('/',[
    validarJWT,
    check('nombre','el nombre es obligatorio').not().isEmpty(),
    check('categoria','No es un ID Mongo valido').isMongoId(),
    check('categoria').custom(existeCategoriaPorId),
    validarCampos
    ],crearProducto);

//actualizar categorias - privado - cualquiera con un token valido
router.put('/:id',[
    validarJWT,
    esAdminRole,
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos 
],actualizarProducto);

//eliminar categoria- privado - y si es admin - pasar estado de true a false
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], productoDelete)


module.exports = router;