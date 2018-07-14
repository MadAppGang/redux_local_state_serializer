import { StateManager, Storage, combineSerializers } from '../src';

import {
  MISSING_DEPENDENCIES_MESSAGE,
  MISSING_SERIALIZER_MESSAGE,
  MISSING_STORAGE_MESSAGE,
} from '../src/state-manager';

describe('initializing with dependencies', () => {
  const storage = new Storage({ key: 'key' });
  const serializer = combineSerializers({
    a: {
      serialize() {},
      deserialize() {}
    }
  });

  test('initializing without errors', () => {
    const output = new StateManager({ serializer, storage });

    expect(output).toBeInstanceOf(Object);
  });

  test('throws missing dependencies exception', () => {
    try {
      new StateManager();
    } catch (error) {
      expect(error.message).toBe(MISSING_DEPENDENCIES_MESSAGE);
    }
  });
  
  test('throws missing serializer dependency exception', () => {
    try {
      new StateManager({ storage });
    } catch (error) {
      expect(error.message).toBe(MISSING_SERIALIZER_MESSAGE);
    }
  });

  test('throws missing storage dependency exception', () => {
    try {
      new StateManager({ serializer });
    } catch (error) {
      expect(error.message).toBe(MISSING_STORAGE_MESSAGE);
    }
  });
});

describe('containing necessary API methods', () => {
  const instance = new StateManager({ storage: {}, serializer: {} });

  test('contains "restore"', () => expect(instance).toHaveProperty('restore'));
  test('contains "snapshot"', () => expect(instance).toHaveProperty('snapshot'));
  test('contains "reset"', () => expect(instance).toHaveProperty('reset'));

  test('"restore" is a func', () => expect(instance.restore).toBeInstanceOf(Function));
  test('"snapshot" is a func', () => expect(instance.snapshot).toBeInstanceOf(Function));
  test('"reset" is a func', () => expect(instance.reset).toBeInstanceOf(Function));
});
