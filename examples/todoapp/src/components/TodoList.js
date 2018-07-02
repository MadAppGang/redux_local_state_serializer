import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createTodo } from '../actions';

class TodoList extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
    };
  }

  renderTodo(todo) {
    return (
      <li key={todo.id}>
        {todo.text}
      </li>
    );
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleKeyDown(event) {
    if (event.keyCode === 13) {
      this.props.createTodo(this.state.value);
    }
  }

  render() {
    const todos = this.props.todos.map(this.renderTodo);

    return (
      <div>
        <ul>
          {todos}
        </ul>
        <input
          type="text"
          value={this.state.value}
          onChange={e => this.handleChange(e)}
          placeholder="Add a todo"
          onKeyDown={e => this.handleKeyDown(e)}
        />
      </div>
    );
  }
}

TodoList.defaultProps = {
  todos: [],
};

const mapStateToProps = state => ({
  todos: state.todos.list,
});

export default connect(mapStateToProps, { createTodo })(TodoList);
