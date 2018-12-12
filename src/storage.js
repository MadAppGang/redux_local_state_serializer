import localForage from 'localforage';
import createMessageCreator from './errors';

const createMessage = createMessageCreator('Storage initialization failed');

export const MISSING_CONFIG_MESSAGE = createMessage('missing config');
export const MISSING_KEY_MESSAGE = createMessage('missing storage key');

function Storage(config) {
  if (!config) {
    throw new Error(MISSING_CONFIG_MESSAGE);
  }

  if (!config.key) {
    throw new Error(MISSING_KEY_MESSAGE);
  }

  const get = () => localForage.getItem(config.key);

  const set = data => localForage.setItem(config.key, data);

  const clear = () => localForage.removeItem(config.key);

  return Object.freeze({
    get, set, clear,
  });
};

export default Storage;
