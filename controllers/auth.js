const bcryptjs = require('bcryptjs');
const { response } = require('express');
const { generarJWT } = require('../helpers/generar-jwt');
const Usuario = require('../models/usuario');
const { googleVerify } = require('../helpers/google-verify');
const { CLOUD_RESOURCE_MANAGER } = require('google-auth-library/build/src/auth/baseexternalclient');


const login = async(req,res=response) =>{

    const{correo,password} = req.body

    try {

        //verificar si el email existe
        const usuario = await Usuario.findOne({ correo });

        if( !usuario ){
            return res.status(400).json({
                msg: 'Usuario/ Password no son correctos - correo'
            })
        }



        //si el usuario esta activo
        if( !usuario.estado ){
            return res.status(400).json({
                msg: 'Usuario/ Password no son correctos - estado: false'
            })
        }



        // verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);

        if(!validPassword){
            return res.status(400).json({
                msg: 'Usuario/ Password no son correctos - password'
            })
        }


        //general el JWT
        const token = await generarJWT( usuario.id);



        res.json({
           usuario,
           token
        })



    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }


   

}


const googleSignIn = async(req, res = response)=>{
    const {id_token} = req.body;

    try {
        
        const {correo, nombre, img} = await googleVerify( id_token);

        let usuario = await Usuario.findOne({ correo });

        if ( !usuario ){
            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: 'USER_ROLE',
                google: true
            }

            usuario = new Usuario( data );
            await usuario.save();
        }

        if ( !usuario.estado ){
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }
               
        //general el JWT
        const token = await generarJWT( usuario.id);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'El token no se pudo verificar'
        })
    }

 
}

module.exports = {
    login,
    googleSignIn
}