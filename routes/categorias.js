const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos, esAdminRole, tieneRole } = require('../middlewares');
const { validarJWT } = require('../middlewares');
const { crearCategoria, 
        obtenerCategorias, 
        obtenerCategoria, 
        actualizarCategoria, 
        categoriaDelete} = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators');


const router = Router();

//obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//obtener una categoria por id - publico
router.get('/:id',[
    check('id','No es un ID valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
],obtenerCategoria);

//crear categoria -. privado - cualquier persona con un token valido
router.post('/',[ 
        validarJWT,
        check('nombre','el nombre es obligatorio').not().isEmpty(), 
        validarCampos
    ] ,crearCategoria)

//actualizar categorias - privado - cualquiera con un token valido
router.put('/:id', [
    validarJWT,
    esAdminRole,
    check('nombre','el nombre es obligatorio').not().isEmpty(), 
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId)
],actualizarCategoria)

//eliminar categoria- privado - y si es admin - pasar estado de true a false
router.delete('/:id',[
    validarJWT,
    esAdminRole,
    //tieneRole('ADMIN_ROLE'),
    check('id', 'No es un ID Valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], categoriaDelete)


module.exports = router;