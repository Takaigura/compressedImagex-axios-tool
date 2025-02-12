const https = require('https');
const fs = require('fs');
const sharp = require('sharp');
const path = require('path');
const images = require('./images');

const uploadsDir = path.join(__dirname, 'uploads'); //Recibe la ruta del directorio uploads y la guarda en la variable uploadsDir

if (!fs.existsSync(uploadsDir)) { // Verifica si el directorio uploads existe y, si no, lo crea
  fs.mkdirSync(uploadsDir); //Recibe la ruta del directorio uploads y la guarda en la variable uploadsDir y crea el directorio si no existe
}

const getFilenameFromUrl = (url) => { // Función para obtener el nombre del archivo de una URL
  const urlParts = url.split('/'); // Divide la URL en partes separadas por /
  return urlParts[urlParts.length - 1]; // Devuelve la última parte de la URL, que corresponde al nombre del archivo
};

const downloadAndCompressImages = async () => { // Función para descargar y comprimir las imágenes usando un metodo asyncrono
  const urls = await images.getImages(); //Recibe un arreglo de URLs de imágenes para descargar y comprimir
  for (const url of urls) { // Itera sobre cada URL en el arreglo de URLs para descargar y comprimir las imágenes
    try {
      const originalFilename = getFilenameFromUrl(url); //Recibe el nombre del archivo original de la URL y lo guarda en la variable originalFilename para usarlo en la ruta de la imagen comprimida
      const compressedImagePath = path.join(uploadsDir, `compressed-http-${originalFilename}`); // Ruta donde se guardará la imagen comprimida

      const imageBuffer = await new Promise((resolve, reject) => { // Convierte los datos de la respuesta en un buffer para procesar la imagen
        https.get(url, (response) => { // Realiza una solicitud GET a la URL especificada y espera la respuesta
          if (response.statusCode !== 200) { // Verifica si el código de estado de la respuesta es 200 por que el 200 indica que la solicitud fue exitosa y la respuesta tiene el contenido solicitado
            reject(new Error(`Failed to fetch image. Status code: ${response.statusCode}`)); // Muestra un mensaje de error si el código de estado no es 200
            return;
          }

          const chunks = []; // Crea un arreglo vacío para almacenar los chuncks de datos de la respuesta
          response.on('data', (chunk) => chunks.push(chunk)); // Agrega los chuncks de datos a la lista de chuncks
          response.on('end', () => resolve(Buffer.concat(chunks))); // Concatena los chuncks de datos en un buffer y resuelve la promesa
        }).on('error', (err) => reject(err)); // Maneja el error si la solicitud falla
      });

      await sharp(imageBuffer) // Utiliza sharp para redimensionar y comprimir la imagen y recibe el buffer de la imagen
        .resize(300)
        .jpeg({ quality: 80 })
        .toFile(compressedImagePath); // Recibe la ruta donde se guardará la imagen comprimida y la guarda

      console.log(`Imagen comprimida guardada en: ${compressedImagePath}`);
    } catch (err) {
      console.error(`Error al procesar la imagen ${url}:`, err);
    }
  }
};

downloadAndCompressImages(); // Llama a la función para descargar y comprimir la imagen
