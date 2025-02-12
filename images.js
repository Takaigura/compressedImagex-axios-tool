const axios = require('axios');

const API_BASE_URL = 'http://localhost:8000'; // URL base de la API
const AUTH_ENDPOINT = '/auth/login'; // Endpoint para autenticación
const ENTITIES_ENDPOINT = '/entities'; // Endpoint para obtener entidades
const IMAGES_ENDPOINT = '/entities/{id}/images'; // Endpoint para obtener imágenes de una entidad

const credentials = {
  username: 'usuario',
  password: 'contraseña'
};

async function obtenerTokenDeAutorizacion() {
  try {
    const response = await axios.post(`${API_BASE_URL}${AUTH_ENDPOINT}`, credentials);
    return response.data.token;
  } catch (error) {
    console.error('Error al obtener el token de autenticación:', error);
    return null;
  }
}

async function obtenerEntidades(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}${ENTITIES_ENDPOINT}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Error al obtener entidades:', error);
    return [];
  }
}

async function obtenerImagenesPorEntidad(entidadId, token) {
  try {
    const url = `${API_BASE_URL}${IMAGES_ENDPOINT.replace('{id}', entidadId)}`;
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data.map(imagen => imagen.url);
  } catch (error) {
    console.error(`Error al obtener imágenes para la entidad ${entidadId}:`, error);
    return [];
  }
}

async function obtenerTodasLasImagenes() {
  const imageUrls = [];
  const token = await obtenerTokenDeAutorizacion();
  if (!token) return imageUrls;

  const entidades = await obtenerEntidades(token);
  for (const entidad of entidades) {
    const imagenes = await obtenerImagenesPorEntidad(entidad._id, token);
    imageUrls.push(...imagenes);
  }
  return imageUrls;
}

const getImages = async () => obtenerTodasLasImagenes();

module.exports = { getImages };
