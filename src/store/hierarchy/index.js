import _ from 'lodash';
import { combineReducers } from 'redux';
import { createSelector } from 'reselect';
import binding, { setBinding } from './binding';
import nodes from './nodes';
import {
  getAllDescendantIds,
  getDescendantIds,
  getAllChildIds,
  getAllSiblingIds,
  getLeftSiblingId,
  getLeftSiblingIds,
  getRightSiblingId,
  getRightSiblingIds,
  getParentIds,
  getParentId,
  getIndexes,
  orderedNodeList
} from './nodes/helpers';

import {
  createNode,
  updateNode,
  deleteNode,
  clearNodes,
  moveNode,
  moveNodeUp,
  moveNodeDown,
  indentNode,
  unindentNode
} from './nodes';

import { types } from './nodes/types';

const {
  CREATE_NODE,
  DELETE_NODE,
  UPDATE_NODE,
  CLEAR_NODES,
  CREATE_NODE_PATH,
  MOVE_NODE,
  MOVE_NODE_DOWN,
  MOVE_NODE_UP,
  INDENT_NODE,
  UNINDENT_NODE
} = types;

const BINDING_SET = 'HIERARCHY/BINDING/SET';

const combined = combineReducers({
  binding,
  nodes
});

const getBinding = (state, action) => {
  if (state.binding && _.size(state.binding)) {
    if (Object.values(types).includes(action.type) && action.path) {
      return state.binding[action.path];
    }
  }

  return false;
};

export const hierarchy = (state = {}, action) => {
  const { path, type, payload } = action;
  const newState = combined(state, action);

  if (action.type === BINDING_SET) {
    return combined(newState, {
      path: payload.path,
      type: CREATE_NODE_PATH
    });
  }

  if (type === UNINDENT_NODE) {
    const bound = getBinding(state, action);
    if (bound) {
      payload.googleStyle = bound.googleStyle;
    }
  }

  if (newState.binding && _.size(newState.binding) && _.size(newState.nodes)) {
    _.forEach(newState.binding, (data, dataPath) => {
      if (data.indexing && dataPath === path) {
        if (newState.nodes[dataPath] && _.size(newState.nodes[dataPath])) {
          if (
            [
              CREATE_NODE,
              DELETE_NODE,
              MOVE_NODE,
              MOVE_NODE_DOWN,
              MOVE_NODE_UP,
              INDENT_NODE,
              UNINDENT_NODE
            ].includes(type) ||
            (type === UPDATE_NODE &&
              action.payload &&
              _.pick(action.payload, [
                'parent',
                'at',
                'first',
                'before',
                'after'
              ]).length)
          ) {
            newState.nodes[dataPath] = getIndexes(newState.nodes[dataPath]);
          }
        }
      }
    });
  }

  return newState;
};

