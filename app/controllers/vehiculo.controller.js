    const pool = require('../config/conection');
    const  fs = require("fs");
    const vehiculo = {}
    const url_servidor = require('../config/url_services')
    const { utilImage } = require('../utils/image')
    // const { utilText } = require('../utils/text')
    const url_soat = 'images_vehiculo_soat';
    const url_tecno = 'images_vehiculo_tecno';
    const url_usuarios = 'images_usuarios';
    const url_logo_sede = 'images_logos_SEDES';
    const url_public = 'app/public/'

    vehiculo.getVehiculos = async(req, res) => {
        var resultVehiculos=[];
        const {us_perfil,us_sede_sd_cdgo, us_cdgo}=req.body
        try {
            if(us_perfil==3){
                resultVehiculos =  await pool.query("SELECT ve_cdgo,ve_desc,ve_placa,DATE_FORMAT(ve_fecha_soat,'%d/%m/%y') AS ve_fecha_soat,DATEDIFF(ve_fecha_soat,Now())as dif_soat,DATE_FORMAT(ve_fecha_tecno,'%d/%m/%y') AS ve_fecha_tecno,DATEDIFF(ve_fecha_tecno,Now())as dif_tecno, us_alias, us_cdgo,us_logo FROM vehiculo JOIN usuario ON ve_usuario_us_cdgo=usuario.us_cdgo WHERE ve_estado=1 ORDER BY ve_cdgo DESC")
            }else if(us_perfil==2){
                resultVehiculos =  await pool.query("SELECT ve_cdgo,ve_desc,ve_placa,DATE_FORMAT(ve_fecha_soat,'%d/%m/%y') AS ve_fecha_soat,DATEDIFF(ve_fecha_soat,Now())as dif_soat,DATE_FORMAT(ve_fecha_tecno,'%d/%m/%y') AS ve_fecha_tecno,DATEDIFF(ve_fecha_tecno,Now())as dif_tecno, us_alias, us_cdgo, us_logo FROM vehiculo JOIN usuario ON ve_usuario_us_cdgo=usuario.us_cdgo WHERE ve_estado=1 and usuario.us_sede_sd_cdgo=? ORDER BY ve_cdgo DESC",us_sede_sd_cdgo)
            }
            else{
                resultVehiculos =  await pool.query("SELECT ve_cdgo,ve_desc,ve_placa,DATE_FORMAT(ve_fecha_soat,'%d/%m/%y') AS ve_fecha_soat,DATEDIFF(ve_fecha_soat,Now())as dif_soat,DATE_FORMAT(ve_fecha_tecno,'%d/%m/%y') AS ve_fecha_tecno,DATEDIFF(ve_fecha_tecno,Now())as dif_tecno, us_alias, us_cdgo,us_logo FROM vehiculo JOIN usuario ON ve_usuario_us_cdgo=usuario.us_cdgo WHERE ve_estado=1 and us_cdgo=? ORDER BY ve_cdgo DESC",us_cdgo)
            }
           if (resultVehiculos.length != 0) {            
                for (let i = 0; i < resultVehiculos.length; i++) {
                    if (resultVehiculos[i].us_logo) resultVehiculos[i].us_logo = url_servidor+resultVehiculos[i].us_logo
                }
                res.status(200).json({ status: true, data: resultVehiculos })           
            } else res.status(200).json({ status: false });
        } catch (error) {
            res.status(500).json({
                code: error.code,
                message: error.message
            })
        }    
    }

    vehiculo.addVehiculo= async(req, res)=>{
        try {
            const { ve_placa, ve_desc, us_cdgo, ve_fecha_soat,ve_foto_soat,ve_fecha_tecno,ve_foto_tecno } = req.body
            const nombre_imagen_soat = (ve_foto_soat) ? await utilImage.guardarImagen('soat_'+ve_placa, ve_foto_soat, url_soat+'/') : null;
            const nombre_imagen_tecno = (ve_foto_tecno) ? await utilImage.guardarImagen('tecno_'+ve_placa, ve_foto_tecno, url_tecno+'/') : null;
            const datos={
                ve_placa: ve_placa,
                ve_desc: ve_desc,
                ve_usuario_us_cdgo: us_cdgo,
                ve_fecha_soat: ve_fecha_soat,
                ve_foto_soat:nombre_imagen_soat,
                ve_fecha_tecno:ve_fecha_tecno,
                ve_foto_tecno:nombre_imagen_tecno,

            }
            await pool.query('INSERT INTO vehiculo SET ?', datos)
            res.status(200).json({ status: true});
        } catch (error) {
            res.status(500).json({
                code: error.code,
                message: error.message
            })
        }
    }

    vehiculo.searchVehiculo= async(req,res) => {
        try {
            const { ve_cdgo } = req.params
            const resultVehiculo = await pool.query("SELECT ve_cdgo,ve_desc, ve_placa,DATE_FORMAT(ve_fecha_soat,'%d/%m/%y') AS ve_fecha_soat,ve_foto_soat,DATEDIFF(ve_fecha_soat,Now())as dif_soat,DATE_FORMAT(ve_fecha_tecno,'%d/%m/%y') AS ve_fecha_tecno,ve_foto_tecno,DATEDIFF(ve_fecha_tecno,Now())as dif_tecno, us_alias, us_logo FROM vehiculo JOIN usuario ON ve_usuario_us_cdgo=usuario.us_cdgo WHERE ve_estado=1 and ve_cdgo=? ORDER BY ve_cdgo DESC",ve_cdgo);
            if (resultVehiculo.length != 0) {            
                for (let i = 0; i < resultVehiculo.length; i++) {
                    if (resultVehiculo[i].ve_foto_soat) resultVehiculo[i].ve_foto_soat = url_servidor+resultVehiculo[i].ve_foto_soat
                    if (resultVehiculo[i].ve_foto_tecno) resultVehiculo[i].ve_foto_tecno = url_servidor+resultVehiculo[i].ve_foto_tecno

                }
                res.status(200).json({ status: true, data: resultVehiculo })           
            } else res.status(200).json({ status: false });        
        } catch (error) {
            res.status(500).json({
                code: error.code,
                message: error.message
            })
        }    
    }

    vehiculo.updateVehiculo = async (req,res) => {
        try {
            let datos_actualizar = {};
            const { ve_cdgo } = req.params
            const {
                ve_placa: ve_placa,
                ve_desc: ve_desc,
                ve_fecha_soat: ve_fecha_soat,
                ve_foto_soat:nombre_imagen_soat,
                ve_url_soat:ve_url_soat,
                ve_fecha_tecno:ve_fecha_tecno,
                ve_foto_tecno:nombre_imagen_tecno, 
                ve_url_tecno:ve_url_tecno,
            } = req.body;
            datos_actualizar.ve_desc = ve_desc;
            datos_actualizar.ve_fecha_soat = ve_fecha_soat
            if (ve_foto_soat) datos_actualizar.ve_foto_soat = await utilImage.guardarImagen('soat_'+ve_placa, ve_foto_soat, url_soat+'/')
            if (ve_foto_tecno) datos_actualizar.ve_foto_tecno = await utilImage.guardarImagen('tecno_'+sd_desc, ve_foto_tecno, url_tecno+'/')
            
            const updateVehiculo = await pool.query('UPDATE vehiculo SET ? WHERE ve_cdgo=?', [datos_actualizar, ve_cdgo])

            if (updateVehiculo.affectedRows) {
                try {                
                    if (ve_foto_soat && ve_url_soat) await utilImage.eliminarImagen(ve_url_soat.replace(url_servidor, ''))
                    if (ve_foto_tecno && ve_url_tecno) await utilImage.eliminarImagen(ve_url_tecno.replace(url_servidor, ''))
                } catch (error) { }
            } else {
                try {                
                    if (ve_foto_soat) await utilImage.eliminarImagen(ve_foto_soat)
                    if (ve_foto_tecno) await utilImage.eliminarImagen(ve_foto_tecno)
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

    vehiculo.verificacionDocumentos = async (req, res) => {
        try {
            const { us_sede_sd_cdgo, us_perfil } = req.body;
            let vehiculos = [];

            if (us_perfil !== 1) {
                if (us_perfil === 2){
                    // lider
                    vehiculos = await pool.query('SELECT ve_placa, ve_desc, ve_fecha_soat, ve_foto_soat, ve_fecha_tecno, ve_foto_tecno, us_nombres, us_apellidos, us_alias, us_logo, sd_desc, sd_logo FROM vehiculo JOIN usuario ON ve_usuario_us_cdgo=us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo WHERE us_sede_sd_cdgo=?',us_sede_sd_cdgo)
                } else {
                    // coodinador
                    vehiculos = await pool.query('SELECT ve_placa, ve_desc, ve_fecha_soat, ve_foto_soat, ve_fecha_tecno, ve_foto_tecno, us_nombres, us_apellidos, us_alias, us_logo, sd_desc, sd_logo FROM vehiculo JOIN usuario ON ve_usuario_us_cdgo=us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo')
                }

                if (vehiculos.length) {            
                    for (let i = 0; i < vehiculos.length; i++) {
                        if (vehiculos[i].ve_foto_soat) vehiculos[i].ve_foto_soat = URLComplemet(url_soat, vehiculos[i].ve_foto_soat);
                        if (vehiculos[i].ve_foto_tecno) vehiculos[i].ve_foto_tecno = URLComplemet(url_tecno, vehiculos[i].ve_foto_tecno);
                        if (vehiculos[i].us_logo) vehiculos[i].us_logo = URLComplemet(url_usuarios, vehiculos[i].us_logo);
                        if (vehiculos[i].sd_logo) vehiculos[i].sd_logo = URLComplemet(url_logo_sede, vehiculos[i].sd_logo);

                    }
                    res.status(200).json({ status: true, data: vehiculos })           
                } else res.status(200).json({ status: false, message: "No hay datos registrados" });

                res.status(200).json({ status: true, data: vehiculos })
            } else res.status(200).json({ status: false, message: "El usuario no está autorizado." })
        } catch (error) {
            res.status(500).json({
                code: error.code,
                message: error.message
            })
        }

    }

    URLComplemet = (field, imageName) => {
        return `${url_servidor}image/get?nameFolder=${field}&nameImage=${imageName}`
    }

    vehiculo.deletevehiculo = async (req, res) => {
        try {
            await pool.query('UPDATE vehiculo SET ? WHERE ve_cdgo=?', [{ve_estado: 0}, req.params.ve_cdgo])
            res.status(200).json({ status: true })
        } catch (error) {
            res.status(500).json({
                code: error.code,
                message: error.message
            })
        }
    }

    module.exports = vehiculo