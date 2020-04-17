import React from 'react';

import './assets/style/style.scss';

import * as serviceWorker from './serviceWorker';

import store from './redux/store';
import { Provider } from 'react-redux';

import './App.css';
import Audio from './components/Audio';

function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <Audio />
      </div>
    </Provider>
  );
}

export default App;
