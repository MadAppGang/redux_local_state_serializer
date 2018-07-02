export const CREATE_TODO = 'CREATE_TODO';

export const createTodo = (text) => ({
  type: CREATE_TODO,
  payload: { id: Date.now(), text },
});
