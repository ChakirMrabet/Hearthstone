/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Actions.
 */

import { Dispatch } from 'redux';
import API from './data/API';
import config from './data/config';

import {
  ICard,
  ACTIONS,
  AppThunk,
  IShowModalAction,
  IHideModalAction,
  ISelectCardAction,
  IClickCardAction,
  IAddCardAction,
  IRemoveCardAction,
  IEmptyDeckAction,
  IFetchCardsAction,
} from './types';

import soundtrack from 'assets/sounds/soundtrack.mp3';
import notificationSound from 'assets/sounds/notification.mp3';
import alertSound from 'assets/sounds/alert.mp3';
import cardHoverSound from 'assets/sounds/card_hover.wav';
import cardClickedSound from 'assets/sounds/click_card.wav';
import cardRemovedSound from 'assets/sounds/remove_card.wav';
import flipPageSound from 'assets/sounds/flip_page.wav';

const api = new API();

/**
 * Plays a sound file.
 * @param src Path of the sound file.
 * @param loop When true, the sound is played forever.
 */
function playAudio(src: string, loop = false) {
  const audio = new Audio(src);
  audio.play();
  if (loop) {
    audio.addEventListener('ended', function () {
      this.currentTime = 0;
      this.play();
    });
  }
}

export function playClickAudio() {
  playAudio(cardClickedSound);
}

export function playFlipPageAudio() {
  playAudio(flipPageSound);
}

/**
 * Shows a modal dialog box.
 * @param type Dialog type: status, alert, or confirm.
 * @param text Text content to show in the dialog box.
 * @param callback Function to execute when the dialog's Accept button is pressed.
 */
export function showModal(
  type: string,
  content: string | ICard,
  callback?: () => any
): IShowModalAction {
  if (type !== 'status') {
    playAudio(alertSound);
  }
  return {
    type: ACTIONS.SHOW_MODAL,
    payload: { type, content, callback },
  };
}

export function hideModal(): IHideModalAction {
  return {
    type: ACTIONS.HIDE_MODAL,
    payload: null,
  };
}

/**
 * Fetches from the API the available filters and shows a welcome message.
 */
export function initApp(): AppThunk {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(showModal('status', 'Loading...'));
      const filters = await api.init();
      const cards = await api.getCards();
      dispatch(hideModal());

      dispatch({
        type: ACTIONS.SHOW_MODAL,
        payload: {
          type: 'alert',
          title: `Hearthstone Browser v${config.version}`,
          content: `<p>Use the filters on the left side panel to search for cards.</p>
                        <p>Click any card to see its information on the right top panel, and press the Add button to add the card to your deck.
                        You can see the content of your deck on the right bottom panel.</p>
                        <p>The available filters and their options will change based on the cards found, to start over just press the Reset button.</p>
                        <p>You can also export the content of your deck into a file that you can import in a later moment.</p>
                        <p class="copyright">The music and graphics used by this application were taken from World of Warcraft and HearthStone official websites. 
                        All other sound effects are from freesound.org.<p>`,
          callback: () => {
            dispatch({
              type: ACTIONS.INIT_APP,
              payload: filters,
            });

            playAudio(soundtrack, true);
          },
        },
      });
    } catch (e) {
      return dispatch({
        type: ACTIONS.SHOW_MODAL,
        payload: {
          type: 'status',
          text: 'There was a problem during initialization: ' + e.message,
        },
      });
    }
  };
}

/**
 * Fetches from the api the resultant cards after passing the given filter.
 * @param filterName Name of the filter.
 * @param filterValue Value of the filter.
 * @returns Redux Thunk.
 */
export function fetchCards(filterName: string, filterValue: string): AppThunk {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(showModal('status', 'Fetching cards...'));

      const cards = await api.getCardsBy(filterName, filterValue);
      const filters = api.getFilters();

      dispatch({
        type: ACTIONS.FETCH_FILTERS,
        payload: filters,
      });
      dispatch({
        type: ACTIONS.FETCH_CARDS,
        payload: cards,
      });

      dispatch({
        type: ACTIONS.SELECT_FILTER,
        payload: { name: filterName, value: filterValue },
      });

      dispatch(hideModal());
    } catch (e) {
      return dispatch({
        type: ACTIONS.SHOW_MODAL,
        payload: {
          type: 'alert',
          content: 'There was a problem when fetching cards: ' + e.message,
        },
      });
    }
  };
}

/**
 * Returns paginated cards.
 * @param page Page number.
 * @param itemsPage Number of cards per page.
 * @returns Redux Action.
 */
