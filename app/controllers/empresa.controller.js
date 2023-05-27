const pool = require('../config/conection');
const empresas = {}
const url_servidor = require('../config/url_services')
const { utilImage } = require('../utils/image')
const url_logo = 'images_empresas';

empresas.getEmpresas = async (req, res) => {
    try {
        const resultEmpresas = await pool.query('SELECT em_cdgo, em_nit, em_logo, em_nombre, em_desc,em_telefono, em_correo FROM empresa WHERE em_estado=1 ORDER BY em_cdgo DESC')
        if (resultEmpresas.length != 0) {
            for (let i = 0; i < resultEmpresas.length; i++) {
                if (resultEmpresas[i].em_logo) resultEmpresas[i].em_logo = url_servidor+resultEmpresas[i].em_logo
            }
            res.status(200).json({ status: true, data: resultEmpresas })
        } else res.status(200).json({ status: false });        
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

empresas.addEmpresa = async(req, res) => {
    try {
        const { em_nit, em_logo, em_nombre, em_desc, em_telefono, em_correo, us_sede_sd_cdgo } = req.body
        const datos = {
            em_nit: em_nit,
            em_logo: (em_logo) ? await utilImage.guardarImagen(em_nombre, em_logo, url_logo+'/'): null,
            em_nombre: em_nombre,
            em_desc: em_desc,
            em_telefono: em_telefono,
            em_correo: em_correo,
            em_sede_sd_cdgo: us_sede_sd_cdgo
        }
        await pool.query('INSERT INTO empresa SET ?', datos)
        res.status(200).json({ status: true });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })  
    }
}

empresas.searchEmpresa = async(req, res) => {
    try {        
        const { em_cdgo } = req.params
        const resultEmpresa = await pool.query('SELECT em_cdgo, em_nit, em_logo, em_nombre, em_desc, em_telefono, em_correo FROM empresa WHERE em_cdgo=? AND em_estado=1 LIMIT 1', em_cdgo)
        if (resultEmpresa.length != 0) {
            if (resultEmpresa[0].em_logo) resultEmpresa[0].em_logo = url_servidor+resultEmpresa[0].em_logo
            resultEmpresa[0].em_convenios = await pool.query('SELECT co_cdgo, co_desc, tp_desc FROM convenios JOIN tipo_convenios ON tp_cdgo=co_tipo_convenios_tp_cdgo WHERE co_empresa_em_cdgo=? AND co_estado=1',em_cdgo)
            res.status(200).json({ status: true, data: resultEmpresa[0] })
        } else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

empresas.updateEmpresa = async(req, res) => {
    try {
        let datos_actualizar = {};
        const { em_cdgo } = req.params        
        const { em_nit, em_logo, em_url_logo, em_nombre, em_desc, em_telefono, em_correo } = req.body
        datos_actualizar.em_nit = em_nit;
        datos_actualizar.em_nombre = em_nombre
        datos_actualizar.em_desc = em_desc
        datos_actualizar.em_telefono = em_telefono
        datos_actualizar.em_correo = em_correo
        
        if (em_logo) datos_actualizar.em_logo = await utilImage.guardarImagen(em_nombre, em_logo, url_logo+'/')
        
        const updateEmpresa = await pool.query('UPDATE empresa SET ? WHERE em_cdgo=?', [datos_actualizar, em_cdgo])

        if (updateEmpresa.affectedRows) {
            try {                
                if (em_logo && em_url_logo) await utilImage.eliminarImagen(em_url_logo.replace(url_servidor, ''));
            } catch (error) { }
        } else {
            try {                
                if (em_logo) await utilImage.eliminarImagen(datos_actualizar.em_logo)
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

empresas.deleteEmpresa = async (req, res) => {
    try {
        await pool.query('UPDATE empresa SET ? WHERE em_cdgo=?', [{em_estado: 0}, req.params.em_cdgo])
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

module.exports = empresas;