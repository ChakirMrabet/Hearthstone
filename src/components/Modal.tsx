/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Modal Dialog Box Component.
 */

import React, { Fragment } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState, ICard } from '../types';
import { playClickAudio, hideModal } from '../actions';
import { removeHTMLTags } from '../utils/strings';
import Loader from './Loader';

interface IProps {
  title?: string;
  text: string;
  onAccept?: () => void;
  onCancel?: () => void;
}

function Status({ title, text }: IProps) {
  return (
    <div className="modal">
      <div className="modal-overlay"></div>
      <div className="modal-box">
        {title && <h1>{title}</h1>}
        <div className="body">
          <div dangerouslySetInnerHTML={{ __html: text }} />
          <Loader />
        </div>
      </div>
    </div>
  );
}

function Alert({ title, text, onAccept }: IProps) {
  return (
    <div className="modal">
      <div className="modal-overlay"></div>
      <div className="modal-box">
        {title && <h1>{title}</h1>}
        <div className="body" dangerouslySetInnerHTML={{ __html: text }} />
        <div className="buttons">
          <button onClick={onAccept}>OK</button>
        </div>
      </div>
    </div>
  );
}

function Confirm({ title, text, onAccept, onCancel }: IProps) {
  return (
    <div className="modal">
      <div className="modal-overlay"></div>
      <div className="modal-box">
        {title && <h1>{title}</h1>}
        <div className="body" dangerouslySetInnerHTML={{ __html: text }} />
        <div className="buttons">
          <button onClick={onAccept}>Yes</button>
          <button onClick={onCancel}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

interface ICardInfoProps {
  cardInfo: ICard;
  onAccept?: () => void;
}

function renderCardInfoOptions(cardInfo: ICard) {
  const data = { ...cardInfo };

  // Remove the name and image since they are already present on the
  // modal box.
  delete data.name;
  delete data.image;

  // Remove HMTL entities from the card text.
  if (data.text) {
    data.text = removeHTMLTags(data.text);
  }

  console.log('MODAL:', data);

  return (
    <dl>
      {Object.keys(data).map((key) => (
        <Fragment key={key}>
          <dt>{key}</dt>
          <dd>{data[key]}</dd>
        </Fragment>
      ))}
    </dl>
  );
}

function CardInfo({ cardInfo, onAccept }: ICardInfoProps) {
  return (
    <div className="modal">
      <div className="modal-overlay"></div>
      <div className="modal-box card-info">
        {<h1>{cardInfo.name}</h1>}
        <div className="body">
          <div>
            <img src={cardInfo.image} alt={cardInfo.name} />
          </div>
          <div>{renderCardInfoOptions(cardInfo)}</div>
        </div>
        <div className="buttons">
          <button onClick={onAccept}>OK</button>
        </div>
      </div>
    </div>
  );
}

export default function Container() {
  const modalBox = useSelector((state: IAppState) => state.modalBox);
  const dispatch = useDispatch();

  function handleAccept(cb?: () => any) {
    playClickAudio();
    dispatch(hideModal());
    if (cb) {
      cb();
    }
  }

  function handleCancel() {
    playClickAudio();
    dispatch(hideModal());
  }

  if (modalBox) {
    const { type, title, content, callback } = modalBox;

    switch (type) {
      case 'status':
        if (typeof content == 'string') {
          return <Status title={title} text={content} />;
        }
      case 'alert':
        if (typeof content == 'string') {
          return <Alert title={title} text={content} onAccept={() => handleAccept(callback)} />;
        }
      case 'cardInfo':
        return <CardInfo cardInfo={content as ICard} onAccept={() => handleAccept(callback)} />;
      case 'confirm':
        if (typeof content == 'string') {
          return (
            <Confirm
              title={title}
              text={content}
              onAccept={() => handleAccept(callback)}
              onCancel={handleCancel}
            />
          );
        }
      default:
        return null;
    }
  }

  return null;
}
