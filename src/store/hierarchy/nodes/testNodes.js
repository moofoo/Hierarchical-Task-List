export default {
  '1': { children: ['2', '4'], depth: 0, id: '1', parent: 'root' },
  '2': { children: ['3'], depth: 1, id: '2', parent: '1' },
  '3': { children: [], depth: 2, id: '3', parent: '2' },
  '4': { children: [], depth: 1, id: '4', parent: '1' },
  '5': { children: [], depth: 0, id: '5', parent: 'root' },
  root: { children: ['1', '5'], depth: -1, id: 'root' }
};

/*
    - 1
    - - Child of 1 (2)
    - - - Child of 2 (3)
    - - Sibling of 2 (4)
    - 5
*/
