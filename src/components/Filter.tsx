/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * Filter Component.
 */

import * as React from 'react';
import { SelectChangeEvent } from '../types';
import { capitalize } from '../utils/strings';

interface IProps {
  name: string;
  options: string[];
  value: string | null;
  onChange: SelectChangeEvent;
}

function renderOptions(options: string[]) {
  return options.map((option) => (
    <option key={option} value={option}>
      {option}
    </option>
  ));
}

function Filter({ name, value, options, onChange }: IProps) {
  if (options.length) {
    return (
      <div className="form-control">
        <label htmlFor={name}>
          {capitalize(name)} ({options.length})
        </label>
        <select id={name} value={value || 'all'} onChange={onChange}>
          <option value="">Pick one..</option>
          {renderOptions(options)}
        </select>
      </div>
    );
  }
  return null;
}

export default Filter;
