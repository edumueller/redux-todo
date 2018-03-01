import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './index.css';
import expect, { createSpy, spyOn, isSpy } from 'expect';
var deepFreeze = require('deep-freeze');

const todos = (state = [], action) => {
	switch (action.type) {
		case 'ADD_TODO':
			return [...state, { id: action.id, text: action.text, completed: false }];
		case 'TOGGLE_TODO':
			return state.map(todo => {
				if (todo.id !== action.id) {
					return todo;
				}
				return {
					...todo,
					completed: !todo.completed
				};
			});
		default:
			return state;
	}
	return;
};

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

testAddTodo();
testToggleTodo();
console.log('All tests passed.');
