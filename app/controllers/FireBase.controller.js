const pool = require('../config/conection');
const { firebase } = require('../config/keys');
const fetch = require('node-fetch');

const firebaseCtrl = {}
const urlAPI = "https://fcm.googleapis.com/fcm/send"

firebaseCtrl.notificar = async (req, res) => {
    try {
        const dateNow = new Date()
        const { us_cdgo } = req.params
        const { nombre, latitud,longitud } = req.body
        const resultUsuarios = await pool.query('SELECT token FROM usuario WHERE us_estado=1 AND us_perfil_pf_cdgo IN (2,3)')
        let destinos = []
        if (resultUsuarios && resultUsuarios.length > 0) {
            resultUsuarios.map(usuario => {
                if(usuario.token) destinos.push(usuario.token)
            })
        }
        const datos = {
            eme_usuario_us_cdgo: us_cdgo,
            eme_latitud: latitud,
            eme_longitud: longitud,
            eme_fecha_creacion: dateNow,
        }
        await pool.query('INSERT INTO emergencias SET ?', datos)
        const body = {
            "registration_ids": destinos,
            "notification":{
                "title":"Notificación de emergencia",
                "body": `¡El motero ${nombre} necesita tu ayuda!, pulsa AQUI para más información.`,
                "click_action": "FLUTTER_NOTIFICATION_CLICK",
                "sound": "default"
            },
            "data":{
                "us_cdgo": us_cdgo,
                "latitud":latitud,
                "longitud":longitud
            },
            "priority": "high",
        }
        const dataHTTP = {
            method: 'post',
            body:    JSON.stringify(body),
            headers: firebase,
        }
        fetch(urlAPI, dataHTTP)
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

module.exports = firebaseCtrl