/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Configuration values used by the application.
 */

export default {
  appName: 'Hearthstone Browser',
  version: '1.0',
  apiURL: process.env.API_URL,
  apiKey: process.env.API_KEY,
  apiImgURL: process.env.API_IMG_URL,
  apiEndPoints: {
    info: 'info',
    classes: 'cards/classes',
    sets: 'cards/sets',
    types: 'cards/types',
    factions: 'cards/factions',
    qualities: 'cards/qualities',
    races: 'cards/races',
    cards: 'cards',
  },
};
