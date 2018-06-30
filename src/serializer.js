class Serializer {
  constructor(serialize, deserialize) {
    this.serialize = serialize;
    this.deserialize = deserialize;
  }
}

const process = (state, getSerializer) => {
  return Object.entries(state)
    .map((entry) => {
      const [key, value] = entry;

      const serialize = getSerializer(key);

      return { key, value: serialize(value) };
    })
    .reduce((output, { key, value }) => {
      return Object.assign({}, output, { [key]: value });
    }, {});
};

exports.combineSerializers = (serializers) => {
  const serialize = state =>
    process(state, key => serializers[key].serialize);

  const deserialize = state =>
    process(state, key => serializers[key].deserialize);

  return new Serializer(serialize, deserialize);
};
