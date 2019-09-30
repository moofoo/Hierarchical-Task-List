import testNodes from './testNodes';
import nodesReducer from './nodes';

import {
  CLEAR_NODES,
  CREATE_NODE,
  DELETE_NODE,
  INDENT_NODE,
  MOVE_NODE,
  MOVE_NODE_DOWN,
  MOVE_NODE_UP,
  UNINDENT_NODE
} from './types';
import expectExport from 'expect';

describe('Nodes Reducer', () => {
  it('should handle CLEAR_NODES', () => {
    const initState = {
      '1': { children: [], depth: 0, id: '1', parent: 'root' },
      root: { children: ['1'], depth: -1, id: 'root' }
    };

    expect(
      nodesReducer(initState, {
        type: CLEAR_NODES
      })
    ).toEqual({ root: { children: [], depth: -1, id: 'root' } });
  });

  it('should handle CREATE_NODE', () => {
    const initState = { root: { children: [], depth: -1, id: 'root' } };

    expect(
      nodesReducer(initState, {
        type: CREATE_NODE,
        payload: {
          id: 1
        }
      })
    ).toEqual({
      '1': { children: [], depth: 0, id: '1', parent: 'root' },
      root: { children: ['1'], depth: -1, id: 'root' }
    });
  });

  it('should handle DELETE_NODE', () => {
    expect(
      nodesReducer(testNodes, {
        type: DELETE_NODE,
        payload: {
          id: 1
        }
      })
    ).toEqual({
      '5': { children: [], depth: 0, id: '5', parent: 'root' },
      root: { children: ['5'], depth: -1, id: 'root' }
    });
  });

  it('should handle INDENT_NODE', () => {
    expect(
      nodesReducer(testNodes, {
        type: INDENT_NODE,
        payload: {
          id: 4
        }
      })
    ).toEqual({
      '1': { children: ['2'], depth: 0, id: '1', parent: 'root' },
      '2': { children: ['3', '4'], depth: 1, id: '2', parent: '1' },
      '3': { children: [], depth: 2, id: '3', parent: '2' },
      '4': { children: [], depth: 2, id: '4', parent: '2' },
      '5': { children: [], depth: 0, id: '5', parent: 'root' },
      root: { children: ['1', '5'], depth: -1, id: 'root' }
    });
  });

  it('should handle UNINDENT_NODE', () => {
    const initState = {
      '1': { children: ['2'], depth: 0, id: '1', parent: 'root' },
      '2': { children: ['3', '4'], depth: 1, id: '2', parent: '1' },
      '3': { children: [], depth: 2, id: '3', parent: '2' },
      '4': { children: [], depth: 2, id: '4', parent: '2' },
      '5': { children: [], depth: 0, id: '5', parent: 'root' },
      root: { children: ['1', '5'], depth: -1, id: 'root' }
    };

    expect(
      nodesReducer(initState, {
        type: UNINDENT_NODE,
        payload: {
          id: 4
        }
      })
    ).toEqual(testNodes);
  });

  it('should handle MOVE_NODE_UP', () => {
    expect(
      nodesReducer(testNodes, {
        type: MOVE_NODE_UP,
        payload: {
          id: 4
        }
      })
    ).toEqual({
      '1': { children: ['4', '2'], depth: 0, id: '1', parent: 'root' },
      '2': { children: ['3'], depth: 1, id: '2', parent: '1' },
      '3': { children: [], depth: 2, id: '3', parent: '2' },
      '4': { children: [], depth: 1, id: '4', parent: '1' },
      '5': { children: [], depth: 0, id: '5', parent: 'root' },
      root: { children: ['1', '5'], depth: -1, id: 'root' }
    });
  });

  it('should handle MOVE_NODE_DOWN', () => {
    const initState = {
      '1': { children: ['4', '2'], depth: 0, id: '1', parent: 'root' },
      '2': { children: ['3'], depth: 1, id: '2', parent: '1' },
      '3': { children: [], depth: 2, id: '3', parent: '2' },
      '4': { children: [], depth: 1, id: '4', parent: '1' },
      '5': { children: [], depth: 0, id: '5', parent: 'root' },
      root: { children: ['1', '5'], depth: -1, id: 'root' }
    };

    expect(
      nodesReducer(initState, {
        type: MOVE_NODE_DOWN,
        payload: {
          id: 4
        }
      })
    ).toEqual(testNodes);
  });

  it('should handle MOVE_NODE', () => {
    const initState = {
      '1': { children: [], depth: 0, id: '1', parent: 'root' },
      '2': { children: [], depth: 0, id: '2', parent: 'root' },
      root: { children: ['1', '2'], depth: -1, id: 'root' }
    };

    expect(
      nodesReducer(initState, {
        type: MOVE_NODE,
        payload: {
          id: '1',
          parent: '2'
        }
      })
    ).toEqual({
      '1': { children: [], depth: 1, id: '1', parent: '2' },
      '2': { children: ['1'], depth: 0, id: '2', parent: 'root' },
      root: { children: ['2'], depth: -1, id: 'root' }
    });
  });
});
