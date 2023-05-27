const pool = require('../config/conection');
const eventos = {}
const url_servidor = require('../config/url_services')
const { utilImage } = require('../utils/image')
const url_logo = 'images_eventos'

eventos.getEventos = async(req, res) => {
    try {
        const resultEventos = await pool.query('SELECT ev_cdgo, DATE_FORMAT(ev_fecha_inicio,"%d/%m/%y") AS ev_fecha_inicio, DATE_FORMAT(ev_fecha_fin,"%d/%m/%y") AS ev_fecha_fin, ev_desc, ev_img, sd_desc, IF(DATEDIFF(ev_fecha_inicio,now())>0,1,IF(DATEDIFF(ev_fecha_fin,now())<0,2,0)) AS ev_estado_ev, DATEDIFF(ev_fecha_inicio,now()) AS ev_faltante FROM evento JOIN usuario ON ev_usuario_us_cdgo=us_cdgo JOIN sede ON sd_cdgo=us_sede_sd_cdgo WHERE ev_estado=1 ORDER BY ev_estado_ev ASC,ev_fecha_inicio DESC')
        if (resultEventos.length != 0) {
            for (let i = 0; i < resultEventos.length; i++) {
                if (resultEventos[i].ev_img) resultEventos[i].ev_img = url_servidor+resultEventos[i].ev_img
            }
            res.status(200).json({ status: true, data: resultEventos })
        } else  res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

eventos.addEvento = async(req, res) => {
    try {
        const { us_sede_sd_cdgo, us_cdgo, ev_desc, ev_fecha_inicio, ev_fecha_fin, ev_lugar, ev_img, ev_url_video, } = req.body
        const datos = {
            ev_sede_sd_cdgo: us_sede_sd_cdgo,
            ev_usuario_us_cdgo: us_cdgo,
            ev_desc: ev_desc,
            ev_fecha_inicio: ev_fecha_inicio,
            ev_fecha_fin: ev_fecha_fin,
            ev_lugar: ev_lugar,
            ev_img: await utilImage.guardarImagen(ev_desc, ev_img, url_logo+'/'),
            ev_url_video: ev_url_video
        }
        await pool.query('insert into evento set ?', datos)
        res.status(200).json({ status: true });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

eventos.updateEvento = async(req, res) => {
    try {
        let datos_actualizar = {};
        const { ev_cdgo } = req.params
        const { us_sede_sd_cdgo, us_cdgo, ev_desc, ev_fecha_inicio, ev_fecha_fin, ev_lugar, ev_img, ev_url_img, ev_url_video } = req.body
        datos_actualizar.ev_sede_sd_cdgo =  us_sede_sd_cdgo
        datos_actualizar.ev_usuario_us_cdgo =  us_cdgo
        datos_actualizar.ev_desc = ev_desc
        datos_actualizar.ev_fecha_inicio = ev_fecha_inicio
        datos_actualizar.ev_fecha_fin = ev_fecha_fin
        datos_actualizar.ev_lugar = ev_lugar
        datos_actualizar.ev_url_video = ev_url_video
        if (ev_img) datos_actualizar.ev_img = await utilImage.guardarImagen(ev_desc, ev_img, url_logo+'/')
        
        const updateEvento = await pool.query('UPDATE evento SET ? WHERE ev_cdgo=?', [datos_actualizar, ev_cdgo])

        if (updateEvento.affectedRows) {
            try {                
                if (ev_img && ev_url_img) await utilImage.eliminarImagen(ev_url_img.replace(url_servidor, ''))
            } catch (error) { }
        } else {
            try {                
                if (ev_img) await utilImage.eliminarImagen(datos_actualizar.ev_img)
            } catch (error) { }
            res.status(200).json({ status: false, message: 'Action denied'});
        }
        res.status(200).json({ status: true });

    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

eventos.searchEvento = async(req, res) => {
    try {
        const { ev_cdgo } = req.params
        const resultEvento = await pool.query('SELECT ev_cdgo, ev_sede_sd_cdgo, ev_usuario_us_cdgo, DATE_FORMAT(ev_fecha_inicio,"%d/%m/%y") AS ev_fecha_inicio, DATE_FORMAT(ev_fecha_fin,"%d/%m/%y") AS ev_fecha_fin, ev_desc, ev_lugar, ev_img, us_nombres, sd_desc, DATEDIFF(ev_fecha_inicio,now()) AS ev_faltante, ev_url_video FROM evento JOIN usuario ON ev_usuario_us_cdgo=us_cdgo JOIN sede ON sd_cdgo=us_sede_sd_cdgo WHERE ev_cdgo=? AND ev_estado=1 LIMIT 1', ev_cdgo)
        
        if (resultEvento.length != 0) {
            if (resultEvento[0].ev_img) resultEvento[0].ev_img = url_servidor+resultEvento[0].ev_img
            res.status(200).json({ status: true, data: resultEvento[0] })
        } else res.status(200).json({ status: false })
        
    } catch (error) {
        res.status(500).json({
            status: false,
            code: error.code,
            message: error.message
        })
    }
}

eventos.deleteEvento = async (req, res) => {
    try {
        await pool.query('UPDATE evento SET ? WHERE ev_cdgo=?', [{ev_estado: 0}, req.params.ev_cdgo])
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}
 
module.exports = eventos;