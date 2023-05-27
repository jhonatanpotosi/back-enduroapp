const pool = require('../config/conection');
const tipoCovenios = {}

tipoCovenios.getTipoConvenios = async(req, res) => {
    try {
        const { em_cdgo } = req.params 
        const resultTipoConvenios = await pool.query('SELECT tp_cdgo, tp_desc FROM tipo_convenios WHERE tp_estado=1 AND tp_cdgo NOT IN(SELECT co_tipo_convenios_tp_cdgo FROM convenios WHERE co_estado=1 AND co_empresa_em_cdgo=?) ORDER BY tp_desc ASC', em_cdgo) 
        if (resultTipoConvenios.length != 0) res.status(200).json({ status: true, data: resultTipoConvenios })
        else res.status(200).json({ status: false })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })   
    }
}

module.exports = tipoCovenios