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

      return { [key]: value };
    });


    return Promise.all(arrayOfPromises).then((arrayOfSerializedStates) => {
        return arrayOfSerializedStates.reduce((output, partialState) => {
          return Object.assign({}, output, partialState);
        }, {});
      });
};

const combineSerializers = (serializers) => {
  const serialize = state =>
    process(state, key => serializers[key].serialize);

  const deserialize = state => {
    return process(state, key => serializers[key].deserialize);
  }

  return new Serializer(serialize, deserialize);
};

export default combineSerializers;
