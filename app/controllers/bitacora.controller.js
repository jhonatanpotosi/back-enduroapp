const pool = require('../config/conection');
const bitacoras = {}
const url_servidor = require('../config/url_services')
const { utilImage } = require('../utils/image')
const url_logo = 'images_bitacoras';

bitacoras.getBitacoras = async (req, res) => {
    try {
        const resultBitacoras = await pool.query("SELECT bi_cdgo, bi_ciudad, bi_lugar, bi_desc, us_alias,us_logo, us_cdgo, sd_desc,IF(TIMESTAMPDIFF(MINUTE, bi_created_at, NOW())<60, CONCAT('Hace ', TIMESTAMPDIFF(MINUTE, bi_created_at, NOW()), ' minutos'),IF(TIMESTAMPDIFF(HOUR, bi_created_at, NOW()) BETWEEN 1 AND 23, CONCAT('Hace ', TIMESTAMPDIFF(HOUR, bi_created_at, NOW()), ' horas'), IF(TIMESTAMPDIFF(DAY, bi_created_at, NOW()) BETWEEN 1 AND 7, CONCAT('Hace ', TIMESTAMPDIFF(DAY, bi_created_at, NOW()), ' dias'),CONCAT('Publicado el ', DATE_FORMAT(bi_created_at,'%d/%m/%y')))))AS fecha FROM bitacora JOIN usuario ON usuario_us_cdgo=us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo WHERE us_estado=1 AND bi_estado=1 ORDER BY bi_cdgo DESC")
        if (resultBitacoras.length != 0) {
            for (let i = 0; i < resultBitacoras.length; i++) {
                if (resultBitacoras[i].us_logo) resultBitacoras[i].us_logo= url_servidor+resultBitacoras[i].us_logo
                resultBitacoras[i].bi_img = await pool.query('SELECT imbi_cdgo ,imbi_img FROM img_bitacora WHERE  bitacora_bi_cdgo=?',resultBitacoras[i].bi_cdgo)
               
                for (let j = 0; j < resultBitacoras[i].bi_img.length; j++) {
                     resultBitacoras[i].bi_img[j].imbi_img = url_servidor+resultBitacoras[i].bi_img[j].imbi_img
                }
            }

            res.status(200).json({ status: true, data: resultBitacoras })
        } else res.status(200).json({ status: false });        
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}


bitacoras.getBitacorasInicio = async (req, res) => {
    try {
        const resultBitacoras = await pool.query("SELECT bi_cdgo, bi_ciudad, bi_lugar, bi_desc, us_alias,us_logo, sd_desc,IF(TIMESTAMPDIFF(MINUTE, bi_created_at, NOW())<60, CONCAT('Hace ', TIMESTAMPDIFF(MINUTE, bi_created_at, NOW()), ' minutos'),IF(TIMESTAMPDIFF(HOUR, bi_created_at, NOW()) BETWEEN 1 AND 23, CONCAT('Hace ', TIMESTAMPDIFF(HOUR, bi_created_at, NOW()), ' horas'), IF(TIMESTAMPDIFF(DAY, bi_created_at, NOW()) BETWEEN 1 AND 7, CONCAT('Hace ', TIMESTAMPDIFF(DAY, bi_created_at, NOW()), ' dias'),CONCAT('Publicado el ', DATE_FORMAT(bi_created_at,'%d/%m/%y')))))AS fecha FROM bitacora JOIN usuario ON usuario_us_cdgo=us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo WHERE us_estado=1 AND bi_estado=1 ORDER BY bi_cdgo DESC LIMIT 4")
        if (resultBitacoras.length != 0) {
            for (let i = 0; i < resultBitacoras.length; i++) {
                if (resultBitacoras[i].us_logo) resultBitacoras[i].us_logo= url_servidor+resultBitacoras[i].us_logo
                resultBitacoras[i].bi_img = await pool.query('SELECT imbi_cdgo ,imbi_img FROM img_bitacora WHERE  bitacora_bi_cdgo=?',resultBitacoras[i].bi_cdgo)
               
                for (let j = 0; j < resultBitacoras[i].bi_img.length; j++) {
                     resultBitacoras[i].bi_img[j].imbi_img = url_servidor+resultBitacoras[i].bi_img[j].imbi_img
                }
            }

            res.status(200).json({ status: true, data: resultBitacoras })
        } else res.status(200).json({ status: false });        
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

bitacoras.deleteBitacoras = async (req, res) => {
    try {
        const { bi_cdgo } = req.params
        const resultImages = await pool.query('SELECT imbi_img FROM img_bitacora WHERE bitacora_bi_cdgo=?', bi_cdgo)

        if ( resultImages.length ) {
            for ( let i = 0; i < resultImages.length; i++) {
                await utilImage.eliminarImagen(resultImages[i].imbi_img)
            }
        }
        
        await pool.query('DELETE FROM img_bitacora WHERE bitacora_bi_cdgo=?', bi_cdgo)
        await pool.query('DELETE FROM bitacora WHERE bi_cdgo=?', bi_cdgo)
        
        res.status(200).json({ status: true });  
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })  
    }
}

bitacoras.addBitacora = async(req, res) => {
    try {
        var bi_cdgo='';
        var bi_img='';
        const { bi_ciudad,bi_lugar,bi_desc,bi_logo,us_cdgo } = req.body
        const datos = {
                        usuario_us_cdgo:us_cdgo,
                        bi_fecha:new Date(),
                        bi_ciudad: bi_ciudad,
                        bi_lugar: bi_lugar,
                        bi_desc:bi_desc

                    }

        const response=await pool.query('INSERT INTO bitacora SET ?', datos,(err,resp) => {
            if (err) {throw err}
            else{
                bi_cdgo=resp.insertId
                
             
            
            JSON.parse(bi_logo).forEach(async element=> { 
                bi_img= await utilImage.guardarImagen(bi_lugar, element, url_logo+'/')
                const dataImg={
                    bitacora_bi_cdgo:bi_cdgo,
                    imbi_img:bi_img
                }
             await pool.query('INSERT INTO img_bitacora SET ?', dataImg)
          });
            res.status(200).json({ status: true });
            }

        })
             
        
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })  
    }
}
module.exports = bitacoras;