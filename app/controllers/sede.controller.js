const pool = require('../config/conection');
const url_servidor = require('../config/url_services')
const { utilImage } = require('../utils/image')
const url_logo = 'images_logo_sedes';
const url_perfil = 'images_perfil_sedes';
const sedes = {}

sedes.getSedes = async(req, res) => {
    try {
        const resultSedes = await pool.query('SELECT sd_cdgo, sd_desc, sd_logo, sd_jersey FROM sede WHERE sd_estado=1 ORDER BY sd_cdgo DESC')
        if (resultSedes.length) {            
            for (let i = 0; i < resultSedes.length; i++) {
                if (resultSedes[i].sd_logo) resultSedes[i].sd_logo = url_servidor+resultSedes[i].sd_logo
                if (resultSedes[i].sd_jersey) resultSedes[i].sd_jersey = url_servidor+resultSedes[i].sd_jersey
            }
            res.status(200).json({ status: true, data: resultSedes })           
            
        } else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }    
}

sedes.addSede= async(req, res)=>{
    try {
        const { sd_desc, sd_logo, sd_jersey, sd_ciudad_cd_cdgo } = req.body
        const datos = {
            sd_desc,
            sd_logo: (sd_logo) ? await utilImage.guardarImagen(sd_desc, sd_logo, url_logo+'/') : null,
            sd_jersey: (sd_jersey) ? await utilImage.guardarImagen(sd_desc, sd_jersey, url_perfil+'/') : null,
            sd_ciudad_cd_cdgo
        }
        await pool.query('INSERT INTO sede SET ?', datos)
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

sedes.searchSede= async(req,res) => {
    try {
        const { sd_cdgo } = req.params
        const resultSede = await pool.query('SELECT sd_cdgo, sd_desc, sd_logo, sd_jersey, cd_cdgo, cd_desc FROM sede JOIN ciudad ON cd_cdgo=sd_ciudad_cd_cdgo WHERE sd_cdgo=? AND sd_estado=1 LIMIT 1', sd_cdgo);
        if(resultSede.length){
            if (resultSede[0].sd_logo) resultSede[0].sd_logo = url_servidor+resultSede[0].sd_logo
            if (resultSede[0].sd_jersey) resultSede[0].sd_jersey = url_servidor+resultSede[0].sd_jersey
            resultSede[0].sd_mesa_trabajo = await pool.query('SELECT us_nombres,us_cdgo, us_alias,us_telefono, us_logo, ca_desc FROM usuario JOIN mesa_trabajo ON us_cdgo=mt_usuario_us_cdgo JOIN cargo ON ca_cdgo=mt_cargo_ca_cdgo WHERE mt_sede_sd_cdgo=? AND us_estado=1 AND mt_estado=1', sd_cdgo)
            res.status(200).json({ status: true, data: resultSede[0] })
        } else res.status(200).json({ status: false });        
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }    
}

sedes.updateSede = async (req,res) => {
    try {
        const { sd_cdgo } = req.params
        const { sd_desc, sd_logo, sd_url_logo, sd_jersey, sd_url_jersey, sd_ciudad_cd_cdgo } = req.body;
        const datos_actualizar = {
            sd_desc,
            sd_ciudad_cd_cdgo,
        }

        if (sd_logo) datos_actualizar.sd_logo = await utilImage.guardarImagen(sd_desc, sd_logo, url_logo+'/') 
        if (sd_jersey) datos_actualizar.sd_jersey = await utilImage.guardarImagen(sd_desc, sd_jersey, url_perfil+'/') 

        const updateSede = await pool.query('UPDATE sede SET ? WHERE sd_cdgo=?', [datos_actualizar, sd_cdgo])

        if (updateSede.affectedRows) {
            try {                
                if (sd_logo && sd_url_logo) await utilImage.eliminarImagen(sd_url_logo.replace(url_servidor, ''))
                if (sd_jersey && sd_url_jersey) await utilImage.eliminarImagen(sd_url_jersey.replace(url_servidor, ''))
            } catch (error) { }
        } else {
            try {                
                if (sd_logo) await utilImage.eliminarImagen(datos_actualizar.sd_logo) 
                if (sd_jersey) await utilImage.eliminarImagen(datos_actualizar.sd_jersey)
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

sedes.deleteSede = async (req, res) => {
    try {
        await pool.query('UPDATE sede SET ? WHERE sd_cdgo=?', [{sd_estado: 0}, req.params.sd_cdgo])
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

module.exports = sedes