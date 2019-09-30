import _ from 'lodash';
import { ADD_TASK, REMOVE_TASK, UPDATE_TASK, CLEAR_TASKS } from './actionTypes';

const reducer = (state = {}, action) => {
  switch (action.type) {
    case ADD_TASK: {
      const id = action.payload.id || _.uniqueId();

      return {
        ...state,
        [id]: {
          completed: false,
          ...action.payload
        }
      };
    }

    case REMOVE_TASK: {
      return _.omit(state, [action.payload.id]);
    }

    case UPDATE_TASK: {
      const id = action.payload.id;

      const newState = {
        ...state,
        [id]: {
          ...state[id],
          ...action.payload
        }
      };
      return newState;
    }

    case CLEAR_TASKS: {
      return {};
    }

    default:
      return state;
  }
};

export default reducer;
