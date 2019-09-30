import React from 'react';
import { List } from '@material-ui/core';
import Task from './Task';
import { SortableContainer } from 'react-sortable-hoc';

const TaskList = props => {
  const hide = props.draggingTask ? props.draggingTask.descendants : [];

  return (
    <List>
      {props.tasks.map((task, index) => {
        if (hide.find(id => id === task.id)) {
          return null;
        }
        return (
          <Task
            {...task}
            key={task.id}
            dragging={
              props.draggingTask ? props.draggingTask.id === task.id : false
            }
          />
        );
      })}
    </List>
  );
};

export default SortableContainer(TaskList);
