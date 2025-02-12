const fs = require('fs'); // Importa el módulo fs de Node.js para manejar archivos
const sharp = require('sharp'); // Importa el módulo sharp para comprimir los datos
const path = require('path'); // Importa el módulo path de Node.js para manejar rutas de archivos
const axios = require('axios'); // Importa el módulo axios para realizar solicitudes HTTP
const images = require('./images');

const uploadsDir = path.join(__dirname, 'uploads');//Recibe la ruta del directorio uploads y la guarda en la variable uploadsDir

if (!fs.existsSync(uploadsDir)) {// Verifica si el directorio uploads existe y, si no, lo crea
  fs.mkdirSync(uploadsDir);//Recibe la ruta del directorio uploads y la guarda en la variable uploadsDir y crea el directorio si no existe
}

const getFilenameFromUrl = (url) => {// Función para obtener el nombre del archivo de una URL
  const urlParts = url.split('/'); // Divide la URL en partes separadas por / 
  return urlParts[urlParts.length - 1]; // Devuelve la última parte de la URL, que corresponde al nombre del archivo
};

const downloadAndCompressImages = async () => {
  const urls = await images.getImages();
  console.log(urls);

  for (const url of urls) {
    try {
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });

      const originalFilename = getFilenameFromUrl(url);
      const compressedImagePath = ls

      const imageBuffer = Buffer.from(response.data);

      // Obtener metadatos de la imagen para verificar su ancho
      const metadata = await sharp(imageBuffer).metadata();
      const newWidth = metadata.width >= 2040 ? 2040 : metadata.width; // Redimensionar si es mayor o igual a 2040

      await sharp(imageBuffer)
        .resize({ width: newWidth }) // Ajustar el ancho manteniendo la proporción
        .jpeg({ quality: 50 })
        .toFile(compressedImagePath);

      console.log(`Imagen comprimida guardada en: ${compressedImagePath}`);
    } catch (err) {
      console.error(`Error al procesar la imagen ${url}:`, err);
    }
  }
};


downloadAndCompressImages(); // Llama a la función para descargar y comprimir la imagen