export const hierarchyMiddleware = store => next => action => {
  let nodePayload;

  if (
    [CREATE_NODE, DELETE_NODE, UPDATE_NODE, CLEAR_NODES].includes(action.type)
  ) {
    const state = store.getState();
    if (state.hierarchy) {
      const bindings = state.hierarchy.binding;

      const { type, path } = action;
      let { payload } = action;

      if (bindings && path) {
        const bound = bindings[path];
        if (bound) {
          if (type !== CLEAR_NODES) {
            if (type === CREATE_NODE && payload === undefined) {
              payload = {};
            }

            if (payload.id === undefined) {
              payload.id = _.uniqueId();
            } else if (_.isArray(payload.id)) {
              _.forEach(payload.id, (value, index) => {
                payload.id[index] = _.toString(value);
              });
            } else {
              payload.id = _.toString(payload.id);
            }
          }

          nodePayload = _.pick(payload, [
            'id',
            'parent',
            'at',
            'first',
            'before',
            'after'
          ]);
          const dataPayload = _.omit(payload, [
            'parent',
            'at',
            'first',
            'before',
            'after',
            'afterIndex',
            'cascade',
            'cascadeProp',
            'cascadeLength'
          ]);

          let boundActionType;
          switch (type) {
            case CREATE_NODE:
              boundActionType = bound.createAction;
              break;
            case DELETE_NODE:
              boundActionType = bound.deleteAction;
              break;
            case UPDATE_NODE:
              boundActionType = bound.updateAction;
              break;
            case CLEAR_NODES:
              boundActionType = bound.clearAction;
              break;
            default: {
              boundActionType = undefined;
            }
          }
          if (boundActionType) {
            if (type === UPDATE_NODE) {
              const { cascadeLength } = payload;
              let { cascade, cascadeProp } = payload;

              if (cascade) {
                const boundNodes = state.hierarchy.nodes[path];

                if (cascadeProp === undefined) {
                  cascadeProp = _.omit(dataPayload, ['id']);
                } else if (_.isArray(cascadeProp)) {
                  cascadeProp = _.omit(_.pick(dataPayload, cascadeProp), [
                    'id'
                  ]);
                }

                let ids = [];

                if (!_.isArray(cascade)) {
                  cascade = [cascade];
                }

                _.forEach(cascade, dir => {
                  if (
                    ['left', 'right', 'up', 'down'].includes(dir) &&
                    cascadeLength
                  ) {
                    switch (dir) {
                      case 'left': {
                        ids = [
                          ...ids,
                          ...getLeftSiblingIds(
                            boundNodes,
                            payload.id,
                            cascadeLength
                          )
                        ];
                        break;
                      }
                      case 'right': {
                        ids = [
                          ...ids,
                          ...getRightSiblingIds(
                            boundNodes,
                            payload.id,
                            cascadeLength
                          )
                        ];
                        break;
                      }
                      case 'up': {
                        ids = [
                          ...ids,
                          ...getParentIds(boundNodes, payload.id, cascadeLength)
                        ];
                        break;
                      }
                      case 'down': {
                        ids = [
                          ...ids,
                          ...getDescendantIds(
                            boundNodes,
                            payload.id,
                            cascadeLength
                          )
                        ];
                        break;
                      }
                      default: {
                        ids = [];
                      }
                    }
                  } else if (
                    [
                      'root',
                      'parent',
                      'children',
                      'descendants',
                      'siblings',
                      'leftSiblings',
                      'rightSiblings',
                      'leftSibling',
                      'rightSibling'
                    ].includes(dir)
                  ) {
                    switch (dir) {
                      case 'root': {
                        ids = [...ids, ...getParentIds(boundNodes, payload.id)];
                        break;
                      }
                      case 'parent': {
                        ids = [...ids, getParentId(boundNodes, payload.id)];
                        break;
                      }
                      case 'children': {
                        ids = [
                          ...ids,
                          ...getAllChildIds(boundNodes, payload.id)
                        ];
                        break;
                      }
                      case 'descendants': {
                        ids = [
                          ...ids,
                          ...getAllDescendantIds(boundNodes, payload.id)
                        ];
                        break;
                      }
                      case 'siblings': {
                        ids = [
                          ...ids,
                          ...getAllSiblingIds(boundNodes, payload.id)
                        ];
                        break;
                      }
                      case 'leftSiblings': {
                        ids = [
                          ...ids,
                          ...getLeftSiblingIds(boundNodes, payload.id)
                        ];
                        break;
                      }
                      case 'rightSiblings': {
                        ids = [
                          ...ids,
                          ...getRightSiblingIds(boundNodes, payload.id)
                        ];
                        break;
                      }
                      case 'leftSibling': {
                        ids = [
                          ...ids,
                          getLeftSiblingId(boundNodes, payload.id)
                        ];
                        break;
                      }
                      case 'rightSibling': {
                        ids = [
                          ...ids,
                          getRightSiblingId(boundNodes, payload.id)
                        ];
                        break;
                      }
                      default: {
                        ids = [];
                      }
                    }
                  }
                });

                if (ids.length) {
                  let updatedData;
                  let updatedNode;

                  if (_.isFunction(cascadeProp)) {
                    updatedNode = { ...boundNodes[payload.id] };
                    updatedData = { ..._.get(state, `${path}.${payload.id}`) };
                  }

                  _.forEach(ids, cascadeId => {
                    let cascadePayload = cascadeProp;

                    if (_.isFunction(cascadeProp)) {
                      const cascadeData = {
                        ..._.get(state, `${path}.${cascadeId}`)
                      };
                      const boundNode = { ...boundNodes[cascadeId] };
                      cascadePayload = cascadeProp(
                        payload,
                        updatedData,
                        updatedNode,
                        cascadeData,
                        boundNode
                      );
                    }

                    if (cascadePayload !== null) {
                      cascadePayload.id = cascadeId;

                      store.dispatch({
                        payload: cascadePayload,
                        type: boundActionType
                      });
                    }
                  });
                }
              }

              store.dispatch({ payload: dataPayload, type: boundActionType });
            } else if (type === DELETE_NODE) {
              let deleteId = dataPayload.id;

              if (!_.isArray(deleteId)) {
                deleteId = [deleteId];
              }

              let allIds = [];

              _.forEach(deleteId, dId => {
                allIds = allIds.concat([
                  dId,
                  ...getAllDescendantIds(state.hierarchy.nodes[path], dId)
                ]);
              });

              dataPayload.id = allIds;

              store.dispatch({ payload: dataPayload, type: boundActionType });
            } else {
              store.dispatch({ payload: dataPayload, type: boundActionType });
            }
          }
        }
      }
    }
  }

  if (
    [CREATE_NODE, DELETE_NODE, UPDATE_NODE, CLEAR_NODES].includes(
      action.type
    ) &&
    nodePayload
  ) {
    action.payload = nodePayload;
  }

  return next(action);
};

