const pool = require('../config/conection');
const convenios = {}

convenios.addConvenio= async(req, res)=>{
    try {
        const { co_desc, co_empresa_em_cdgo, co_tipo_convenios_tp_cdgo } = req.body
        const datos = {
            co_desc: co_desc,
            co_empresa_em_cdgo: co_empresa_em_cdgo,
            co_tipo_convenios_tp_cdgo: co_tipo_convenios_tp_cdgo,
        }
        await pool.query('INSERT INTO convenios SET ?', datos)
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
} 

convenios.searchConvenio = async(req, res) => {
    try {        
        const { co_cdgo } = req.params
        const resultConvenio = await pool.query('SELECT co_cdgo, co_desc, tp_desc AS co_tipo_convenio FROM convenios JOIN tipo_convenios ON tp_cdgo=co_tipo_convenios_tp_cdgo WHERE co_cdgo=? AND co_estado=1 LIMIT 1', co_cdgo)
        if (resultConvenio.length != 0) res.status(200).json({ status: true, data: resultConvenio[0]})
        else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

convenios.updateConvenio = async (req,res) => {
    try {
        let datos_actualizar = {};
        const { co_cdgo } = req.params
        const { co_desc, co_tipo_convenios_tp_cdgo } = req.body;
        datos_actualizar.co_desc = co_desc;
        datos_actualizar.co_tipo_convenios_tp_cdgo = co_tipo_convenios_tp_cdgo

        const updateConvenio = await pool.query('UPDATE convenios SET ? WHERE co_cdgo=?', [datos_actualizar, co_cdgo])

        if (updateConvenio.affectedRows)  res.status(200).json({ status: true });
        else res.status(200).json({ status: false });

    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

convenios.deleteConvenios = async (req, res) => {
    try {
        await pool.query('UPDATE convenios SET ? WHERE co_cdgo=?', [{co_estado: 0}, req.params.co_cdgo])
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

module.exports = convenios