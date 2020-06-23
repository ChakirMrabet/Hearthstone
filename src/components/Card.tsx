/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Card Component.
 */

import * as React from 'react';
import classnames from 'classnames';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState, ICard } from '../types';
import { hoverCard, clickCard } from '../actions';
import noPicture from 'assets/img/no-picture.png';

interface ICardNameProps {
  show: boolean;
  name: string;
}

function CardName({ show, name }: ICardNameProps) {
  if (show) {
    return (
      <div className="name">
        <p>{name}</p>
      </div>
    );
  }
  return null;
}

interface ICardItemProps {
  id: string;
  name?: string;
  image: string;
  isNameVisible?: boolean;
  isHovered?: boolean;
  isClicked?: boolean;
  isSelected?: boolean;
  onClick?: (id: string) => void;
  onImageError: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => void;
}

function Card({
  id,
  name,
  image,
  isNameVisible,
  isHovered,
  isClicked,
  isSelected,
  onClick,
  onImageError,
  onMouseEnter,
  onMouseLeave,
}: ICardItemProps) {
  return (
    <div
      className={classnames('card', {
        hovered: isHovered,
        clicked: isClicked,
        selected: isSelected,
      })}
      onClick={() => onClick && onClick(id)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}>
      <img src={image} onError={onImageError} />
      <CardName show={Boolean(isNameVisible)} name={name || ''} />
    </div>
  );
}

interface CardProps {
  id: string;
  name?: string;
  image: string;
  onClick?: (id: string) => void;
}

function Container(props: CardProps) {
  const dispatch = useDispatch();
  const [isHovered, setHovered] = useState(false);
  const [showName, setShowName] = useState(false);
  const clickedCardId = useSelector((state: IAppState) => state.clickedCardId);
  const deck = useSelector((state: IAppState) => state.deck);

  const isClicked = clickedCardId === props.id;
  const isSelected = Boolean(deck.find((card: ICard) => card.cardId === props.id));

  function handleImageError(e) {
    e.currentTarget.src = noPicture;
    setShowName(true);
  }

  function handleClick(id: string) {
    const { onClick } = props;
    if (!isSelected && onClick) {
      dispatch(clickCard(id));
      onClick(id);
    }
  }

  function handleMouseEnter() {
    dispatch(hoverCard());
    setHovered(true);
  }

  function handleMouseLeave() {
    setHovered(false);
  }

  return (
    <Card
      {...props}
      isNameVisible={showName}
      isHovered={isHovered}
      isClicked={isClicked}
      isSelected={isSelected}
      onClick={handleClick}
      onImageError={handleImageError}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export default Container;
