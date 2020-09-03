import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import Join from './Components/Join/Join';
import Chat from './Components/Chat/Chat';

export default function App() {
  return (
    <Router>
    <Route path="/" exact component={Join} />
    <Route path = "/chat" component={Chat} />
  </Router>
  )
}