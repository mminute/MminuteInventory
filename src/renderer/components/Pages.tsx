import React from 'react';
import { Routes, useLocation } from 'react-router-dom';
import { CollapsedSidebarRoutes } from '../../consts/routePaths';
import './Pages.css';

const leftMargins = {
  default: 201,
  min: 10,
};

interface Props {
  children: Array<React.ReactElement>;
}

function Pages({ children }: Props) {
  const { pathname } = useLocation();

  const left = CollapsedSidebarRoutes.includes(pathname)
    ? leftMargins.min
    : leftMargins.default;

  return (
    <div className="pagesMain" style={{ marginLeft: `${left}px` }}>
      <Routes>{children}</Routes>
    </div>
  );
}

export default Pages;
