import { ADD_CHILD, REMOVE_CHILD, ORDER_CHILD } from './types';

export default (state = [], action) => {
  let { type } = action;
  let { id, at, first, before, after } = action.payload;

  id = id.toString();
  before = before ? before.toString() : before;
  after = after ? after.toString() : after;

  if (id === undefined) {
    return state;
  }

  if (type === ORDER_CHILD) {
    type = ADD_CHILD;
    state = state.filter(child => child !== id);
  }

  switch (type) {
    case ADD_CHILD: {
      if (first === true) {
        return [id, ...state];
      }

      if (at !== undefined) {
        if (at <= 0) {
          return [id, ...state];
        } else if (at >= state.length) {
          return [...state, id];
        }

        return [...state.slice(0, at), id, ...state.slice(at)];
      }

      if (before !== undefined) {
        if (state[0] === before) {
          return [id, ...state];
        }
        const beforeIndex = state.findIndex(child => child === before);

        return [
          ...state.slice(0, beforeIndex),
          id,
          ...state.slice(beforeIndex)
        ];
      }

      if (after !== undefined) {
        if (state[state.length - 1] === after) {
          return [...state, id];
        }

        const afterIndex = state.findIndex(child => child === after) + 1;

        return [...state.slice(0, afterIndex), id, ...state.slice(afterIndex)];
      }

      return [...state, id];
    }

    case REMOVE_CHILD:
      return state.filter(child => child !== id);
    default:
      return state;
  }
};
