const pool = require('../config/conection');
const quejasReclamos = {}

quejasReclamos.addQuejasReclamos = async(req, res) => {
    try {
        const { pqrs_asunto, pqrs_desc, us_cdgo } = req.body
        const datos = {
            pqrs_asunto,
            pqrs_desc,
            pqrs_usuario_us_cdgo: us_cdgo,
        }
        
        await pool.query('INSERT INTO pqrs SET ?', datos)
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

quejasReclamos.getQuejasReclamos = async(req, res) => {
    const { us_perfil, us_sede_sd_cdgo } = req.body
    try {
        const resultQuejasReclamos =  await pool.query("SELECT pqrs_asunto, pqrs_desc, us_alias, sd_desc,IF(TIMESTAMPDIFF(MINUTE, created_at, NOW())<=60, CONCAT('Hace ', TIMESTAMPDIFF(MINUTE, created_at, NOW()), ' minutos'), IF(TIMESTAMPDIFF(HOUR, created_at, NOW()) BETWEEN 1 AND 24, CONCAT('Hace ', TIMESTAMPDIFF(HOUR, created_at, NOW()), ' horas'), IF(TIMESTAMPDIFF(DAY, created_at, NOW()) BETWEEN 1 AND 7, CONCAT('Hace ', TIMESTAMPDIFF(DAY, created_at, NOW()), ' dias'), CONCAT('Publicado el ', DATE_FORMAT(created_at,'%d/%m/%y'))))) AS fecha FROM pqrs JOIN usuario ON pqrs_usuario_us_cdgo=us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo WHERE pqrs_estado=1 ORDER BY pqrs_cdgo DESC")
        if (resultQuejasReclamos.length != 0) res.status(200).json({ status: true, data: us_perfil>2?resultQuejasReclamos:[] })
        else res.status(200).json({ status: false })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

module.exports = quejasReclamos