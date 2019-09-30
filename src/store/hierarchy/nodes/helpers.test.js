import testNodes from './testNodes';
/*
    - 1
    - - 2
    - - - 3
    - - 4
    - 5
*/
import {
  orderedNodeList,
  getAllDescendantIds,
  deleteMany,
  getIndexes,
  getAllChildIds,
  getParentId,
  getAllSiblingIds,
  getLeftSiblingIds,
  getRightSiblingIds
} from './helpers';

describe('helper functions', () => {
  it('orderedNodeList returns list of ids left to right, ignoring depth', () => {
    expect(orderedNodeList(testNodes.root.children, testNodes)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5'
    ]);
  });

  it('getAllDescendantIds returns descendant ids of node id', () => {
    expect(getAllDescendantIds(testNodes, '1')).toEqual(['2', '3', '4']);
  });

  it('deleteMany deletes given nodes by id', () => {
    expect(deleteMany(testNodes, ['1', '2', '3', '4'])).toEqual({
      '5': testNodes['5'],
      root: testNodes['root']
    });
  });

  it('getIndexes adds left to right indexes to nodes state, ignoring depth', () => {
    expect(getIndexes(testNodes)).toEqual({
      '1': {
        children: ['2', '4'],
        depth: 0,
        id: '1',
        parent: 'root',
        index: 0
      },
      '2': { children: ['3'], depth: 1, id: '2', parent: '1', index: 1 },
      '3': { children: [], depth: 2, id: '3', parent: '2', index: 2 },
      '4': { children: [], depth: 1, id: '4', parent: '1', index: 3 },
      '5': { children: [], depth: 0, id: '5', parent: 'root', index: 4 },
      root: { children: ['1', '5'], depth: -1, id: 'root', index: -1 }
    });
  });

  it('getAllChildIds gets immediate children of node by id', () => {
    expect(getAllChildIds(testNodes, '1')).toEqual(['2', '4']);
  });

  it('getParentId gets parent id of node by id', () => {
    expect(getParentId(testNodes, '2')).toEqual('1');
  });

  it('getAllSiblingIds returns all siblings of node by id', () => {
    expect(getAllSiblingIds(testNodes, '1')).toEqual(['1', '5']);
  });

  it('getLeftSiblingIds gets siblings to the left of node by id', () => {
    expect(getLeftSiblingIds(testNodes, '5')).toEqual(['1']);
  });

  it('getRightSiblingIds gets siblings to the right of node by id', () => {
    expect(getRightSiblingIds(testNodes, '1')).toEqual(['5']);
  });
});
