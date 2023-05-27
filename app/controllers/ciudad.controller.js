const pool = require('../config/conection');
const ciudad = {}

ciudad.addCiudad= async(req, res)=>{
    try {
        const { cd_desc } = req.body
        const datos = {
            cd_desc: cd_desc,
            
        }
        await pool.query('INSERT INTO ciudad SET ?', datos)
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
} 

ciudad.getCiudad = async(req, res) => {
    try {
        const resultCiudades = await pool.query('SELECT cd_cdgo AS id, cd_desc as nombre FROM ciudad WHERE cd_estado=1 ORDER BY cd_desc ASC') 
        if (resultCiudades.length != 0) res.status(200).json({ status: true, data: resultCiudades })
        else res.status(200).json({ status: false })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })   
    }
}  

module.exports = ciudad