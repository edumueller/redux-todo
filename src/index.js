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

const Link = ({ active, children, onClick }) => {
	if (active) {
		return <span>{children}</span>;
	}
	return (
		<a
			href="#"
			onClick={e => {
				e.preventDefault();
				onClick();
			}}
		>
			{children}
		</a>
	);
};

class FilterLink extends Component {
	componentDidMount() {
		this.unsubscribe = store.subscribe(() => this.forceUpdate());
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		const props = this.props;
		const state = store.getState();

		return (
			<Link
				active={props.filter === state.visibilityFilter}
				onClick={() =>
					store.dispatch({
						type: 'SET_VISIBILITY_FILTER',
						filter: props.filter
					})
				}
			>
				{props.children}
			</Link>
		);
	}
}

const Footer = () => (
	<p>
		Show: <FilterLink filter="SHOW_ALL">All</FilterLink>,{' '}
		<FilterLink filter="SHOW_ACTIVE">Active</FilterLink>,{' '}
		<FilterLink filter="SHOW_COMPLETED">Completed</FilterLink>
	</p>
);

const Todo = ({ onClick, completed, text }) => (
	<li
		onClick={onClick}
		style={{
			textDecoration: completed ? 'line-through' : 'none'
		}}
	>
		{text}
	</li>
);

const TodoList = ({ todos, onTodoClick }) => (
	<ul>
		{todos.map(todo => (
			<Todo key={todo.id} {...todo} onClick={() => onTodoClick(todo.id)} />
		))}
	</ul>
);

const AddTodo = ({ onAddClick }) => {
	let input;
	return (
		<div>
			<input
				ref={node => {
					input = node;
				}}
			/>
			<button
				onClick={() => {
					onAddClick(input.value);
					input.value = '';
				}}
			>
				Add Todo
			</button>
		</div>
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
const TodoApp = ({ todos, visibilityFilter }) => (
	<div>
		<AddTodo
			onAddClick={text =>
				store.dispatch({
					type: 'ADD_TODO',
					id: nextTodoId++,
					text
				})
			}
		/>
		<TodoList
			todos={getVisibleTodos(todos, visibilityFilter)}
			onTodoClick={id =>
				store.dispatch({
					type: 'TOGGLE_TODO',
					id
				})
			}
		/>
		<Footer />
	</div>
);

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
