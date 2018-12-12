import createMessageCreator from './errors';

const createMessage = createMessageCreator('State Manager initialization failed');

export const MISSING_DEPENDENCIES_MESSAGE = createMessage('missing dependencies');
export const MISSING_STORAGE_MESSAGE = createMessage('missing storage dependency');
export const MISSING_SERIALIZER_MESSAGE =
  createMessage('missing serializer dependency');

function StateManager(dependencies) {
  if (!dependencies) {
    throw new Error(MISSING_DEPENDENCIES_MESSAGE);
  }

  if (!dependencies.serializer) {
    throw new Error(MISSING_SERIALIZER_MESSAGE);
  }

  if (!dependencies.storage) {
    throw new Error(MISSING_STORAGE_MESSAGE);
  }

  const { serializer, storage } = dependencies;

  const restore = () => {
    return storage.get().then((state) => {
      if (!state) {
        return Promise.resolve();
      }

      return serializer.deserialize(state);
    });
  };

  const snapshot = state => serializer.serialize(state).then(storage.set);
  
  const middleware = () => store => next => action => {
    const output = next(action);
    snapshot(store.getState());

    return output;
  };

  const reset = () => storage.clear();

  return Object.freeze({
    restore, middleware, reset, snapshot,
  });
}

export default StateManager;
