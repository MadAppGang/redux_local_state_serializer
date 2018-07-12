import createMessageCreator from './errors';

const createMessage =
  createMessageCreator('State Manager initialization failed');

const MISSING_DEPENDENCIES_MESSAGE = createMessage('missing dependencies');
const MISSING_SERIALIZER_MESSAGE =
  createMessage('missing serializer dependency');
const MISSING_STORAGE_MESSAGE =
  createMessage('missing storage dependency');

class StateManager {
  constructor(dependencies) {
    if (!dependencies) {
      throw new Error(MISSING_DEPENDENCIES_MESSAGE);
    }

    if (!dependencies.serializer) {
      throw new Error(MISSING_SERIALIZER_MESSAGE);
    }

    if (!dependencies.storage) {
      throw new Error(MISSING_STORAGE_MESSAGE);
    }

    this._serializer = dependencies.serializer;
    this._storage = dependencies.storage
  }

  restore() {
    return this._storage.get().then((state) => {
      if (!state) {
        return undefined;
      }

      return this._serializer.deserialize(state);
    });
  }

  snapshot(state) {
    const serializedState = this._serializer.serialize(state);

    return this._storage.set(serializedState);
  }

  reset() {
    return this._storage.clear(this._key);
  }
}

export default StateManager;
