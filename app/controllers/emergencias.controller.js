const pool = require('../config/conection');
const emergencias = {}

emergencias.getEmergencias = async(req, res) => {
    try {
        const resultEmergencias = await pool.query(`SELECT eme_latitud AS latitud, eme_longitud AS longitud, DATE_FORMAT(eme_fecha_creacion,"%d/%m/%y") AS eme_fecha_creacion, eme_usuario_us_cdgo AS us_cdgo, CONCAT(us_nombres, ' ', us_apellidos) AS us_nombres FROM emergencias JOIN usuario ON eme_usuario_us_cdgo=us_cdgo WHERE eme_estado=1 ORDER BY eme_cdgo DESC`)
        if (resultEmergencias.length) {    
            res.status(200).json({ status: true, data: resultEmergencias })           
            
        } else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }    
}

module.exports = emergencias