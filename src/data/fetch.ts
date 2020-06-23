/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Encapsulation of fetch.
 */

import config from './config';

const { apiURL, apiKey, apiImgURL, apiEndPoints } = config;

/**
 * Performs an asynchronous GET query to the given endpoint and with the given parameters.
 * @async
 * @param endpoint Name of the endpoint.
 * @param params Parameters.
 * @returns Promise that resolves in an object parsed from a JSON response.
 */
async function get(endpoint: string, params?: string | null): Promise<any> {
  if (!apiURL || !apiKey || !apiImgURL) {
    throw new Error('The supplied API credentials are invalid.');
  }

  if (!(endpoint in apiEndPoints)) {
    throw new Error(`The endpoint "${endpoint}" is not supported.`);
  }

  let url: string = `https://${apiURL}/${apiEndPoints[endpoint]}`;
  if (params) {
    url += `/${params}`;
  }

  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': apiURL,
        'x-rapidapi-key': apiKey,
      },
    });

    if (!res.ok) {
      throw new Error(`Fetching endpoint ${endpoint} has failed with code ${res.status}.`);
    }

    return await res.json();
  } catch (e) {
    throw new Error(
      `Fetching endpoint ${endpoint} has failed (${e.message}). Check your Internet connection., if the problem persists, the remote API might be down.`
    );
  }
}

/**
 * Returns the URL for an image for the given card.
 * @param id Card Id.
 * @returns Image URL.
 */
function getImageURL(id: string): string {
  return `${apiImgURL}/${id}.png`;
}

export default {
  get,
  getImageURL,
};
