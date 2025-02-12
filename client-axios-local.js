const fs = require('fs'); // Manejo de archivos
const sharp = require('sharp'); // Comprimir imágenes
const path = require('path'); // Manejo de rutas
const pidusage = require('pidusage'); // Monitor de CPU y RAM
const { performance } = require('perf_hooks'); // Medir tiempo

const imagesDir = path.join(__dirname, 'images');
const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir);
}

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

const downloadAndCompressImages = async () => {
  try {
    const imageFiles = fs.readdirSync(imagesDir);

    for (const file of imageFiles) {
      const imagePath = path.join(imagesDir, file);

      if (!fs.statSync(imagePath).isFile()) {
        continue;
      }

      try {
        const outputFileName = `compressed-${path.parse(file).name}.jpg`;
        const compressedImagePath = path.join(uploadsDir, outputFileName);
        const imageBuffer = fs.readFileSync(imagePath);

        const start = performance.now();

        await sharp(imageBuffer)
          //.resize(1920)
          .jpeg({ quality: 50 })
          .toFile(compressedImagePath);

        const end = performance.now();

        const stats = await pidusage(process.pid);

        console.log(`Imagen comprimida: ${file}`);
        console.log(`Guardada en: ${compressedImagePath}`);
        console.log(`Tiempo de compresión: ${(end - start).toFixed(2)} ms`);
        console.log(`Uso de CPU: ${stats.cpu.toFixed(2)}%`);


        console.log(`Uso de RAM: ${(stats.memory / 1024 / 1024).toFixed(2)} MB\n`);
      } catch (err) {
        console.error(`Error al procesar la imagen ${file}:`, err);
      }
    }
  } catch (err) {
    console.error('Error al leer el directorio de imágenes:', err);
  }
};

downloadAndCompressImages();
