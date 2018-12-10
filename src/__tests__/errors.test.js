import createMessageCreator from '../errors';

test('should return a function', () => {
  const output = createMessageCreator();

  expect(output).toBeInstanceOf(Function);
});

test('returned result should concat prefix with message', () => {
  const [prefix, message] = ['prefix', 'message'];
  const createMessage = createMessageCreator(prefix);
  const output = createMessage(message);

  expect(output).toEqual(`${prefix}: ${message}`);
});
