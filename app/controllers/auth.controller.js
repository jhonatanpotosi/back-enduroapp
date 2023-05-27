const pool = require('../config/conection');
const jwt = require('jsonwebtoken')
const config = require('../config/config.js')
const url_servidor = require('../config/url_services')
const auth = {}

auth.signIn = async(req, res) => {
    try {
        const { email, password, tokenfcm } = req.body
        
        const resultUser = await pool.query('SELECT us_cdgo, us_perfil_pf_cdgo, us_clave, us_nombres, us_apellidos, us_alias, us_logo,us_sede_sd_cdgo, token FROM usuario WHERE us_correo=? AND us_estado=1 LIMIT 1', email)
        if (resultUser.length === 0) res.status(200).json({status: false, message: 'Usuario no encontrado'})
        else if (resultUser[0].us_clave != password) res.status(200).json({status: false, message: 'Contraseña inválida'})
        else {
            if (tokenfcm) await pool.query('UPDATE usuario SET ? WHERE us_cdgo=?', [{token: tokenfcm}, resultUser[0].us_cdgo])

            const token = await jwt.sign({
                us_cdgo: resultUser[0].us_cdgo,
                us_perfil: resultUser[0].us_perfil_pf_cdgo,
                us_nombres: resultUser[0].us_nombres,
                us_apellidos: resultUser[0].us_apellidos,
                us_alias: resultUser[0].us_alias,    
                us_sd_cdgo:resultUser[0].us_sede_sd_cdgo, 
                us_logo: (resultUser[0].us_logo) ? url_servidor + resultUser[0].us_logo : resultUser[0].us_logo
            }, config.SECRET)

            res.status(200).json({status: true, token: token})
        }        
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })  
    }
}

auth.verify = async(req, res) => {
    res.status(200).json({status: true})
}

module.exports = auth;