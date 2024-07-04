import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import ChatPage from './pages/ChatPage/ChatPage';

function App() {
    return (
        <>
            <div className="App">
                <Routes>
                    <Route path="/" Component={HomePage} />
                    <Route path="/chat" Component={ChatPage} />
                    <Route path="/home" Component={ChatPage} />
                </Routes>
            </div>
        </>
    );
}

export default App;
