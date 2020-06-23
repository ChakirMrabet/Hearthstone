/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Encapsulation of fetch.
 */

import config from './config';

const { apiURL, apiKey, apiImgURL, apiEndPoints } = config;

/**
 * Realiza una consulta asincrona de tipo GET al endpoint y parámetros pasados como argumentos.
 * @async
 * @param endpoint Nombre del endpoint.
 * @param params Parámetros adicionales.
 * @returns Promesa que resuelve en un objeto parseado de una respuesta JSON.
 */
async function get(endpoint: string, params?: string | null): Promise<any> {
  // Comprobamos primero que hay credenciales definidas.
  if (!apiURL || !apiKey || !apiImgURL) {
    throw new Error('The supplied API credentials are invalid.');
  }

  // Comprobamos el que el endpoint solicitado es uno de los soportados.
  if (!(endpoint in apiEndPoints)) {
    throw new Error(`The endpoint "${endpoint}" is not supported.`);
  }

  // Construimos la URL de la request, si el usuario ha pasado parametros,
  // los añadimos tambien.
  let url: string = `https://${apiURL}/${apiEndPoints[endpoint]}`;
  if (params) {
    url += `/${params}`;
  }

  // Hacemos la consulta asincrona pasando las cabeceras en el objeto de
  // opciones de fetch.
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': apiURL,
        'x-rapidapi-key': apiKey,
      },
    });

    // La consulta se ha completado con un error (códigos HTTP diferentes a 200)
    if (!res.ok) {
      throw new Error(`Fetching endpoint ${endpoint} has failed with code ${res.status}.`);
    }

    // Convertimos a JSON y devolvemos el resultado.
    return await res.json();
  } catch (e) {
    // Ha habido un error relacionado con la conexión (la consulta no se ha completado).
    throw new Error(
      `Fetching endpoint ${endpoint} has failed (${e.message}). Check your Internet connection., if the problem persists, the remote API might be down.`
    );
  }
}

/**
 * Devuelve URL de la imagen para la carta con el id pasado como argumento.
 * @param id id de la carta.
 * @returns URL de la imagen.
 */
function getImageURL(id: string): string {
  return `${apiImgURL}/${id}.png`;
}

export default {
  get,
  getImageURL,
};
