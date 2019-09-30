import { deleteNode } from '../hierarchy/nodes';
import _ from 'lodash';

export function clearCompleted() {
  return (dispatch, getState) => {
    const state = getState();
    const toDelete = [];

    _.forEach(state.tasks, task => {
      if (task.completed) {
        toDelete.push(state.hierarchy.nodes.tasks[task.id]);
      }
    });

    _.forEach(_.reverse(_.sortBy(toDelete, ['depth'])), node => {
      dispatch(deleteNode('tasks', { id: node.id }));
    });
  };
}
