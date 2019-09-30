export const BINDING_SET = 'HIERARCHY/BINDING/SET';

const reducer = (state = {}, action) => {
  const { type, payload } = action;
  switch (type) {
    case BINDING_SET: {
      const {
        path,
        createAction,
        updateAction,
        deleteAction,
        clearAction
      } = payload;
      const options = payload.options || {};

      return {
        ...state,
        [path]: {
          ...options,
          clearAction,
          createAction,
          deleteAction,
          updateAction
        }
      };
    }
    default: {
      return state;
    }
  }
};

export const setBinding = payload => ({
  payload,
  type: BINDING_SET
});

export default reducer;
