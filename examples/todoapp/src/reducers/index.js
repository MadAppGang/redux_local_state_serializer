import { combineReducers } from 'redux';
import { combineSerializers } from 'redux-local-state-serializer';
import todos, { serializer as todosSerializer } from './todo';

console.log(combineSerializers);

export default combineReducers({ todos });

export const serializer = combineSerializers({
  todos: todosSerializer,
});
