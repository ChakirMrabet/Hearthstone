/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * CardInfo Component.
 */

import React, { Fragment } from 'react';
import { IAppState, ICard } from '../types';
import { useSelector, useDispatch } from 'react-redux';
import { addCard } from '../actions';
import { removeHTMLTags } from '../utils/strings';

interface IProps {
  data: ICard;
  onAdd?: (data: ICard) => void;
}

function CardInfo({ data, onAdd }: IProps) {
  if (data.text) {
    data.text = removeHTMLTags(data.text);
  }
  return (
    <div id="card-info">
      <h2>Card Information</h2>
      <div>
        <dl>
          {Object.keys(data).map((key) => (
            <Fragment key={key}>
              <dt>{key}</dt>
              <dd>{data[key]}</dd>
            </Fragment>
          ))}
        </dl>
      </div>
      {onAdd && <button onClick={() => onAdd(data)}>+Add</button>}
    </div>
  );
}

function CardInfoEmpty() {
  return (
    <div id="card-info">
      <h2>Card Information</h2>
      <p>Click a card to see its details.</p>
    </div>
  );
}

function Container() {
  const selectedCardId = useSelector((state: IAppState) => state.selectedCardId);
  const cards = useSelector((state: IAppState) => state.cards);
  const deck = useSelector((state: IAppState) => state.deck);
  const dispatch = useDispatch();

  function handleAddCard(cardData) {
    dispatch(addCard(cardData));
  }

  if (selectedCardId && cards && cards.length) {
    const cardData = cards.find((card: ICard) => card.cardId === selectedCardId);
    if (cardData) {
      // No queremos mostrar la ruta de la imágen en la caja de información..
      delete cardData.image;
      const showAddButton = deck.find((card) => card.cardId === selectedCardId);
      if (!showAddButton) {
        return <CardInfo data={cardData} onAdd={handleAddCard} />;
      }
      return <CardInfo data={cardData} />;
    }
  }
  if (cards && cards.length) {
    return <CardInfoEmpty />;
  }
  return null;
}

export default Container;
