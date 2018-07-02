import { CREATE_TODO } from '../actions';

const INITIAL_STATE = {
  list: [],
};

export default (state = INITIAL_STATE, action) => {
  const { type, payload } = action;

  switch (type) {
    case CREATE_TODO:
      return {
        ...state,
        list: state.list.concat(payload),
      };
    default:
      return state;
  }
};

export const serializer = {
  serialize: state => state,
  deserialize: state => state,
};
