const pool = require('../config/conection');
const { utilImage } = require('../utils/image')
const url_servidor = require('../config/url_services')
const url_logo = 'images_usuarios';

const usuarios = {}

usuarios.findUsuarios = async (req, res) => {//traer informacion de todos los ususarios
    const { us_perfil, us_sede_sd_cdgo } = req.body
        const cond = (us_perfil===2) ? ' AND us_sede_sd_cdgo='+ us_sede_sd_cdgo : '';
    try {

        const resultUsuarios = await pool.query('SELECT  us_cdgo, us_nombres, us_apellidos, us_alias, us_logo, us_telefono, us_correo, us_sexo, us_rh,us_direccion, us_perfil_pf_cdgo as us_perfil, sd_desc AS us_sede FROM usuario JOIN sede ON us_sede_sd_cdgo=sd_cdgo  WHERE us_estado=1'+cond) 
        if (resultUsuarios.length != 0) {            
            for (let i = 0; i < resultUsuarios.length; i++) {
                if (resultUsuarios[i].us_logo) resultUsuarios[i].us_logo = url_servidor+resultUsuarios[i].us_logo
            }
            res.status(200).json({ status: true, data: resultUsuarios })           
        } else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}


usuarios.addUsuario = async(req, res) => {
    try {
        const { us_clave, us_nombres, us_apellidos, us_alias, us_logo, us_sede_sd_cdgo, us_correo, us_telefono, us_sexo, us_rh, us_direccion } = req.body
        const nombre_imagen_logo = (us_logo) ? await utilImage.guardarImagen(us_alias, us_logo, url_logo+'/') : null;
        const datos = {
            us_nombres,
            us_apellidos,
            us_telefono,
            us_direccion,
            us_logo: nombre_imagen_logo,
            us_sede_sd_cdgo,
            us_alias,
            us_sexo,
            us_rh,
            us_correo,
            us_clave,
            us_perfil_pf_cdgo: 1,
            us_estado: 2
        }
        await pool.query('INSERT INTO usuario SET ?', datos)
        res.status(200).json({ status: true});
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

usuarios.getSolicitudUsuarios = async(req, res) => {
    try {
        const { us_perfil, us_sede_sd_cdgo } = req.body
        const cond = (us_perfil===2) ? ' AND us_sede_sd_cdgo='+ us_sede_sd_cdgo : '';
        const resultUsuarios = await pool.query('SELECT us_cdgo, us_nombres, us_apellidos, us_alias, us_logo, us_telefono, us_correo, us_sexo, us_rh,us_direccion, us_perfil_pf_cdgo as us_perfil, sd_desc AS us_sede FROM usuario JOIN sede ON us_sede_sd_cdgo=sd_cdgo WHERE us_estado=2' + cond + ' ORDER BY us_alias ASC')
        if (resultUsuarios.length != 0) {            
            for (let i = 0; i < resultUsuarios.length; i++) {
                if (resultUsuarios[i].us_logo) resultUsuarios[i].us_logo = url_servidor+resultUsuarios[i].us_logo
            }
            res.status(200).json({ status: true, data: resultUsuarios })           
        } else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })   
    }
}


usuarios.getUsuarioMesaTrabajo = async(req, res) => {
    try {
        const { sd_cdgo } = req.params 
        const resultUsuarios = await pool.query('SELECT us_cdgo, us_alias FROM usuario WHERE us_estado=1 AND us_sede_sd_cdgo=? AND us_cdgo NOT IN(SELECT mt_usuario_us_cdgo FROM mesa_trabajo WHERE mt_estado=1) ORDER BY us_alias ASC', sd_cdgo) 
        if (resultUsuarios.length != 0) res.status(200).json({ status: true, data: resultUsuarios })
        else res.status(200).json({ status: false })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })   
    }
}

usuarios.getSedesList = async(req, res) => {
    try {
        const resultSedes = await pool.query('SELECT sd_cdgo, sd_desc FROM sede WHERE sd_estado=1 ORDER BY sd_cdgo DESC')
        if (resultSedes.length != 0) {
            res.status(200).json({ status: true, data: resultSedes })           
        } else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }    
}

