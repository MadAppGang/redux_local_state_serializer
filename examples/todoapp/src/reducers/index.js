import { combineReducers } from 'redux';
import { combineSerializers } from 'redux-local-state-serializer';
import todos, { serializer as todosSerializer } from './todo';

export default combineReducers({ todos });

export const serializer = combineSerializers({
  todos: todosSerializer,
});
