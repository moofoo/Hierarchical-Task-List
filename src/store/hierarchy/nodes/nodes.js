import _ from 'lodash';
import children from './children';
import {
  getAllDescendantIds,
  deleteMany,
  getLeftSiblingId,
  getRightSiblingId,
  reducerMoveNode,
  getRightSiblingIds
} from './helpers';

import {
  ADD_CHILD,
  CLEAR_NODES,
  CREATE_NODE,
  DELETE_NODE,
  INDENT_NODE,
  MOVE_NODE,
  MOVE_NODE_DOWN,
  MOVE_NODE_UP,
  REMOVE_CHILD,
  UNINDENT_NODE,
  UPDATE_NODE
} from './types';

export default (state = {}, action) => {
  const { type } = action;
  const { payload } = action;

  if (type === CLEAR_NODES) {
    return {
      root: {
        children: [],
        depth: -1,
        id: 'root',
        parent: undefined
      }
    };
  }

  if (payload === undefined || payload.id === undefined) {
    return state;
  }

  let { id, parent } = payload;

  id = id.toString();
  if (parent) {
    parent = parent.toString();
  }

  switch (type) {
    case UPDATE_NODE:
    case MOVE_NODE: {
      return reducerMoveNode(state, payload);
    }
    case MOVE_NODE_DOWN: {
      const sibling = getRightSiblingId(state, id);
      if (sibling && state[sibling].id !== 'root') {
        return reducerMoveNode(state, {
          after: sibling,
          id
        });
      }
      return state;
    }
    case MOVE_NODE_UP: {
      const sibling = getLeftSiblingId(state, id);
      if (sibling && state[sibling].id !== 'root') {
        return reducerMoveNode(state, {
          before: sibling,
          id
        });
      }
      return state;
    }
    case INDENT_NODE: {
      const sibling = getLeftSiblingId(state, id);
      if (sibling && state[sibling].id !== 'root') {
        return reducerMoveNode(state, {
          id,
          parent: sibling
        });
      }

      return state;
    }
    case UNINDENT_NODE: {
      const parentId = parent || state[id].parent;

      if (parentId === 'root' || state[parentId] === undefined) {
        return state;
      }

      const newSibling = parentId;
      const parentParentId = state[parentId].parent;

      if (parentParentId) {
        let newState = reducerMoveNode(state, {
          after: newSibling,
          id,
          parent: parentParentId
        });

        if (payload.googleStyle) {
          const rightSiblings = getRightSiblingIds(state, id);
          _.forEach(rightSiblings, nodeId => {
            newState = reducerMoveNode(newState, {
              id: nodeId,
              parent: id
            });
          });
        }
        return newState;
      }

      return state;
    }
    case CREATE_NODE: {
      const parentId = parent || 'root';

      if (state[parentId] === undefined) {
        return state;
      }

      const newNode = {
        children: [],
        depth: parentId === 'root' ? 0 : state[parentId].depth + 1,
        id,
        parent: parentId
      };

      return {
        ...state,
        [id]: newNode,
        [parentId]: {
          ...state[parentId],
          children: children(state[parentId].children, {
            payload,
            type: ADD_CHILD
          })
        }
      };
    }
    case DELETE_NODE: {
      let idArr = id;
      if (!_.isArray(id)) {
        idArr = [id];
      }

      let newState = { ...state };

      _.forEach(idArr, childId => {
        const parentId = state[childId].parent;
        const descendantIds = getAllDescendantIds(newState, childId);

        newState = {
          ...deleteMany(newState, [childId, ...descendantIds]),
          [parentId]: {
            ...newState[parentId],
            children: children(newState[parentId].children, {
              payload: {
                id: childId
              },
              type: REMOVE_CHILD
            })
          }
        };
      });

      return newState;
    }
    default: {
      return state;
    }
  }
};
