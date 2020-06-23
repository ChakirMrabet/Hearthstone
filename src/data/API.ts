/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Manages all data handling with remote API.
 */

import { IFilters, ICard, IPaginatedCards } from '../types';
import Fetch from './fetch';
import { hasProps } from '../utils/validation';

/** Mapeo de nombres de filtro a los nombres de las propiedades de cartas. */
const filterToProp = {
  classes: 'playerClass',
  sets: 'cardSet',
  types: 'type',
  factions: 'faction',
  qualities: 'quality',
  races: 'race',
};

/** Filtros que queremos usar. */
const desiredFilters = ['classes', 'types', 'sets', 'factions', 'qualities', 'races'];

/** Propiedades de las cartas que queremos usar. */
const desiredCardProperties = [
  'cardId',
  'name',
  'playerClass',
  'cardSet',
  'type',
  'faction',
  'rarity',
  'race',
  'text',
  'cost',
];

export default class API {
  /** Número de cartas a devolver por página. */
  private cardsPerPage: number;
  private filters: IFilters;
  private cards: ICard[];
  private storedCards: ICard[];
  private filteredCards: ICard[];
  private filtersApplied: any;
  private firstAppliedFilterName: string | null;

  constructor() {
    this.cardsPerPage = 10;
    this.filters = {};
    this.cards = [];
    this.storedCards = [];
    this.filteredCards = [];
    this.filtersApplied = [];
    this.firstAppliedFilterName = null;
  }

  /**
   * Realiza una primera consulta para obtener los filtros disponibles en la API remota.
   * @async
   * @returns Promesa que resuelve en filtros.
   */
  async init(): Promise<IFilters> {
    this.cardsPerPage = 10;
    this.filters = {};
    this.cards = [];
    this.filteredCards = [];
    this.filtersApplied = [];
    this.firstAppliedFilterName = null;

    const filters = await Fetch.get('info');

    Object.keys(filters).forEach((key) => {
      if (desiredFilters.includes(key)) {
        this.filters[key] = filters[key];
      }
    });
    return this.getFilters();
  }

  /**
   * Devuelve una promesa que resuelve en todas las cartas filtradas por el nombre de filtro dado y su valor.
   * @async
   * @param filterName Nombre del filtro.
   * @param filterValue Valor del filtro.
   * @returns Promesa que resuelve en las cartas filtradas.
   */
  async getCardsBy(filterName: string, filterValue: string): Promise<IPaginatedCards> {
    // Si el valor del filtro es vacío, lo quitamos de la lista de filtros a aplicar.
    // De lo contrario, lo añadimos.
    if (filterValue === '') {
      this.filtersApplied = this.filtersApplied.filter((item) => item.filterName !== filterName);
    } else {
      this.filtersApplied.push({ filterName, filterValue });
      // Si es el primero filtro que se aplica, lo guardamos porque actuara como el principal.
      if (this.firstAppliedFilterName === null) {
        this.firstAppliedFilterName = filterName;
      }
    }

    // Si se ha deseleccionado el primer filtro causante de la solicitud a la API remota,
    // hacemos el siguiente filtro seleccionado como principal, y consultamos su endpoint
    // remoto para volver a llenar las cartas. Si no hay mas filtros, reseteamos todo.
    let endPoint = filterName;
    let endPointValue = filterValue;

    const found = Object.keys(this.filtersApplied).filter(
      (name) => this.filtersApplied[name].filterName === this.firstAppliedFilterName
    );
    if (!found.length) {
      if (!this.filtersApplied.length) {
        this.firstAppliedFilterName = null;
        this.filtersApplied = [];
        this.cards = [];
        return { cards: [], paginator: null };
      }
      endPoint = this.filtersApplied[0].filterName;
      endPointValue = this.filtersApplied[0].filterValue;
      this.firstAppliedFilterName = this.filtersApplied[0].filterName;
      this.cards = [];
    }

    // Si el numero de filtros aplicados es 0, entonces significa que hemos
    // reseteado todos los filtros, por tanto vaciamos las cartas y devolvemos vacio.
    if (!this.filtersApplied.length) {
      this.cards = [];
      return { cards: [], paginator: null };
    }

    // Si no tenemos cartas guardadas hacemos la busqueda de la API con el
    // filtro pasado como endpoint (guardado como principal anteriormente).
    if (!this.cards.length) {
      const returnedCards = await Fetch.get(endPoint, endPointValue);
      this.cards = returnedCards !== null ? returnedCards : [];
      this.cleanCardData(this.cards);
      this.filteredCards = this.cards;
    }

    // Tenemos cartas guardadas, por tanto las consultamos localmente aplicando
    // todos los filtros almacenados.
    this.filteredCards = this.cards;
    this.filtersApplied.forEach((filter) => {
      if (filter.filterName !== this.firstAppliedFilterName) {
        this.filteredCards = this.filteredCards.filter(
          (card) =>
            hasProps(card, filterToProp[filter.filterName]) &&
            card[filterToProp[filter.filterName]] === filter.filterValue
        );
      }
    });

    // Devolvemos las cartas resultantes
    return this.getCards();
  }

