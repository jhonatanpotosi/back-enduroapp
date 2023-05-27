const pool = require('../config/conection');
const publicacionesMasivas = {}

publicacionesMasivas.addPublicacionMasiva = async(req, res) => {
    try {
        const { pu_desc, pu_link, us_cdgo } = req.body
        const datos = {
            pu_desc,
            pu_link,
            pu_usuario_us_cdgo: us_cdgo,
        }
        await pool.query('INSERT INTO publicacion SET ?', datos)
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}
publicacionesMasivas.updatePublicacionMasiva = async(req, res) => {
    try {
        const { pu_cdgo } = req.params
        const { pu_estado_publicacion_ep_cdgo } = req.body
        
        await pool.query('UPDATE publicacion SET pu_estado_publicacion_ep_cdgo=? WHERE pu_cdgo=?', [pu_estado_publicacion_ep_cdgo,pu_cdgo])
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}
publicacionesMasivas.getPublicacionesMasivas = async(req, res) => {
   
    try {
        var Publicaciones=[];
        const {us_perfil,us_sede_sd_cdgo}=req.body
        
        if(us_perfil==3){

            Publicaciones =  await pool.query("SELECT pu_cdgo,pu_desc, pu_link, pu_usuario_us_cdgo, pu_estado_publicacion_ep_cdgo,ep_desc,us_alias, sd_desc from publicacion JOIN usuario ON pu_usuario_us_cdgo=usuario.us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo JOIN estado_publicacion ON pu_estado_publicacion_ep_cdgo=ep_cdgo WHERE pu_estado=1 ORDER BY pu_estado_publicacion_ep_cdgo DESC")
        }
        // }else if(us_perfil==2){

        //     Publicaciones =  await pool.query("SELECT pu_cdgo,pu_desc, pu_link, pu_usuario_us_cdgo, pu_estado_publicacion_ep_cdgo,ep_desc,us_alias, sd_desc from publicacion JOIN usuario ON pu_usuario_us_cdgo=usuario.us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo JOIN estado_publicacion ON pu_estado_publicacion_ep_cdgo=ep_cdgo WHERE pu_estado=1 AND pu_estado_publicacion_ep_cdgo!=1 AND us_sede_sd_cdgo=? ORDER BY pu_estado_publicacion_ep_cdgo DESC",us_sede_sd_cdgo)

        // }
        // else{
        //     Publicaciones =  await pool.query("SELECT pu_cdgo,pu_desc, pu_link, pu_usuario_us_cdgo, pu_estado_publicacion_ep_cdgo,us_alias, sd_desc from publicacion JOIN usuario ON pu_usuario_us_cdgo=usuario.us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo WHERE pu_estado=1 and pu_estado_publicacion_ep_cdgo=2 ORDER BY pu_cdgo DESC")

        // }
        if (Publicaciones.length != 0) res.status(200).json({ status: true, data: Publicaciones })
        else res.status(200).json({ status: false })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

publicacionesMasivas.getPublicacionesMasivasInicio = async(req, res) => {
    
    try {
        var 
            Publicaciones =  await pool.query("SELECT pu_cdgo,pu_desc, pu_link, pu_usuario_us_cdgo, pu_estado_publicacion_ep_cdgo,ep_desc,us_alias, sd_desc from publicacion JOIN usuario ON pu_usuario_us_cdgo=usuario.us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo JOIN estado_publicacion ON pu_estado_publicacion_ep_cdgo=ep_cdgo WHERE pu_estado=1 and pu_estado_publicacion_ep_cdgo=2 ORDER BY pu_estado_publicacion_ep_cdgo ASC LIMIT 10")
        if (Publicaciones.length != 0) res.status(200).json({ status: true, data: Publicaciones })
        
        else res.status(200).json({ status: false })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}
module.exports = publicacionesMasivas;