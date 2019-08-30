// /client/App.js
import React, { Component } from 'react';
import Nav from './components/Nav';
import Container from './components/Container';
import { fade,makeStyles } from '@material-ui/core/styles';
import Tag from './components/Tag';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import RestoreIcon from '@material-ui/icons/Restore';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import { ThemeProvider } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: 500,
  },

  secondNav:{
    backgroundColor: fade(theme.palette.common.primary, 0.15),
  }
}));


class App extends Component {
     Tag = () => {
      return <Tag />;
    }
  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    return (
     
      <div>
        <Nav />
      <Router>
        <div>
        <BottomNavigation
          showLabels
          className={useStyles.secondNav}>
        
          <Link to="/tags/">
            <BottomNavigationAction label="Recents" icon={<RestoreIcon />}></BottomNavigationAction>
          </Link>
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
          <nav>
          
          </nav>

          <Route path="/tags" component={Tag} />
        </div>
      </Router>


    

      </div>
    );
  }
}

export default App;