
const { response } = require('express')
const Usuario = require('../models/usuario')
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async (req, res = response) => {

    const {correo, password} = req.body

    try {

        const usuario = await Usuario.findOne({correo})
        if ( !usuario ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -- correo'
            })
        }

        if ( !usuario.estado ) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -- estado:false'
            })
        }

        const validPassword = bcryptjs.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos -- password'
            })
        }

        const token = await generarJWT(usuario.id)


        res.json ({
            usuario,
            token
        })

    } catch(error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el admin'
        })
    }

}

const googleSignIn = async (req, res = response) => {

    const {id_token} = req.body

    try {

        const { nombre, img, correo } = await googleVerify(id_token)
        
        let usuario = await Usuario.findOne({correo})

        if (!usuario) {

            const data = {
                nombre,
                correo,
                password: ':P',
                img,
                rol: "USER_ROLE",
                google: true
            }

            usuario = new Usuario(data)
            await usuario.save()
        }

        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador - usuario bloqueado'
            })
        }

        const token = await generarJWT(usuario.id)

        res.json({
            usuario,
            token
        })
        
    } catch (error) {
        res.status(400).json({
            ok: false,
            msg: 'Token de google no es válido'
        })
    }



}

module.exports = {
    login,
    googleSignIn
}