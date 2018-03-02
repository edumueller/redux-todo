import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, combineReducers } from 'redux';
import './index.css';
import expect from 'expect';
var deepFreeze = require('deep-freeze');

const todo = (state, action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return {
				id: action.id,
				text: action.text,
				completed: false
			};
		case 'TOGGLE_TODO':
			if (state.id !== action.id) {
				return state;
			}
			return {
				...state,
				completed: !state.completed
			};
	}
};

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [...state, todo(undefined, action)];
		case 'TOGGLE_TODO':
			return state.map(t => todo(t, action));
		default:
			return state;
	}
	return;
};

const visibilityFilter = (state = 'SHOW_ALL', action) => {
	switch (action.type) {
		case 'SET_VISIBILITY_FILTER':
			return action.filter;
		default:
			return state;
	}
};

const todoApp = combineReducers({
	todos,
	visibilityFilter
});

const testAddTodo = () => {
	const stateBefore = [];
	const action = {
		id: 0,
		type: 'ADD_TODO',
		text: 'Learn Redux'
	};
	const stateAfter = [
		{
			id: 0,
			text: 'Learn Redux',
			completed: false
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(todos(stateBefore, action)).toEqual(stateAfter);
};

const testToggleTodo = () => {
	const stateBefore = [
		{
			id: 0,
			text: 'Learn Redux',
			completed: false
		},
		{
			id: 1,
			text: 'Go shopping',
			completed: false
		}
	];
	const action = {
		id: 1,
		type: 'TOGGLE_TODO'
	};
	const stateAfter = [
		{
			id: 0,
			text: 'Learn Redux',
			completed: false
		},
		{
			id: 1,
			text: 'Go shopping',
			completed: true
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(todos(stateBefore, action)).toEqual(stateAfter);
};

const store = createStore(todoApp);

const { Component } = React;

const FilterLink = ({ filter, children }) => {
	return (
		<a
			href="#"
			onClick={e => {
				e.preventDefault();
				store.dispatch({
					type: 'SET_VISIBILITY_FILTER',
					filter
				});
			}}
		>
			{children}
		</a>
	);
};

const getVisibleTodos = (todos, filter) => {
	switch (filter) {
		case 'SHOW_COMPLETED':
			return todos.filter(t => t.completed);
		case 'SHOW_ACTIVE':
			return todos.filter(t => !t.completed);
		default:
			return todos;
	}
};

let nextTodoId = 0;
class TodoApp extends Component {
	render() {
		const visibleTodos = getVisibleTodos(
			this.props.todos,
			this.props.visibilityFilter
		);
		return (
			<div>
				<input
					ref={node => {
						this.input = node;
					}}
				/>
				<button
					onClick={() => {
						store.dispatch({
							type: 'ADD_TODO',
							text: this.input.value,
							id: nextTodoId++
						});
						this.input.value = '';
					}}
				>
					Add Todo
				</button>
				<ul>
					{visibleTodos.map(todo => (
						<li
							key={todo.id}
							onClick={() => {
								store.dispatch({
									type: 'TOGGLE_TODO',
									id: todo.id
								});
							}}
							style={{
								textDecoration: todo.completed ? 'line-through' : 'none'
							}}
						>
							{todo.text}
						</li>
					))}
				</ul>
				<p>
					Show: <FilterLink filter="SHOW_ALL">All</FilterLink>
					<FilterLink filter="SHOW_ACTIVE">Active</FilterLink>
					<FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
				</p>
			</div>
		);
	}
}

const render = () => {
	ReactDOM.render(
		<TodoApp {...store.getState()} />,
		document.getElementById('root')
	);
};

store.subscribe(render);
render();

console.log('Initial State:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching ADD_TODO.');
store.dispatch({
	type: 'ADD_TODO',
	id: 0,
	text: 'Learn Redux'
});
nextTodoId++;
console.log('Current State:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching TOGGLE_TODO.');
store.dispatch({
	type: 'TOGGLE_TODO',
	id: 0
});

console.log('Current State:');
console.log(store.getState());
console.log('--------------');

console.log('Dispatching SET_VISIBILITY_FILTER');
store.dispatch({
	type: 'SET_VISIBILITY_FILTER',
	filter: 'SHOW_ALL'
});

console.log('Current State:');
console.log(store.getState());
console.log('--------------');

testAddTodo();
testToggleTodo();
console.log('All tests passed.');
