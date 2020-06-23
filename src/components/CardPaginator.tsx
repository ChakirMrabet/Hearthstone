/**
 * HearthStone Browser
 * Copyright 2020, Chakir Mrabet <hello@cmrabet.com>
 * CardPaginator Component.
 */

import * as React from 'react';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { IAppState, IPaginator } from '../types';
import { playFlipPageAudio, fetchCardsForPage } from '../actions';

interface IPaginatorButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

function NextButton({ isVisible, onClick }: IPaginatorButtonProps) {
  if (isVisible) {
    return (
      <button onClick={onClick}>
        Next <i className="fa fa-angle-right"></i>
      </button>
    );
  }
  return null;
}

function PrevButton({ isVisible, onClick }: IPaginatorButtonProps) {
  if (isVisible) {
    return (
      <button onClick={onClick}>
        <i className="fa fa-angle-left"></i> Prev
      </button>
    );
  }
  return null;
}

interface IItemsPerPageProps {
  value: number;
  totalItems: number;
  onChange: (e: React.SyntheticEvent<HTMLSelectElement>) => void;
}

function renderItemsPageOptions(totalItems: number) {
  return [5, 10, 25].map((value) => {
    if (value < totalItems) {
      return (
        <option key={value} value={value}>
          {value}
        </option>
      );
    }
  });
}
function ItemsPerPage({ value, totalItems, onChange }: IItemsPerPageProps) {
  return (
    <select value={value} onChange={onChange}>
      {renderItemsPageOptions(totalItems)}
    </select>
  );
}

function Container() {
  const [itemsPage, setItemsPage] = useState(10);
  const paginator = useSelector((state: IAppState) => state.paginator);
  const dispatch = useDispatch();

  function handleItemsPageChange(e: React.SyntheticEvent<HTMLSelectElement>) {
    const itemsPage = parseInt(e.currentTarget.value);
    playFlipPageAudio();
    setItemsPage(itemsPage);
    dispatch(fetchCardsForPage(1, itemsPage));
  }

  function handleButtonClick(page: number) {
    playFlipPageAudio();
    dispatch(fetchCardsForPage(page, itemsPage));
  }

  if (paginator) {
    const { totalPages, currentPage, totalItems } = paginator;

    if (totalPages > 1) {
      return (
        <div className="paginator">
          <ItemsPerPage
            value={itemsPage}
            totalItems={totalItems}
            onChange={(e) => handleItemsPageChange(e)}
          />
          <PrevButton
            isVisible={currentPage > 1}
            onClick={() => handleButtonClick(currentPage - 1)}
          />
          <p>
            Page {currentPage} of {totalPages}
          </p>
          <NextButton
            isVisible={currentPage < totalPages}
            onClick={() => handleButtonClick(currentPage + 1)}
          />
        </div>
      );
    }
  }
  return null;
}

export default Container;
