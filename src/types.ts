/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Type definitions
 */

import * as React from 'react';
import { ThunkAction } from 'redux-thunk';
import { Action } from 'redux';

/**
 * Content of one card.
 */
export interface ICard {
  readonly cardId: string;
  name: string;
  readonly cardSet?: string;
  readonly type?: string;
  text?: string;
  readonly cost?: string;
  image: string;
}

/**
 * Defines the filters available from the API.
 */
export interface IFilters {
  [filterName: string]: string[];
}

/**
 * Defines the properties of the paginator used to browse cards.
 */
export interface IPaginator {
  readonly totalItems: number;
  readonly totalPages: number;
  readonly currentPage: number;
}

/**
 * Defines the cards returned by the API with their correspondent paginator.
 */
export interface IPaginatedCards {
  cards: ICard[];
  paginator: IPaginator | null;
}

/**
 * Defines the properties of the modal dialog boxes.
 */
export interface IModal {
  type: string;
  title?: string;
  content: string | ICard;
  cardInfo?: ICard;
  callback?: () => any;
}

/**
 * Defines the values selected for each filter.
 */
export interface ISelectedFilters {
  [name: string]: string;
}

/**
 * Defines the properties of the application state.
 */
export interface IAppState {
  modalBox: IModal | null;
  filters: IFilters | null;
  selectedFilters: ISelectedFilters | null;
  cards: ICard[];
  paginator: IPaginator | null;
  clickedCardId: string | null;
  selectedCardId: string | null;
  deck: ICard[];
}

/**
 * Redux action types.
 */
export const ACTIONS = {
  ERROR: 'ERROR',
  SHOW_MODAL: 'SHOW_MODAL',
  HIDE_MODAL: 'HIDE_MODAL',
  INIT_APP: 'INIT_APP',
  FETCH_CARDS: 'FETCH_CARDS',
  FETCH_CARD: 'FETCH_CARD',
  FETCH_FILTERS: 'FETCH_FILTERS',
  SELECT_FILTER: 'SELECT_FILTER',
  RESET_SELECTED_FILTERS: 'RESET_SELECTED_FILTERS',
  CLICK_CARD: 'CLICK_CARD',
  SELECT_CARD: 'SELECT_CARD',
  ADD_CARD: 'ADD_CARD',
  REMOVE_CARD: 'REMOVE_CARD',
  EMPTY_DECK: 'EMPTY_DECK',
  SAVE_DECK: 'SAVE_DECK',
  LOAD_DECK: 'LOAD_DECK',
};

/**
 * Action creator types.
 */

export interface IErrorAction {
  type: typeof ACTIONS.ERROR;
  payload: string;
}

export interface IShowModalAction {
  type: typeof ACTIONS.SHOW_MODAL;
  payload: IModal;
}

export interface IHideModalAction {
  type: typeof ACTIONS.HIDE_MODAL;
  payload: null;
}

export interface IInitAppAction {
  type: typeof ACTIONS.INIT_APP;
  payload: IFilters;
}

export interface IFetchCardsAction {
  type: typeof ACTIONS.FETCH_CARDS;
  payload: {
    cards: ICard[];
    paginator: IPaginator;
  };
}

export interface IFetchCardAction {
  type: typeof ACTIONS.FETCH_CARD;
  payload: ICard;
}

export interface ISelectFilterAction {
  type: typeof ACTIONS.SELECT_FILTER;
  payload: ISelectedFilters;
}

export interface IClickCardAction {
  type: typeof ACTIONS.CLICK_CARD;
  payload: string;
}

export interface ISelectCardAction {
  type: typeof ACTIONS.SELECT_CARD;
  payload: string;
}

export interface IAddCardAction {
  type: typeof ACTIONS.ADD_CARD;
  payload: ICard;
}

export interface IRemoveCardAction {
  type: typeof ACTIONS.REMOVE_CARD;
  payload: string;
}

export interface IEmptyDeckAction {
  type: typeof ACTIONS.EMPTY_DECK;
  payload: null;
}

export interface ISaveDeckAction {
  type: typeof ACTIONS.SAVE_DECK;
  payload: ICard[];
}

export interface ILoadDeckAction {
  type: typeof ACTIONS.LOAD_DECK;
  payload: null;
}

export type ActionTypes =
  | IShowModalAction
  | IHideModalAction
  | IInitAppAction
  | ISelectFilterAction
  | IFetchCardsAction
  | IFetchCardAction
  | IClickCardAction
  | ISelectCardAction
  | IAddCardAction
  | IRemoveCardAction
  | IEmptyDeckAction
  | ISaveDeckAction
  | ILoadDeckAction;

export type AppThunk = ThunkAction<void, IAppState, null, Action<string>>;
export type SelectChangeEvent = (e: React.ChangeEvent<HTMLSelectElement>) => void;
