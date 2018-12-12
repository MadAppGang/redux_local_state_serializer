import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import { StateManager, Storage } from 'redux-local-state-serializer';
import rootReducer, { serializer } from './reducers';
import App from './App';

const stateManager = StateManager({
  storage: Storage({ key: 'TODO_APP_STORAGE' }),
  serializer,
});

stateManager.restore().then((state) => {
  const middleware = applyMiddleware(stateManager.middleware());
  const store = createStore(rootReducer, state, middleware);

  // store.subscribe(() => stateManager.snapshot(store.getState()));

  ReactDOM.render(
    <Provider store={store}>
      <App />
    </Provider>
    , document.getElementById('root')
  );
});


