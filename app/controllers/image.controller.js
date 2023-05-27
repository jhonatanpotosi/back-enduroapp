const fs = require("fs");
const image = {}
const path = require('path');
const url_carpeta = 'app/public/';

image.getImage= async(req, res) =>{
    try {
        const { nameFolder, nameImage } = req.query
        fs.statSync(path.resolve(url_carpeta+nameFolder+'/'+ nameImage));
        res.sendFile(path.resolve(url_carpeta+nameFolder+'/'+ nameImage))
    } catch (error) {        
        res.sendFile(path.resolve('app/image-default/error-image.png'))
    }
};

module.exports = image