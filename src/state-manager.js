import createMessageCreator from './errors';

const createMessage = createMessageCreator('State Manager initialization failed');

export const MISSING_DEPENDENCIES_MESSAGE = createMessage('missing dependencies');
export const MISSING_STORAGE_MESSAGE = createMessage('missing storage dependency');
export const MISSING_SERIALIZER_MESSAGE =
  createMessage('missing serializer dependency');

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

    this.serializer = dependencies.serializer;
    this.storage = dependencies.storage
  }

  restore() {
    return this.storage.get().then((state) => {
      if (!state) {
        return Promise.resolve();
      }

      return this.serializer.deserialize(state);
    });
  }

  middleware() {
    return store => next => action => {
      this.snapshot(store.getState());
      next(action);
    };
  }

  snapshot(state) {
    return this.serializer.serialize(state).then(this.storage.set);
  }

  reset() {
    return this.storage.clear();
  }
}

export default StateManager;
