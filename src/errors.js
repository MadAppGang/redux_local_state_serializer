const createMessageCreator = prefix => message => `${prefix}: ${message}`;

export default createMessageCreator;
