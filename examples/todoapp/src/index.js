import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import rootReducer, { serializer } from './reducers';

import App from './App';

import { StateManager, Storage } from 'redux-local-state-serializer';

const stateManager = new StateManager({
  storage: new Storage({ key: 'TODO_APP_STORAGE' }),
  serializer,
});

stateManager.restore().then((state) => {
  const store = createStore(rootReducer, state);

  store.subscribe(() => stateManager.snapshot(store.getState()));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
    , document.getElementById('root')
  );
});


