import React from 'react';
import TaskList from './TaskList';
import { connect } from 'react-redux';
import { moveNode } from '../../store/hierarchy/nodes';
import { orderedNodeDataSelector } from '../../store';
import Container from '@material-ui/core/Container';

class TaskListContainer extends React.Component {
  state = {
    draggingTask: null
  };

  updateBeforeSortStart = ({ index }) => {
    this.setState({
      draggingTask: this.props.tasks[index]
    });
  };

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({
      draggingTask: null
    });

    if (oldIndex === newIndex) {
      return;
    }

    const draggedTask = this.props.tasks[oldIndex];
    const droppedTask = this.props.tasks[newIndex];

    const dir = newIndex > oldIndex ? 'down' : 'up';

    const payload = {
      id: draggedTask.id,
      parent:
        droppedTask.descendants.length && dir === 'down'
          ? droppedTask.id
          : droppedTask.parent.id
    };

    if (dir === 'down') {
      payload.after = droppedTask.id;
    } else {
      payload.before = droppedTask.id;
    }

    this.props.moveNode(payload);
  };

  render() {
    return (
      <Container
        style={{
          overflow: 'auto',
          flex: 1,
          marginTop: 65
        }}
      >
        <TaskList
          draggingTask={this.state.draggingTask}
          useDragHandle
          lockAxis='y'
          tasks={this.props.tasks}
          onSortEnd={this.onSortEnd}
          onSortMove={this.onSortMove}
          updateBeforeSortStart={this.updateBeforeSortStart}
          distance={5}
        />
      </Container>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    moveNode: payload => dispatch(moveNode('tasks', payload))
  };
};

const mapDataToProps = state => {
  return {
    tasks: orderedNodeDataSelector(state)
  };
};

export default connect(
  mapDataToProps,
  mapDispatchToProps
)(TaskListContainer);
