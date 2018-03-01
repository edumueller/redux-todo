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
			completed: false,
			text: 'Learn Redux'
		}
	];

	deepFreeze(stateBefore);
	deepFreeze(action);

	expect(todos(stateBefore, action)).toEqual(stateAfter);
};

testAddTodo();
console.log('All tests passed.');
