## Redux local state serializer

Designed to provide state preserving between sessions for redux applications.
This package uses a storage build ontop of [localForage](https://github.com/localForage/localForage "localForage") as a default, but you are free to implement a storage based on something alse.

The whole concept is to restore serialized state from the storage on application initialization, and then continuously take snapshots each time the state gets changed.

## Installation

```bash
npm install redux-local-state-serializer --save
```

## Usage

First off, import the state manager and its dependencies using es6 imports
```javascript
import { StateManager, Storage } from 'redux-local-state-serializer';
```
or using commonJS syntax
```javascript
const localSerializer = require('redux-local-state-serializer');
const { StateManager, Storage }  = localSerializer;
```
In this case Storage is a default implementation of a local storage that incapsulates [localForage](https://github.com/localForage/localForage "localForage") inside of it. We recommend to use this implementation because it provides a local storage (IndexedDB, WebSQL, localStorage) for a wide range of browsers. However you can provide your own implementation of a storage based on our Storage API.

In order to proceed we need to initialize our state manager. State manager hold the necessary API methods to provide serialization. Each piece of the state gets through the serialization process before saving into the store. The package can't decide how your data has to be saved, so you should provide a serializer.

Serializer is an object that knows how to **serialize** and **deserialize** your state.
The goal is to provider such serializer for each node of you state, and then combine them all into a one root serializer using `combineSerializers` function shipped with the package.

The idea is to export serializers along with reducers, as these components are very close to each other.

Here is an example of such reducer, storing todos:

```javascript
export default (state = INITIAL_STATE, action) => { ... };

export const serializer = {
  serialize: state => state,
  deserialize: state => state,
};
```

As you can see, the file that exports a reducer, also exports a serializer. In this case the serializer does not alter the state, but sometimes you need a custom logic to prepare your data before saving.

**Note:** each serializer provided along with reducer implements a serialization logic for only piece of state produced by the reducer, and not the global state.

Even if you don't need to process your data before serialization, you have to explicitly define the serializer.

When you have your serializers, you simply combine them into one alike reducers, using `combineSerializers`. We recommend to do it in `reducers/index.js`.

```javascript
...
import { combineSerializers } from 'redux-local-state-serializer';
import todos, { serializer as todosSerializer } from './todo';

export default combineReducers({ todos });

export const serializer = combineSerializers({
  todos: todosSerializer,
});
```

**Note:** `todos` is the same for reducers and serializers. It has always be this way. For serializer this key means what piece of state it is in charge of.

You then simply import reducer along with serializer to the index file:

```javascript
import rootReducer, { serializer } from './reducers';
```

Now we have everyting we needed to initialize state manager

```javascript
const stateManager = new StateManager({
  storage: new Storage({ key: 'TODO_APP_STORAGE' }),
  serializer,
});
```

`key` is an identifier of the storage. You can have multiple storage instances for the domain, so you need to identify them all.

As we know redux's `createStore` method allows [to pass a preloaded state](https://redux.js.org/api-reference/createstore#arguments "to pass a preloaded state") as a second argument, so we need to have this state before we create the store. In order to do that we call a special method of the `StateManager`:

```javascript
stateManager.restore().then((state) => {
  const store = createStore(rootReducer, state);
  ...
});
```

You get a state, that is a result of the last serialization. If this is the very first time you run the app, state will be `undefined`.

The last thing we got to do is to subscribe to store changes.

```javascript
  store.subscribe(() => stateManager.snapshot(store.getState()));
```

state manager will take a snapshot each time the store changes, so the user will always have an actual state stored locally.

**Take a look at a working example in the `/examples` folder**.

So that's it.
Happy serialization!

## Entities
### Storage
accepts a key as an argument. The key is used to identify the data entry.
- *get* | void | Retrieves the data from storage by the key;
- *set* | data Any? | Sets the passed data to the storage for the key;
- *clear* | void | Cleans up the storage for the key;

### Serializer
- *serialize* | state | Used to serialize the state
- *deserialize* | state | Used to deserialize the state

### State Manager
accepts storage, and serializer as dependencies
- *restore* | void | Used to retrieve an earlier serialized state;
- *snapshot* | state | Used to serialize a state;
- *reset* | void | Used to reset the store;
