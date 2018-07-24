import createMessageCreator from './errors';

const createMessage =
  createMessageCreator('State Manager initialization failed');

export const MISSING_DEPENDENCIES_MESSAGE =
  createMessage('missing dependencies');
export const MISSING_SERIALIZER_MESSAGE =
  createMessage('missing serializer dependency');
export const MISSING_STORAGE_MESSAGE =
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
        return Promise.resolve();
      }

      return this._serializer.deserialize(state);
    });
  }

  snapshot(state) {
    return this._serializer.serialize(state)
      .then(serializedState => this._storage.set(serializedState));
  }

  reset() {
    return this._storage.clear(this._key);
  }
}

export default StateManager;
