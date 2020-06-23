/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Manages all data handling with remote API.
 */

import { IFilters, ICard, IPaginatedCards } from '../types';
import Fetch from './fetch';
import { hasProps } from '../utils/validation';

/**
 * Maps filter names to card property names.
 */
const filterToProp = {
  classes: 'playerClass',
  sets: 'cardSet',
  types: 'type',
  factions: 'faction',
  qualities: 'quality',
  races: 'race',
};

/**
 * Defines the filters we want to use from all the set returned
 * by the Hearthstone API.
 */
const desiredFilters = ['classes', 'types', 'sets', 'factions', 'qualities', 'races'];

/**
 * Defines the card properties we want to use from all the set returned
 * by the Hearthstone API.
 */
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
   * Queries for the API for the first time.
   * @async
   * @returns Promise that returns filters.
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
   * Returns from the API all the cards that satisfy the current stack of active filters.
   * The filter passed as argument gets added to the stack of filters, which are
   * applied in consecutive calls to the this same method in order to filter the cards.
   * When the value of the filter is empty, the filter will be removed from the stack of filters.
   * @async
   * @param filterName Name of the filter.
   * @param filterValue Value of the filter.
   * @returns Cards found.
   */
  async getCardsBy(filterName: string, filterValue: string): Promise<IPaginatedCards> {
    if (filterValue === '') {
      this.filtersApplied = this.filtersApplied.filter((item) => item.filterName !== filterName);
    } else {
      this.filtersApplied.push({ filterName, filterValue });
      if (this.firstAppliedFilterName === null) {
        this.firstAppliedFilterName = filterName;
      }
    }

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

    if (!this.filtersApplied.length) {
      this.cards = [];
      return { cards: [], paginator: null };
    }

    if (!this.cards.length) {
      const returnedCards = await Fetch.get(endPoint, endPointValue);
      this.cards = returnedCards !== null ? returnedCards : [];
      this.cleanCardData(this.cards);
      this.filteredCards = this.cards;
    }

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

    return this.getCards();
  }

  /**
   * Returns the properties of the given card.
   * @async
   * @param id Id of the card.
   * @returns Card properties.
   */
  async getCardByID(id): Promise<ICard | null> {
    let foundCard = this.cards.find((card) => card.cardId === id);
    if (!foundCard) {
      foundCard = this.storedCards.find((card) => card.cardId === id);
    }

    if (!foundCard) {
      const foundCards = await Fetch.get('cards', id);
      foundCard = foundCards ? foundCards[0] : null;
    }

    if (foundCard) {
      this.cleanCardData(foundCard);
      foundCard.image = Fetch.getImageURL(foundCard.cardId);
      this.storedCards[id] = foundCard;
      return foundCard;
    }

    return null;
  }

  /**
   * Returns all the filters with reduced options based on the current cards.
   * @returns filters with active options.
   */
  getFilters(): IFilters {
    if (!this.cards.length) {
      return this.filters;
    }

    const { filteredCards: cards, filters } = this;
    const commonFilters = {};

    Object.keys(filters).forEach((filterName) => {
      const prop = filterToProp[filterName];
      const filteredOptions = {};

      cards.forEach((card) => {
        if (hasProps(card, prop)) {
          if (Number.isNaN(filteredOptions[card[prop]])) {
            filteredOptions[card[prop]] = 1;
          } else {
            filteredOptions[card[prop]] += 1;
          }
        }
      });

      commonFilters[filterName] = filters[filterName].filter(
        (option) => filteredOptions[option] > 0
      );
    });
    return commonFilters;
  }

  /**
   * Returns the name of all the filters that are currently applied.
   * @returns Array with the name of the filters applied.
   */
  getFiltersApplied(): string[] {
    return this.filtersApplied.map((filter) => filter.filterName);
  }

  /**
   * Returns cards with pagination.
   * @param page Page number.
   * @param cardsPerPage Number of cards per page.
   * @returns Cards in the selected page.
   */
  getCards(page = 1, cardsPerPage = this.cardsPerPage): IPaginatedCards {
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
   * Returns the image URL for the given card.
   * @param cardId Card Id.
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
