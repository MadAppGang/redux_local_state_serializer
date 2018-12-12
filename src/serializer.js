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
  const get = method => (key) => {
    if (key in serializers) {
      return serializers[key][method];
    }

    // defaults to a function that returns nothing
    // (if user doesn't want to serialize this state fragment intentionally)
    return new Function();
  };

  return Object.freeze({
    serialize: state => process(state, get('serialize')),
    deserialize: state => process(state, get('deserialize')),
  });
};

export default combineSerializers;
