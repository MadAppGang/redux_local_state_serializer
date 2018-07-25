class Serializer {
  constructor(serialize, deserialize) {
    this.serialize = serialize;
    this.deserialize = deserialize;
  }
}

const process = (state, getSerializer) => {
  const arrayOfPromises = Object.entries(state)
    .map((entry) => {
      const [key, value] = entry;
      const serialize = getSerializer(key);
      const serializedValue = serialize(value);
      if (serializedValue instanceof Promise) {
        return serializedValue.then(processedValue => ({ [key]: processedValue }));
      }

      return { [key]: serializedValue };
    });

    return Promise.all(arrayOfPromises).then((arrayOfSerializedStates) => {
        return arrayOfSerializedStates.reduce((output, partialState) => {
          return Object.assign({}, output, partialState);
        }, {});
      });
};

const combineSerializers = (serializers) => {
  const get = serializerUnit => (key) => {
    if (key in serializers) {
      return serializers[key][serializerUnit];
    }

    // defaults to a function that returns nothing
    // (consider that user did not want to serialize this piece of state purposefuly)
    return new Function();
  };

  const serialize = state => process(state, get('serialize'))

  const deserialize = state => process(state, get('deserialize'))

  return new Serializer(serialize, deserialize);
};

export default combineSerializers;
