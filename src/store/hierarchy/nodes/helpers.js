import _ from 'lodash';
import children from './children';
import { REMOVE_CHILD, ORDER_CHILD } from './types';

export const orderedNodeList = (rootIds, allNodes, o) => {
  let ordered = o || [];

  _.forEach(rootIds, id => {
    ordered.push(id);
    if (allNodes[id].children.length) {
      ordered = orderedNodeList(allNodes[id].children, allNodes, ordered);
    }
  });

  return ordered;
};

export const getAllDescendantIds = (state, id) =>
  state[id].children.reduce(
    (acc, childId) => [...acc, childId, ...getAllDescendantIds(state, childId)],
    []
  );

export const deleteMany = (state, ids) => {
  const newState = { ...state };

  ids.forEach(descendant => {
    delete newState[descendant];
  });
  return newState;
};

const getDescIds = (state, id, depth, nodeDepth, depthAt = 0) => {
  const newDepth = state[id].depth;
  if (newDepth !== nodeDepth) {
    depthAt += 1;
  }

  if (depthAt >= depth) {
    return state[id].children;
  }

  return state[id].children.reduce(
    (acc, childId) => [
      ...acc,
      childId,
      ...getDescIds(state, childId, depth, newDepth, depthAt)
    ],
    []
  );
};

export const getDescendantIds = (state, id, depth = -1, depthAt = 0) => {
  if (depth <= 0) {
    return getAllDescendantIds(state, id);
  }

  depth -= 1;
  const nodeDepth = state[id].depth;

  return getDescIds(state, id, depth, nodeDepth, depthAt);
};

export const getAllChildIds = (state, id) => state[id].children;

export const getParentId = (state, id) => state[id].parent;

export const getAllSiblingIds = (state, id) => {
  const parentId = getParentId(state, id);
  return state[parentId].children;
};

export const getLeftSiblingIds = (state, id, length = -1) => {
  const parentId = getParentId(state, id);
  const index = state[parentId].children.indexOf(id);
  let leftSiblings = state[parentId].children.slice(0, index);

  if (length === -1) {
    return leftSiblings;
  }

  if (length > leftSiblings.length) {
    length = leftSiblings.length;
  }

  leftSiblings = _.reverse(leftSiblings);

  leftSiblings.length = length;

  return _.reverse(leftSiblings);
};

export const getLeftSiblingId = (state, id) => {
  const ids = getLeftSiblingIds(state, id, 1);
  if (ids.length) {
    return ids[0];
  }

  return undefined;
};

export const getRightSiblingIds = (state, id, length = -1) => {
  const parentId = getParentId(state, id);
  const index = state[parentId].children.indexOf(id) + 1;
  const rightSiblings = state[parentId].children.slice(index);

  if (length === -1) {
    return rightSiblings;
  }

  if (length > rightSiblings.length) {
    length = rightSiblings.length;
  }

  rightSiblings.length = length;

  return rightSiblings;
};

export const getRightSiblingId = (state, id) => {
  const ids = getRightSiblingIds(state, id, 1);
  if (ids.length) {
    return ids[0];
  }

  return undefined;
};

export const getParentIds = (state, id, depth = -1) => {
  let currentId = getParentId(state, id);

  if (currentId === 'root') {
    return [];
  }

  const parentIds = [];
  let depthAt = 0;

  while (currentId !== 'root') {
    if (depth >= 0 && depthAt >= depth) {
      break;
    }
    depthAt += 1;
    parentIds.push(currentId);
    currentId = getParentId(state, currentId);
  }

  return parentIds;
};

let count = 0;

const getIndexesRecurse = (node, indexes, state) => {
  if (node.children.length > 0) {
    _.forEach(node.children, childId => {
      if (indexes[childId] === undefined) {
        indexes[childId] = count;
        state[childId] = {
          ...state[childId],
          index: count
        };

        count += 1;
      }
      if (state[childId].children) {
        indexes = getIndexesRecurse(state[childId], indexes, state);
      }
    });
  }

  if (indexes[node.id] === undefined) {
    indexes[node.id] = count;

    state[node.id] = {
      ...state[node.id],
      index: count
    };

    count += 1;
  }

  return indexes;
};

export const getIndexes = nodes => {
  const newNodes = { ...nodes };
  count = 0;

  getIndexesRecurse(newNodes.root, {}, newNodes);

  newNodes.root = {
    ...newNodes.root,
    index: -1
  };

  return newNodes;
};

export const reducerMoveNode = (state, payload) => {
  if (payload.afterIndex !== undefined) {
    const indexNode = _.find(state, n => n.id === payload.afterIndex);

    if (indexNode.children.length && payload.makeChild) {
      payload.first = true;
      payload.parent = indexNode.id;
    } else {
      payload.after = indexNode.id;
      payload.parent = indexNode.parent;
    }
  }

  const { id, parent } = payload;

  const parentId = parent || state[id].parent;
  const oldParent = state[id].parent;

  if (oldParent !== parentId) {
    const updatedChildren = {};
    const oldDepth = state[id].depth;
    const newDepth = parentId === 'root' ? 0 : state[parentId].depth + 1;
    const depthDiff = newDepth - oldDepth;

    if (depthDiff !== 0 && state[id].children.length) {
      const descendants = getAllDescendantIds(state, id);
      _.forEach(descendants, childId => {
        updatedChildren[childId] = Object.assign({}, state[childId], {
          depth: state[childId].depth + depthDiff
        });
      });
    }

    return {
      ...state,
      ...updatedChildren,
      [id]: {
        ...state[id],
        depth: newDepth,
        parent: parentId
      },
      [oldParent]: {
        ...state[oldParent],
        children: children(state[oldParent].children, {
          payload,
          type: REMOVE_CHILD
        })
      },
      [parentId]: {
        ...state[parentId],
        children: children(state[parentId].children, {
          payload,
          type: ORDER_CHILD
        })
      }
    };
  }

  return {
    ...state,
    [parentId]: {
      ...state[parentId],
      children: children(state[parentId].children, {
        payload,
        type: ORDER_CHILD
      })
    }
  };
};

export const getPathPayloadAction = type => {
  const act = (path, payload) => ({
    path,
    payload,
    type
  });

  return act;
};
