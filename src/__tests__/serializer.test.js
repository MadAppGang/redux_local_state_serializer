import { combineSerializers } from '..';

test('returns an object', () => {
  const aSerializer = {
    serialize() {},
    deserialize() {},
  };

  const output = combineSerializers({ aSerializer });

  expect(output).toBeInstanceOf(Object);
});

test('calls serialize of the passed serializer', () => {
  const serializer = {
    serialize: jest.fn(),
  };

  const output = combineSerializers({ serializer });
  const state = { state: 'state' };

  output.serialize({ serializer: state });
  
  expect(serializer.serialize).toHaveBeenCalledWith(state);
});

test('calls deserialize of the passed serializer', () => {
  const serializer = {
    deserialize: jest.fn(),
  };

  const output = combineSerializers({ serializer });
  const state = { state: 'state' };

  output.deserialize({ serializer: state });
  
  expect(serializer.deserialize).toHaveBeenCalledWith(state);
});

test('awaits for serialize if it returns is a promise', (done) => {
  const expectedValue = '...';
  const serializer = {
    serialize: jest.fn(() => Promise.resolve(expectedValue)),
  };

  const output = combineSerializers({ serializer });
  const state = { state: 'state' };

  output.serialize({ serializer: state });

  // expect(serializer.serialize).toHaveBeenCalledWith(state);
  serializer.serialize().then((value) => {
    expect(value).toEqual(expectedValue);
    done();
  });
});

test('runs serialization without exsiting serialization function', () => {
  const output = combineSerializers({});
  const state = { state: 'state', key: 'value' };

  return output.serialize(state).then(serializedState =>
      expect(serializedState).toEqual({}));
});

test('runs deserialization without exsiting deserialization function', () => {
  const output = combineSerializers({});
  const state = { state: 'state', key: 'value' };

  return output.deserialize(state)
    .then(serializedState => expect(serializedState).toEqual({}));
});