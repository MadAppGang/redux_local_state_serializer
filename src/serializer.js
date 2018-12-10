class Serializer {
  constructor(serialize, deserialize) {
    this.serialize = serialize;
    this.deserialize = deserialize;
  }
}

const process = (state, getSerializer) => {
  const promises = Object.entries(state)
    .map((entry) => {
      const [key, value] = entry;
      const serialize = getSerializer(key);
      const serializedValue = serialize(value);

      if (serializedValue instanceof Promise) {
        return serializedValue.then(processedValue => ({ [key]: processedValue }));
      }

      return { [key]: serializedValue };
    });

    return Promise.all(promises).then((serializedStates) => {
      return serializedStates.reduce((output, stateFragment) => {
        return Object.assign({}, output, stateFragment);
      }, {});
    });
};

const combineSerializers = (serializers) => {
  const get = serializerUnit => (key) => {
    if (key in serializers) {
      return serializers[key][serializerUnit];
    }

    // defaults to a function that returns nothing
    // (if user doesn't want to serialize this state fragment intentionally)
    return new Function();
  };

  const serialize = state => process(state, get('serialize'))

  const deserialize = state => process(state, get('deserialize'))

  return new Serializer(serialize, deserialize);
};

export default combineSerializers;
