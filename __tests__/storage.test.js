import Storage, {
  MISSING_KEY_MESSAGE, MISSING_CONFIG_MESSAGE,
} from '../src/storage';

test('should initialize with no errors', () => {
  const storage = new Storage({ key: 'key' });
  
  expect(storage).toBeInstanceOf(Object);
});

test('should throw an error if no config provided', () => {
  try {
    new Storage();
  } catch (error) {
    expect(error.message).toBe(MISSING_CONFIG_MESSAGE);
  }
});

test('should throw an error if no key provided', () => {
  try {
    new Storage({});
  } catch (error) {
    expect(error.message).toBe(MISSING_KEY_MESSAGE);
  }
});

describe('containing API methods', () => {
  const storage = new Storage({ key: 'key' });

  test('contains "get"', () => expect(storage).toHaveProperty('get'));
  test('contains "set"', () => expect(storage).toHaveProperty('set'));
  test('contains "clear"', () => expect(storage).toHaveProperty('clear'));

  test('"get" is a func', () => expect(storage.get).toBeInstanceOf(Function));
  test('"set" is a func', () => expect(storage.set).toBeInstanceOf(Function));
  test('"clear" is a func', () => expect(storage.clear).toBeInstanceOf(Function));
});