  /**
   * Devuelve una promesa que resuelve en las propiedades de la carta con el id dado.
   * @async
   * @param id id de la carta.
   * @returns Promesa que resuelve en la carta.
   */
  async getCardByID(id): Promise<ICard | null> {
    // Miramos primero si la carta esta en la lista actual de cartas recibidas de
    // la API en la ultima solicitud realizada.
    let foundCard = this.cards.find((card) => card.cardId === id);
    if (!foundCard) {
      // Si no lo esta, miramos si es una carta que hemos buscado y guardado antes.
      foundCard = this.storedCards.find((card) => card.cardId === id);
    }

    // No hemos encontrado la carta, la consultamos de la API.
    if (!foundCard) {
      const foundCards = await Fetch.get('cards', id);
      foundCard = foundCards ? foundCards[0] : null;
    }

    // Almacenamos la carta si ha sido devuelta de la API, y la devolvemos creando
    // un objeto Card.
    if (foundCard) {
      this.cleanCardData(foundCard);
      foundCard.image = Fetch.getImageURL(foundCard.cardId);
      this.storedCards[id] = foundCard;
      return foundCard;
    }

    // No hemos encontrado la carta localmente, pero tampoco la hemos podido obtener
    // de la API, por tanto informamos y devolvemos null.
    return null;
  }

  /**
   * Devuelve todos los filtros con sus opciones reducidas a aquellas que tienen cartas en base a los
   * filtros actuales aplicados.
   * @returns Filtros con cartas.
   */
  getFilters(): IFilters {
    // Si no tenemos cartas es poque no hemos consultado la API todavia por
    // primera vez. En este caso devolvemos los filtros originales.
    if (!this.cards.length) {
      return this.filters;
    }

    // Tenemos cartas, por tanto tenemos que actualizar el contenido de los
    // filtros en base a las propiedades que tienen las cartas.
    const { filteredCards: cards, filters } = this;
    const commonFilters = {};

    Object.keys(filters).forEach((filterName) => {
      const prop = filterToProp[filterName];
      const filteredOptions = {};

      // Usamos un contador para saber cuantas cartas tienen cada una
      // de las propiedades representadas por cada uno de los filtros.
      cards.forEach((card) => {
        if (hasProps(card, prop)) {
          if (Number.isNaN(filteredOptions[card[prop]])) {
            filteredOptions[card[prop]] = 1;
          } else {
            filteredOptions[card[prop]] += 1;
          }
        }
      });

      // Solo nos quedamos con aquellas opciones de filtro comunes a
      // TODAS las cartas.
      commonFilters[filterName] = filters[filterName].filter(
        (option) => filteredOptions[option] > 0
      );
    });
    return commonFilters;
  }

  /**
   * Devuelve los nombres de todos los filtros aplicados.
   * @returns Array con el nombre de los filtros aplicados.
   */
  getFiltersApplied(): string[] {
    return this.filtersApplied.map((filter) => filter.filterName);
  }

  /**
   * Devuelve las cartas usando paginación.
   * Utiliza las cartas actuales resultantes de las últimas operaciones de filtro.
   * @param page Número de la página.
   * @param cardsPerPage Número de cartas por página.
   * @returns Cartas en la página seleccionada.
   */
  getCards(page = 1, cardsPerPage = this.cardsPerPage) {
    let cards = this.filteredCards;
    const totalItems = cards.length;
    const totalPages = Math.ceil(totalItems / cardsPerPage);

    const start = cardsPerPage * (page - 1);
    let end = start + cardsPerPage;

    if (end > cards.length) {
      end = cards.length;
    }

    cards = cards.slice(start, end);

    cards.forEach((card) => (card.image = Fetch.getImageURL(card.cardId)));

    return {
      cards,
      paginator: {
        totalItems,
        totalPages,
        currentPage: page,
      },
    };
  }

  /**
   * Devuelve la URL de la imágen para la carta dada.
   * @param cardId ID de la carta.
   */
  getPicture(cardId: string): string {
    return Fetch.getImageURL(cardId);
  }

  /**
   * Removes unwanted properties from a card or an array of cards.
   * @param data A single card or array of cards.
   */
  cleanCardData(data: ICard | ICard[]) {
    function cleanCard(card: ICard) {
      Object.keys(card).forEach((key) => {
        if (!desiredCardProperties.includes(key)) {
          delete card[key];
        }
      });
    }

    if (Array.isArray(data)) {
      data.forEach((card) => cleanCard(card));
      return;
    }

    if (typeof data === 'object') {
      cleanCard(data);
    }
  }
}
