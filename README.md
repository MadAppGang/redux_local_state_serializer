## Redux local state serializer
[![Build Status](https://travis-ci.org/MadAppGang/redux_local_state_serializer.svg?branch=master)](https://travis-ci.org/MadAppGang/redux_local_state_serializer)
[![Coverage Status](https://coveralls.io/repos/github/MadAppGang/redux_local_state_serializer/badge.svg?branch=master)](https://coveralls.io/github/MadAppGang/redux_local_state_serializer?branch=master)

Provides a set of tools to keep your redux state persistent locally. The concept is to restore serialized state from the storage on application initialization, and then continuously take snapshots each time the state gets changed.

This package uses a storage build ontop of [localForage](https://github.com/localForage/localForage "localForage") as a default, but you are free to implement a storage based on something else.

## Installation

```bash
npm install --save @madappgang/redux-state-serializer
```

## Example

First off, import the state manager and its dependencies using es6 imports
```javascript
import { StateManager, Storage } from '@madappgang/redux-state-serializer';
```

In this case Storage is a default implementation of a local storage that encapsulates [localForage](https://github.com/localForage/localForage "localForage") inside of it. We recommend to use this implementation because it provides a cross-browser storage solution (IndexedDB, WebSQL, localStorage). However, you can as well provide your own storage.

In order to proceed we need to initialize our state manager. State manager holds necessary API methods to provide serialization. Each piece of the state gets through the serialization function before it gets saved. The package can't decide how your data has to be serialized, so you should provide a serializer instance.

### Serializer

Serializer is an object that knows how to **serialize** and **deserialize** your state.
The goal is to provide a serializer for each node of you state, and then combine them all into one root serializer using `combineSerializers` function shipped with the package.

The idea is to export serializers along with reducers, as these components are very close to each other.

Here is an example of such reducer:

```javascript
export default (state = INITIAL_STATE, action) => { ... };

export const serializer = {
  serialize: state => state, // describe serializing logic here
  deserialize: state => state, // describe deserializing logic here
};
```

If your serialization requires async operations, serialize/deserialize functions can as well return a promise

```javascript
...
export const serializer = {
  serialize: state => Promise.resolve(state),
  deserialize: state => state,
};
```

As you can see, the file that exports a reducer, also exports a serializer. In this case the serializer does not alter the state, but sometimes you need to apply a custom logic to prepare your data before saving.

**Note:** each serializer provided along with reducer implements a serialization logic for only piece of state produced by the reducer, and not the global state.

Even if you don't need to process your data before serialization, you have to explicitly define the serializer.

But if you don't want to serialize some piece of state just don’t provide the serializer and it won't get to the storage.

When you have your serializers, you simply combine them into one alike reducers, using `combineSerializers`.

```javascript
// reducers/index.js

...
import { combineSerializers } from '@madappgang/redux-state-serializer';
import todos, { serializer as todosSerializer } from './todo';

export default combineReducers({ todos });

export const serializer = combineSerializers({
  todos: todosSerializer,
});
```

**Note:** `todos` is the same for reducers and serializers. For serializer this key means what piece of state it is in charge of.

```javascript
// src/index.js

import rootReducer, { serializer } from './reducers';
```

At this point you have everyting you need to initialize state manager.

### State manager

```javascript
const stateManager = new StateManager({
  storage: new Storage({ key: 'TODO_APP_STORAGE' }),
  serializer,
});
```

`key` is an identifier of the storage. You can have multiple storage instances for the domain, so you need to identify them all.

As you know redux's `createStore` method allows [to pass a preloaded state](https://redux.js.org/api-reference/createstore#arguments "to pass a preloaded state") as a second argument, so you need to have this state before creating the store. In order to do that call a special method of the `StateManager`:

```javascript
stateManager.restore().then((state) => {
  const middleware = applyMiddleware(stateManager.middleware());
  const store = createStore(rootReducer, state, middleware);
  ...
});
```

You get a state, that is a result of the last serialization. If this is the very first time you run the app, state will be `undefined`. Each time the store changes state manager will take a snapshot and save it to the storage.

**Take a look at a working example in the `/examples` folder**.

## API

### Storage
Accepts a key as an argument. The key is used to identify the data entry.

| Property | Type | Description
| --- | --- | --- |
| get | function | Takes no arguments. Retrieves the data from storage by the key |
| set | function | Takes data as a first argument. Sets the data to the storage by key |
| clear | function | Takes no arguments. Cleans up the storage for the key |

### Serializer

| Property | Type | Description
| --- | --- | --- |
| serialize | function | Takes state as an argument. Used to serialize the state |
| deserialize | function | Takes serialized state as an argument. Used to deserialize the state |

### State Manager
Accepts storage, and serializer as dependencies

| Property | Type | Description
| --- | --- | --- |
| restore | function | Takes no arguments. Used to retrieve an earlier serialized state |
| middleware | functin | Returns a redux middleware for taking snapshots on every state update.
| snapshot | function | Takes state as an argument. Used to serialize a state |
| reset | function | Takes no arguments. Used to reset the store |

## License
MIT
