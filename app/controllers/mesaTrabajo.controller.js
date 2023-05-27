const pool = require('../config/conection');
const mesa_trabajo = {}

mesa_trabajo.addMesaTrabajo= async(req, res)=>{
    try {
        const { mt_fecha, mt_cargo_ca_cdgo, mt_usuario_us_cdgo, mt_sede_sd_cdgo } = req.body
        const datos={
            mt_fecha: mt_fecha,
            mt_cargo_ca_cdgo: mt_cargo_ca_cdgo,
            mt_usuario_us_cdgo: mt_usuario_us_cdgo,
            mt_sede_sd_cdgo: mt_sede_sd_cdgo
        }
        await pool.query('INSERT INTO mesa_trabajo SET ?', datos)
        if(mt_cargo_ca_cdgo==1){
             await pool.query('UPDATE usuario SET us_perfil_pf_cdgo=2 Where us_perfil_pf_cdgo!=3 and us_cdgo=?',mt_usuario_us_cdgo)}
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }



}

mesa_trabajo.deleteUserMesaTrabajo=async(req,res)=>{
    const {us_cdgo}=req.params

    try{
    await pool.query("UPDATE usuario us INNER JOIN mesa_trabajo mt ON(us.us_cdgo = mt.mt_usuario_us_cdgo) SET us.us_perfil_pf_cdgo=1 WHERE us.us_perfil_pf_cdgo!=3 and mt_usuario_us_cdgo=? and mt_cargo_ca_cdgo=1 and mt.mt_estado=1",us_cdgo)


    await pool.query('UPDATE mesa_trabajo SET mt_estado=0 Where mt_estado=1 and mt_usuario_us_cdgo=?',us_cdgo)
        res.status(200).json({ status: true});
} catch (error) {
    res.status(500).json({
        code: error.code,
        message: error.message
    })
}
}

mesa_trabajo.deleteMesaTrabajo=async(req,res)=>{
    const {sd_cdgo}=req.params

    try{
    await pool.query("UPDATE usuario us INNER JOIN mesa_trabajo mt ON(us.us_cdgo = mt.mt_usuario_us_cdgo) SET us.us_perfil_pf_cdgo=1 WHERE us.us_perfil_pf_cdgo!=3 and mt_usuario_us_cdgo=us_cdgo and mt_cargo_ca_cdgo=1 and mt.mt_estado=1 and mt_sede_sd_cdgo=?",sd_cdgo)


    await pool.query('UPDATE mesa_trabajo SET mt_estado=0 Where mt_estado=1 and mt_sede_sd_cdgo=?',sd_cdgo)
        res.status(200).json({ status: true});
} catch (error) {
    res.status(500).json({
        code: error.code,
        message: error.message
    })
}
}

module.exports = mesa_trabajo