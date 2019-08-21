import React, { Component } from 'react';
import { Provider } from 'react-redux';
import createStore from './store/createStore';
import { BrowserRouter } from 'react-router-dom';
import Main from './components/MainComponent';
import './App.css';

const store = createStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div>
            <Main />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
