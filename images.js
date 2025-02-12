const axios = require('axios');

const imageUrls = [];

async function obtenerToken() {
  try {
    const response = await axios.post('http://localhost:8000/3dves/user/logIn', {
      user: 'alaguna',
      password: 'abc123'
    });
    const token = response.data.token;
    return token;
  } catch (error) {
    console.error('Error al obtener el token de autenticación:', error);
  }
}

async function obtenerEntidades(token) {
  try {
    const response = await axios.get('http://localhost:8000/3dves/lite/customerData/entities', {
      headers: { 'Authorization': token }
    });
    const entidades = response.data;
    for (const entidad of entidades) {
      const { _id } = entidad;
      const imagenes = await obtenerImagenesPorEntidad(_id, token);
      console.log(imagenes)
      imageUrls.push(...imagenes);
    }
  } catch (error) {
    console.error('Error al obtener las entidades:', error);
  }
}

async function obtenerImagenesPorEntidad(entidadId, token) {
  try {
    const response = await axios.get(`http://localhost:8000/3dves/entity/${entidadId}/images`, {
      headers: { 'Authorization': token }
    });
    return response.data.map(imagen => imagen.url);
  } catch (error) {
    console.error(`Error al obtener las imágenes para la entidad ${entidadId}:`, error);
    return [];
  }
}

async function main() {
  const token = await obtenerToken();
  if (token) {
    await obtenerEntidades(token);
  }
  return imageUrls;
}

const getImages = async () => main();

module.exports = {
  getImages
}