export const bindNodes = (
  store,
  path,
  createAction,
  updateAction,
  deleteAction,
  clearAction,
  options
) => {
  store.dispatch(
    setBinding({
      clearAction,
      createAction,
      deleteAction,
      options,
      path,
      updateAction
    })
  );
};

export const createNodeDataSelector = path => {
  return createSelector(
    state => _.at(state, path)[0],
    state => _.at(state.hierarchy.nodes, path)[0],
    (data, nodes) => {
      const combined = {};

      _.forEach(nodes, node => {
        combined[node.id] = {
          ...node,
          ...data[node.id]
        };
      });

      return combined;
    }
  );
};

export const createOrderedNodeDataSelector = path => {
  const nodeDataSelector = createNodeDataSelector(path);
  return createSelector(
    nodeDataSelector,
    nodeData => {
      const orderedNodeIds = orderedNodeList(nodeData.root.children, nodeData);

      const orderedNodes = [];

      _.forEach(orderedNodeIds, (id, index) => {
        const node = nodeData[id];

        orderedNodes.push({
          ...node,
          parent: nodeData[node.parent],
          descendants: getAllDescendantIds(nodeData, node.id),
          ancestors: getParentIds(nodeData, node.id),
          left: nodeData[orderedNodeIds[index - 1]],
          right: nodeData[orderedNodeIds[index + 1]]
        });
      });

      return orderedNodes;
    }
  );
};

export {
  getAllDescendantIds,
  getDescendantIds,
  getAllChildIds,
  getAllSiblingIds,
  getLeftSiblingId,
  getLeftSiblingIds,
  getRightSiblingId,
  getRightSiblingIds,
  getParentIds,
  getParentId,
  createNode,
  updateNode,
  deleteNode,
  clearNodes,
  moveNode,
  moveNodeUp,
  moveNodeDown,
  indentNode,
  unindentNode
};
