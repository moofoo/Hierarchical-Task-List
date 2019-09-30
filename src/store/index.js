import { combineReducers, createStore, applyMiddleware } from 'redux';
import {
  hierarchy,
  hierarchyMiddleware,
  bindNodes,
  createNodeDataSelector,
  createOrderedNodeDataSelector
} from './hierarchy';
import tasksReducer from './tasks';
import {
  ADD_TASK,
  REMOVE_TASK,
  UPDATE_TASK,
  CLEAR_TASKS
} from './tasks/actionTypes';

import thunk from 'redux-thunk';

const store = createStore(
  combineReducers({ hierarchy, tasks: tasksReducer }),
  applyMiddleware(hierarchyMiddleware, thunk)
);

bindNodes(store, 'tasks', ADD_TASK, UPDATE_TASK, REMOVE_TASK, CLEAR_TASKS);

window.store = store;

export const nodeDataSelector = createNodeDataSelector('tasks');
export const orderedNodeDataSelector = createOrderedNodeDataSelector('tasks');

export default store;
