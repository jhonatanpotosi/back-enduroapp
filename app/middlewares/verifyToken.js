const jwt = require('jsonwebtoken')
const config = require('../config/config.js')
const pool = require('../config/conection');
const verify = {}

verify.token = async (req, res, next) => {
    try {
        const token = req.headers['x-access-token']
        if (!token) res.status(403).json({message: "Acceso denegado"});
        else {
            const decoded = jwt.verify(token, config.SECRET)
            req.body.us_cdgo = decoded.us_cdgo
            req.body.us_perfil = decoded.us_perfil
            const resultUser = await pool.query('SELECT us_sede_sd_cdgo FROM usuario WHERE us_cdgo=? AND us_estado=1 and us_perfil_pf_cdgo=? LIMIT 1', [decoded.us_cdgo,decoded.us_perfil])
            if (resultUser.length === 0) res.status(403).json({message: "Usuario no encontrado"}) 
            req.body.us_sede_sd_cdgo = resultUser[0].us_sede_sd_cdgo
            next() 
        }
    } catch (error) {
        if ( error.message === "jwt malformed" ) res.status(403).json({message: "Token Invalido"})
    }   
}

module.exports = verify