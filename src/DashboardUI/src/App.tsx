import React from 'react';
import { Route, Link, Routes,  Outlet } from "react-router-dom";
import './App.scss';
import TodoPage from './pages/TodoPage';
import HomePage from './pages/HomePage';
import Layout from './pages/Layout';

function App() {
  return (
    <div>     
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="todos" element={<TodoPage />} />          
        </Route>
      </Routes>
    </div>
  );
}

export default App;
