/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Deck Component.
 */

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState, ICard } from '../types';
import { showModal, removeCard, clickDeckCard, emptyDeck, saveDeck, loadDeck } from '../actions';

interface IDeckProps {
  cards: ICard[];
  onRemove: (cardId: string) => void;
  onClickCard: (cardId: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
  onClickEmpty: () => void;
  onClickSave: () => void;
  onClickLoad: () => void;
}

function Deck({
  cards,
  onRemove,
  onClickCard,
  onClickEmpty,
  onClickSave,
  onClickLoad,
}: IDeckProps) {
  return (
    <div id="deck">
      <div className="header">
        <h2>Deck</h2>
        <div>
          <button title="Export deck" onClick={onClickSave}>
            <i className="fa fa-download"></i>
          </button>
          <button title="Import deck" onClick={onClickLoad}>
            <i className="fa fa-upload"></i>
          </button>
          <button title="Empty deck" onClick={onClickEmpty}>
            <i className="fa fa-trash-alt"></i>
          </button>
        </div>
      </div>
      <p>You have {cards.length} cards:</p>
      <ul>
        {cards.map((card) => (
          <li key={card.cardId}>
            <div>
              <a href="" onClick={(e) => onClickCard(card.cardId, e)}>
                {card.name}
              </a>
            </div>
            <div className="button">
              <button onClick={() => onRemove(card.cardId)}>
                <i className="fa fa-times"></i>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DeckEmpty({ onClickLoad }) {
  return (
    <div id="deck">
      <div className="header">
        <h2>Deck</h2>
        <div>
          <button title="Import deck" onClick={onClickLoad}>
            <i className="fa fa-upload"></i>
          </button>
        </div>
      </div>
      <p>
        Your deck is empty! Search cards, click one, and press the Add button to add it. You can
        also import a file of cards by clicking the Upload button.
      </p>
    </div>
  );
}

function Container() {
  const deck: ICard[] = useSelector((state: IAppState) => state.deck);
  const dispatch = useDispatch();

  function handleRemoveCard(cardId: string) {
    dispatch(
      showModal('confirm', 'Are you sure that you want to delete this card?', () => {
        dispatch(removeCard(cardId));
      })
    );
  }

  function handleShowCard(cardId: string, e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    dispatch(clickDeckCard(cardId));
  }

  function handleEmptyDeck() {
    dispatch(
      showModal('confirm', 'Are you sure that you want to empty your deck?', () =>
        dispatch(emptyDeck())
      )
    );
  }

  function handleSaveDeck() {
    dispatch(
      showModal('confirm', 'Do you want to export the content of your deck?', () => {
        dispatch(saveDeck(deck));
      })
    );
  }

  function handleLoadDeck() {
    if (deck.length) {
      dispatch(
        showModal(
          'confirm',
          'Are you sure you want to import a deck and overwrite your current one?',
          () => {
            dispatch(loadDeck());
          }
        )
      );
      return;
    }
    dispatch(loadDeck());
  }

  if (deck.length) {
    return (
      <Deck
        cards={deck}
        onRemove={handleRemoveCard}
        onClickCard={handleShowCard}
        onClickEmpty={handleEmptyDeck}
        onClickSave={handleSaveDeck}
        onClickLoad={handleLoadDeck}
      />
    );
  }

  return <DeckEmpty onClickLoad={handleLoadDeck} />;
}

export default Container;
