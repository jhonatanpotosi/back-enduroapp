const pool = require('../config/conection');
const tipoCargos = {}

tipoCargos.getTipoCargos = async(req, res) => {
    try {
        const { sd_cdgo } = req.params 
        // AND ca_cdgo!=1
        const resultTipoCargos = await pool.query('SELECT ca_cdgo, ca_desc FROM cargo WHERE ca_estado=1  AND ca_cdgo NOT IN(SELECT mt_cargo_ca_cdgo FROM mesa_trabajo WHERE mt_estado=1 AND mt_sede_sd_cdgo=?) ORDER BY ca_desc ASC', sd_cdgo) 
        if (resultTipoCargos.length != 0) res.status(200).json({ status: true, data: resultTipoCargos })
        else res.status(200).json({ status: false })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })   
    }
}

tipoCargos.addCargo= async(req, res)=>{
    try {
        const { ca_desc } = req.body
        const datos = {
            ca_desc: ca_desc,
            
        }
        await pool.query('INSERT INTO cargo SET ?', datos)
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
} 
module.exports = tipoCargos