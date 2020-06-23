/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * FiltersPanel Component.
 */

import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState, IFilters, ISelectedFilters, SelectChangeEvent } from '../types';
import { playClickAudio, showModal, fetchCards, reset } from '../actions';
import Filter from './Filter';
import logo from 'assets/img/logo.png';
import config from '../data/config';

interface IProps {
  filters: IFilters | null;
  selected: ISelectedFilters | null;
  onChange: SelectChangeEvent;
  onReset: () => void;
}

function renderFilters(
  filters: IFilters,
  selected: ISelectedFilters | null,
  onChange: SelectChangeEvent
) {
  return Object.keys(filters).map((key) => {
    const value = selected && selected[key] ? selected[key] : '';
    return <Filter key={key} name={key} options={filters[key]} value={value} onChange={onChange} />;
  });
}

function FilterPanel({ filters, selected, onChange, onReset }: IProps) {
  return (
    <div id="filters-panel">
      <div className="filters">
        <img className="logo" src={logo} />
        <div>
          <h2>Card Filters</h2>
          {filters && renderFilters(filters, selected, onChange)}
          {selected && (
            <button onClick={onReset}>
              Reset <i className="fa fa-times"></i>
            </button>
          )}
        </div>
      </div>
      <div className="copyright">
        <p>
          {config.appName} v{config.version}
        </p>
        <p>
          &copy;2020 <a href="mailto:hello@cmrabet.com">Chakir Mrabet</a>
        </p>
      </div>
    </div>
  );
}

function Container() {
  const filters = useSelector((state: IAppState) => state.filters);
  const selectedValues = useSelector((state: IAppState) => state.selectedFilters);
  const dispatch = useDispatch();

  function handleOnChange(e: React.SyntheticEvent<HTMLSelectElement>) {
    const { id, value } = e.currentTarget;
    playClickAudio();
    dispatch(fetchCards(id, value));
  }

  function handleReset() {
    dispatch(
      showModal(
        'confirm',
        'Are you sure that you want reset all the filters and the loaded cards?',
        () => {
          dispatch(reset());
        }
      )
    );
  }

  return (
    <FilterPanel
      filters={filters}
      selected={selectedValues}
      onChange={handleOnChange}
      onReset={handleReset}
    />
  );
}

export default Container;
