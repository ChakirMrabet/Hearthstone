/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Redux Reducer
 */

import {
  IModal,
  IFilters,
  ISelectedFilters,
  ICard,
  IAppState,
  IPaginatedCards,
  ACTIONS,
  ActionTypes,
} from './types';

/**
 * Initial state of the application.
 */
const defaultState: IAppState = {
  modalBox: null,
  filters: null,
  selectedFilters: null,
  cards: [],
  paginator: null,
  clickedCardId: null,
  selectedCardId: null,
  deck: [],
};

/**
 * Implements the main reducer for the application.
 * @param state Current state.
 * @param action Action.
 * @returns New state.
 */
export default function reducer(
  state: IAppState = defaultState,
  { type, payload }: ActionTypes
): IAppState {
  switch (type) {
    case ACTIONS.SHOW_MODAL:
      return { ...state, modalBox: <IModal>payload };
    case ACTIONS.HIDE_MODAL:
      return { ...state, modalBox: null };
    case ACTIONS.INIT_APP:
      return { ...state, filters: <IFilters>payload };
    case ACTIONS.FETCH_CARDS: {
      const { cards, paginator } = <IPaginatedCards>payload;
      return { ...state, cards, paginator };
    }
    case ACTIONS.FETCH_FILTERS:
      return { ...state, filters: <IFilters>payload };
    case ACTIONS.SELECT_FILTER: {
      const { name, value } = <ISelectedFilters>payload;
      const newSelectedFilters = { ...state.selectedFilters };
      newSelectedFilters[name] = value;
      return { ...state, selectedFilters: newSelectedFilters };
    }
    case ACTIONS.RESET_SELECTED_FILTERS:
      return { ...state, selectedFilters: null };
    case ACTIONS.CLICK_CARD:
      return { ...state, clickedCardId: <string>payload };
    case ACTIONS.SELECT_CARD:
      return { ...state, selectedCardId: <string>payload };
    case ACTIONS.ADD_CARD: {
      const deck: ICard[] = [...state.deck];
      deck.push(<ICard>payload);
      return { ...state, deck, clickedCardId: null, selectedCardId: null };
    }
    case ACTIONS.REMOVE_CARD: {
      const deck: ICard[] = state.deck.filter((card) => card.cardId !== payload);
      return { ...state, deck };
    }
    case ACTIONS.EMPTY_DECK:
      return { ...state, deck: [] };
    case ACTIONS.LOAD_DECK:
      return { ...state, deck: <ICard[]>payload };
    default:
      return state;
  }
}
