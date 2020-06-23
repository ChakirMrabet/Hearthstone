/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Application entry component.
 */

import * as React from 'react';
import { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState } from '../types';

import { initApp } from '../actions';

import ModalBox from './Modal';
import FiltersPanel from './FiltersPanel';
import CardBrowser from './CardBrowser';
import CardInfo from './CardInfo';
import Deck from './Deck';

import config from '../data/config';

function Loading() {
  return <ModalBox />;
}

function App() {
  return (
    <Fragment>
      <FiltersPanel />
      <CardBrowser />
      <div id="info-panel">
        <CardInfo />
        <Deck />
      </div>
      <ModalBox />
    </Fragment>
  );
}

function Container() {
  const filters = useSelector((state: IAppState) => state.filters);
  const dispatch = useDispatch();

  document.title = `${config.appName} v${config.version}`;

  useEffect(() => {
    dispatch(initApp());
  }, []);

  if (filters) {
    return <App />;
  }
  return <Loading />;
}

export default Container;
