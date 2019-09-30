import { ADD_CHILD, REMOVE_CHILD, ORDER_CHILD } from './types';
import ChildrenReducer from './children';

describe('Children Reducer', () => {
  it('should handle REMOVE_CHILD', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: REMOVE_CHILD,
        payload: {
          id: 2
        }
      })
    ).toEqual(['1', '3', '4']);
  });

  it('should handle ORDER_CHILD, first', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: ORDER_CHILD,
        payload: {
          id: 2,
          first: true
        }
      })
    ).toEqual(['2', '1', '3', '4']);
  });

  it('should handle ORDER_CHILD, before', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: ORDER_CHILD,
        payload: {
          id: 2,
          before: 4
        }
      })
    ).toEqual(['1', '3', '2', '4']);
  });

  it('should handle ORDER_CHILD, after', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: ORDER_CHILD,
        payload: {
          id: 2,
          after: 3
        }
      })
    ).toEqual(['1', '3', '2', '4']);
  });

  it('should handle ORDER_CHILD, at (index)', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: ORDER_CHILD,
        payload: {
          id: 2,
          at: 0
        }
      })
    ).toEqual(['2', '1', '3', '4']);
  });

  it('should handle ADD_CHILD, first', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: ADD_CHILD,
        payload: {
          id: 5,
          first: true
        }
      })
    ).toEqual(['5', '1', '2', '3', '4']);
  });

  it('should handle ADD_CHILD, before', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: ADD_CHILD,
        payload: {
          id: 5,
          before: 4
        }
      })
    ).toEqual(['1', '2', '3', '5', '4']);
  });

  it('should handle ADD_CHILD, after', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: ADD_CHILD,
        payload: {
          id: 5,
          after: 3
        }
      })
    ).toEqual(['1', '2', '3', '5', '4']);
  });

  it('should handle ADD_CHILD, at (index)', () => {
    expect(
      ChildrenReducer(['1', '2', '3', '4'], {
        type: ADD_CHILD,
        payload: {
          id: 5,
          at: 0
        }
      })
    ).toEqual(['5', '1', '2', '3', '4']);
  });
});
