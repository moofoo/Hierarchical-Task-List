import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/ToolBar';
import Typography from '@material-ui/core/Typography';

const Header = () => {
  return (
    <div style={{ flex: '0 0 auto' }}>
      <AppBar>
        <Toolbar>
          <Typography variant='h6'>Task List</Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Header;
