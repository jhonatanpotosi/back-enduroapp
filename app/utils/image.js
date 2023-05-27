const gc = require('../googleCloudStorage.js')
const bucket = gc.bucket('crested-climber-329403.appspot.com')
const utilImage = {} 

utilImage.guardarImagen = (originalname, imageBase64, path) => new Promise((resolve, reject) => {
  const date = new Date()
  const buffer = Buffer.from(imageBase64, "base64")
  const blob = bucket.file(`${path+date.getTime()+originalname.split(" ").join("_")}.png`)
  const blobStream = blob.createWriteStream({
    resumable: false
  })
  blobStream.on('finish', () => {
    const publicUrl = blob.name
    resolve(publicUrl)
  })
  .on('error', () => {
    reject(`Unable to upload image, something went wrong`)
  })
  .end(buffer)
})

utilImage.eliminarImagen = async (path) => {
  try {
    const file = bucket.file(path)
    const pr = file.delete()
  } catch (error) {
    console.log('error: ', error);    
  }  
}

/* 
utilImage.guardarImagen = async(imageName, image, imagePath) => {    
    let nombre_sin_espacio = imageName.split(" ").join("") //quita los espacios al nombre
    let date = new Date();
    let nombre_imagen = date.getTime() + '_' + nombre_sin_espacio + '.png' // nombre de la logo, consta de un datatime y el nombre de la sede 
    let data = image.replace(/^data:image\/\w+;base64,/, ''); // remueve valores innecesarios del data base64
    let realFile = Buffer.from(data, "base64"); // decodifica el base64 a una imagen
    //almacena la logo en el servidor
    fs.writeFile(imagePath + nombre_imagen, realFile, function(err) {
        if (err)
            console.log(err);
    });
    return nombre_imagen;    
}; */

module.exports = { utilImage }