usuarios.validar = async(req, res) => {
    try {
        const { tipo, data } = req.query
        if (tipo === 'alias') {
            const resultUsuario = await pool.query('SELECT NULL FROM usuario WHERE us_alias=? LIMIT 1', data)
            res.status(200).json({ status:  Boolean(resultUsuario.length) })   
        } else if (tipo == 'correo') {
            const resultUsuario = await pool.query('SELECT NULL FROM usuario WHERE us_correo=? LIMIT 1', data)
            res.status(200).json({ status: Boolean(resultUsuario.length) })   
        }
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

usuarios.updateEstado = async(req, res) => {
    try {
        const { us_cdgo } = req.params
        const { estado } = req.body
        await pool.query('UPDATE usuario SET ? WHERE us_cdgo=?', [{us_estado: estado}, us_cdgo])
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

usuarios.aceptarEliminarUsuario = async(req, res) => {
    try {
        const { us_cdgo } = req.params
        const { estado } = req.body

        if ( estado === "0") {
            await pool.query('DELETE FROM usuario WHERE us_cdgo=?', us_cdgo)
        } else {
            await pool.query('UPDATE usuario SET ? WHERE us_cdgo=?', [{us_estado: estado}, us_cdgo])
        }
        
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

usuarios.findUsuarioPlaca = async (req, res) => {//traer informacion de ususario y vehiculo por medio de la placa
    try {
        const { ve_placa } = req.params 
        const resultUsuarios = await pool.query(`SELECT us_nombres, us_apellidos, us_alias, us_logo, us_sexo, us_rh, ve_placa, ve_desc, sd_desc, sd_logo FROM usuario JOIN vehiculo ON ve_usuario_us_cdgo=us_cdgo JOIN sede ON us_sede_sd_cdgo=sd_cdgo WHERE us_estado=1 AND ve_estado=1 AND ve_placa LIKE '%${ve_placa}%' ORDER BY ve_placa ASC`) 
        if (resultUsuarios.length != 0) {            
            for (let i = 0; i < resultUsuarios.length; i++) {
                if (resultUsuarios[i].us_logo) resultUsuarios[i].us_logo = url_servidor+resultUsuarios[i].us_logo
            }
            res.status(200).json({ status: true, data: resultUsuarios })           
        } else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}



usuarios.findUsuarioId = async (req, res) => {//traer informacion del ususario por medio del id
    try {
        const { us_cdgo } = req.params 
        const resultUsuarios = await pool.query(`SELECT us_nombres, us_apellidos, us_telefono, us_direccion, us_logo, sd_cdgo,sd_desc, us_alias, us_sexo, us_rh, us_correo, us_clave, us_perfil_pf_cdgo, us_estado FROM usuario JOIN sede ON us_sede_sd_cdgo=sd_cdgo  WHERE us_estado=1 AND  us_cdgo=?`,us_cdgo) 
        if (resultUsuarios.length != 0) {            
            for (let i = 0; i < resultUsuarios.length; i++) {
                if (resultUsuarios[i].us_logo) resultUsuarios[i].us_logo = url_servidor+resultUsuarios[i].us_logo
            }
            res.status(200).json({ status: true, data: resultUsuarios })           
        } else res.status(200).json({ status: false });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}


usuarios.updateToken = async(req, res) => {
    try {
        const { us_cdgo } = req.params
        const { token } = req.body
        // await pool.query('UPDATE usuario SET ? WHERE us_cdgo=?', [{token: token}, us_cdgo])
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

usuarios.updateData = async(req, res) => {
    try {
        const { us_cdgo } = req.params
        const { key, value } = req.body
        const query=`UPDATE usuario SET ${key} = "${value}" WHERE us_cdgo = ${us_cdgo}`
        await pool.query(query)
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}

usuarios.updatePerfil = async(req, res) => {
    try {
        const { us_cdgo } = req.params
        const { value } = req.body
        const query=`UPDATE usuario SET us_perfil_pf_cdgo = "${value}" WHERE us_cdgo = ${us_cdgo}`
        await pool.query(query)
        res.status(200).json({ status: true })
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}


usuarios.updateImage = async(req, res) => {
    try {
        const { us_url_logo, us_logo,us_alias } = req.body
        const { us_cdgo } = req.params
        const nombre_imagen_logo = (us_logo) ? await utilImage.guardarImagen(us_alias, us_logo, url_logo+'/') : null;
        const datos_actualizar = {
            us_logo: nombre_imagen_logo,
        }
        const updateUsuario = await pool.query(`UPDATE usuario SET ? WHERE us_cdgo = ?`, [datos_actualizar, us_cdgo])
        if (updateUsuario.affectedRows) {
            try {                
                if (us_logo && us_url_logo) await utilImage.eliminarImagen(us_url_logo.replace(url_servidor, ''))
            } catch (error) { }
        } else {
            try {                
                if (us_logo) await utilImage.eliminarImagen(datos_actualizar.us_logo) 
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

usuarios.notificar = async(req, res) => {
    try {
        const { us_cdgo } = req.params
        const { nombre } = req.body
        const resultUsuarios = await pool.query('SELECT token FROM usuario WHERE us_estado=1 AND us_perfil_pf_cdgo IN (2,3)')
        let destinos = []
        if (resultUsuarios && resultUsuarios.length > 0) {
            resultUsuarios.map(usuario => {
                if(usuario.token) destinos.push(usuario.token)
            })
        }
        const body = {
            "registration_ids": destinos,
            "notification":{
                "title":"Notificación de emergencia",
                "body": `¡El motero ${nombre} necesita tu ayuda!, pulsa AQUI para más información.`
            },
            "data":{
                "us_cdgo": us_cdgo
            }
        }
        const dataHTTP = {
            method: 'post',
            body:    JSON.stringify(body),
            headers: { 'Content-Type': 'application/json', "Authorization": "key=AAAABJZ1MSU:APA91bHxPQ1RxLwLgNLZGwbJETHEY0s3_nUbsOOKS1Q89Nb9DjNtz2UyYYeUTJ2soTX7lM88LqtgCwa4Fqrtijbl8KpMFeVMs3N3eeaA3X2i7xrfsvkcR5ECqvx8oA--Lt8GeTYNMV8m"},
        }
        fetch("https://fcm.googleapis.com/fcm/send", dataHTTP)
        .then(res => res.json())
        .then(json => {
            if (json.success>0) res.status(200).json({ status: true })
            else res.status(200).json({ status: false })
        });
    } catch (error) {
        res.status(500).json({
            code: error.code,
            message: error.message
        })
    }
}
module.exports = usuarios