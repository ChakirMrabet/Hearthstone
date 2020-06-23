/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * CardBrowser Component.
 */

import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState, ICard } from '../types';
import { selectCard } from '../actions';
import Card from './Card';
import CardPaginator from './CardPaginator';

interface IProps {
  total: number;
  cards: ICard[];
  onCardClick?: (cardId: string) => void;
}

function CardBrowser({ total, cards, onCardClick }: IProps) {
  return (
    <div id="card-browser">
      <div className="info">
        <p>{total} cards found</p>
        <CardPaginator />
      </div>
      <div className="content">
        <div>
          {cards.map((card) => (
            <Card
              key={card.cardId}
              id={card.cardId}
              image={card.image}
              name={card.name}
              onClick={onCardClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CardBrowserEmpty() {
  return (
    <div id="card-browser">
      <div className="content empty">
        <p>No cards, use the filters on the left panel to search.</p>
      </div>
    </div>
  );
}

function Container() {
  const cards = useSelector((state: IAppState) => state.cards);
  const paginator = useSelector((state: IAppState) => state.paginator);
  const dispatch = useDispatch();

  function handleCardClick(cardId: string) {
    dispatch(selectCard(cardId));
  }

  if (cards && cards.length && paginator) {
    return <CardBrowser total={paginator.totalItems} cards={cards} onCardClick={handleCardClick} />;
  }
  return <CardBrowserEmpty />;
}

export default Container;
