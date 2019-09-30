import BindingReducer, { BINDING_SET } from './binding';

describe('binding reducer', () => {
  it('should return initial state', () => {
    expect(BindingReducer(undefined, {})).toEqual({});
  });

  it('should handle BINDING_SET', () => {
    expect(
      BindingReducer(
        {},
        {
          type: BINDING_SET,
          payload: {
            path: 'path',
            createAction: null,
            updateAction: null,
            deleteAction: null,
            clearAction: null
          }
        }
      )
    ).toMatchObject({
      path: {
        createAction: null,
        updateAction: null,
        deleteAction: null,
        clearAction: null
      }
    });
  });
});
