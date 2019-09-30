import _ from 'lodash';
import nodes from './nodes';
import {
  CREATE_NODE_PATH,
  CLEAR_NODES,
  CREATE_NODE,
  DELETE_NODE,
  UPDATE_NODE,
  MOVE_NODE,
  INDENT_NODE,
  MOVE_NODE_UP,
  UNINDENT_NODE,
  MOVE_NODE_DOWN
} from './types';
import { getPathPayloadAction } from './helpers';

export default (state = {}, action) => {
  const { path, type } = action;

  if (
    state &&
    path &&
    [
      CREATE_NODE_PATH,
      CLEAR_NODES,
      CREATE_NODE,
      DELETE_NODE,
      UPDATE_NODE,
      MOVE_NODE,
      INDENT_NODE,
      MOVE_NODE_UP,
      UNINDENT_NODE,
      MOVE_NODE_DOWN
    ].includes(type)
  ) {
    if (type === CREATE_NODE_PATH) {
      return {
        ...state,
        [path]: {
          root: {
            children: [],
            depth: -1,
            id: 'root',
            parent: undefined
          }
        }
      };
    }

    if (type === UPDATE_NODE) {
      const { payload } = action;
      if (
        payload &&
        (_.has(payload, 'parent') ||
          _.has(payload, 'at') ||
          _.has(payload, 'first') ||
          _.has(payload, 'before') ||
          _.has(payload, 'after') ||
          _.has(payload, 'afterIndex') ||
          _.has(payload, 'beforeIndex'))
      ) {
        return { ...state, [path]: nodes(state[path], action) };
      }
      return state;
    }

    return { ...state, [path]: nodes(state[path], action) };
  }

  return state;
};

export const createNodePath = path => ({
  path,
  type: CREATE_NODE_PATH
});

export const createNode = getPathPayloadAction(CREATE_NODE);

export const updateNode = getPathPayloadAction(UPDATE_NODE);

export const deleteNode = getPathPayloadAction(DELETE_NODE);

export const clearNodes = getPathPayloadAction(CLEAR_NODES);

export const moveNode = getPathPayloadAction(MOVE_NODE);

export const moveNodeUp = getPathPayloadAction(MOVE_NODE_UP);

export const moveNodeDown = getPathPayloadAction(MOVE_NODE_DOWN);

export const indentNode = getPathPayloadAction(INDENT_NODE);

export const unindentNode = getPathPayloadAction(UNINDENT_NODE);