export function fetchCardsForPage(page: number, itemsPage: number): IFetchCardsAction {
  const cards = api.getCards(page, itemsPage);
  return {
    type: ACTIONS.FETCH_CARDS,
    payload: cards,
  };
}

/**
 * Gets executed when a card is hovered.
 * @returns Redux Thunk.
 */
export function hoverCard(): AppThunk {
  return () => {
    // This tunk is just a placehoder for future functionality, since this
    // is not necessary for just playing audio.
    playAudio(cardHoverSound);
  };
}

/**
 * Gets executed when a card is clicked.
 * @param id Card ID.
 * @returns Redux Thunk.
 */
export function clickCard(id: string): IClickCardAction {
  playClickAudio();
  return {
    type: ACTIONS.CLICK_CARD,
    payload: id,
  };
}

/**
 * Selects the card that should be shown on the information panel.
 * @param id Card id.
 * @returns Redux action.
 */
export function selectCard(id: string): ISelectCardAction {
  return {
    type: ACTIONS.SELECT_CARD,
    payload: id,
  };
}

/**
 * Adds a card to the deck.
 * @param cardData Data for the card to add.
 * @returns Redux action.
 */
export function addCard(cardData: ICard): IAddCardAction {
  playAudio(notificationSound);
  return {
    type: ACTIONS.ADD_CARD,
    payload: cardData,
  };
}

/**
 * Removes a card from the deck.
 * @param cardId Id of the card to remove.
 * @returns Redux Action.
 */
export function removeCard(cardId: string): IRemoveCardAction {
  playAudio(cardRemovedSound);
  return {
    type: ACTIONS.REMOVE_CARD,
    payload: cardId,
  };
}

/**
 * Clears the content of the deck.
 */
export function emptyDeck(): IEmptyDeckAction {
  return {
    type: ACTIONS.EMPTY_DECK,
    payload: null,
  };
}

/**
 * Fethes the information of the card with the provided id.
 * @param cardId id of the card to fetch.
 */
export function clickDeckCard(cardId: string): AppThunk {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(showModal('status', 'Fetching card information..'));
      const card = await api.getCardByID(cardId);
      console.log('ACTION: ', card);
      dispatch({
        type: ACTIONS.FETCH_CARD,
        payload: card,
      });
      dispatch(hideModal());
      if (card) {
        dispatch(showModal('cardInfo', card));
      }
    } catch (e) {
      return dispatch({
        type: ACTIONS.SHOW_MODAL,
        payload: {
          type: 'error',
          content: `Could not retrieve information for card ${cardId}: ${e.message}`,
        },
      });
    }
  };
}

/**
 * Makes the browser to download a file with the content of the deck
 * in JSON format.
 * @param deck Content of the deck.
 */
export function saveDeck(deck: ICard[]): AppThunk {
  return () => {
    const data = JSON.stringify(deck);
    const f = document.createElement('a');
    f.href = 'data:text/json,' + encodeURIComponent(data);
    f.download = 'HearthStoneDeck.json';
    f.click();
  };
}

/**
 * Loads the content of a deck file.
 */
export function loadDeck(): AppThunk {
  return async (dispatch: Dispatch) => {
    if (typeof window.FileReader !== 'function') {
      dispatch(showModal('error', 'This browser does not support the file API.'));
      return;
    }

    const file = document.createElement('input');
    file.type = 'file';
    file.addEventListener('change', (e) => {
      const fr = new FileReader();
      const target = <HTMLInputElement>e.target;
      if (target.files && target.files[0]) {
        fr.readAsText(target.files[0]);
        fr.onload = (e) => {
          if (e.target && e.target.result) {
            // TODO: validate the the loaded file to make sure it's an array of ICard!!!
            dispatch({
              type: ACTIONS.LOAD_DECK,
              payload: JSON.parse(<string>e.target.result),
            });
          }
        };
      }
    });
    file.click();
  };
}

/**
 * Resets the filters and current loaded cards.
 * @returns Thunk redux.
 */
export function reset(): AppThunk {
  return async (dispatch: Dispatch) => {
    try {
      dispatch(showModal('status', 'Fetching filters...'));

      const filters = await api.init();

      dispatch({
        type: ACTIONS.FETCH_FILTERS,
        payload: filters,
      });
      dispatch({
        type: ACTIONS.RESET_SELECTED_FILTERS,
        payload: null,
      });
      dispatch({
        type: ACTIONS.FETCH_CARDS,
        payload: [],
      });

      dispatch(hideModal());
    } catch (e) {
      return dispatch({
        type: ACTIONS.SHOW_MODAL,
        payload: {
          type: 'alert',
          content: 'There was a problem when fetching default filters: ' + e.message,
        },
      });
    }
  };
}
