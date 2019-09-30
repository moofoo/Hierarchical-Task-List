import React from 'react';
import { connect } from 'react-redux';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import AddIcon from '@material-ui/icons/AddCircleRounded';
import PlaylistAdd from '@material-ui/icons/PlaylistAdd';
import PlaylistAddCheck from '@material-ui/icons/PlaylistAddCheck';
import {
  createNode,
  clearNodes,
  removeNode
} from '../../store/hierarchy/nodes';
import { clearCompleted } from '../../store/tasks/actions';

const Footer = ({ createNode, clearNodes, clearCompleted }) => {
  const addClick = () => {
    createNode({
      data: {
        text: ''
      }
    });
  };

  const newClick = () => {
    clearNodes();
  };

  const clearClick = () => {
    clearCompleted();
  };
  return (
    <BottomNavigation style={{ backgroundColor: 'lightgray' }}>
      <BottomNavigationAction
        label='Add Task'
        showLabel
        onClick={addClick}
        icon={<AddIcon color='primary' />}
      />
      <BottomNavigationAction
        label='Clear Completed'
        showLabel
        onClick={clearClick}
        icon={<PlaylistAddCheck color='primary' />}
      />
      <BottomNavigationAction
        label='New List'
        showLabel
        onClick={newClick}
        icon={<PlaylistAdd color='primary' />}
      />
    </BottomNavigation>
  );
};

const mapDispatchToProps = dispatch => {
  return {
    createNode: payload => dispatch(createNode('tasks', payload)),
    clearNodes: () => dispatch(clearNodes('tasks')),
    clearCompleted: () => dispatch(clearCompleted())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Footer);
