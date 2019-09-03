// /client/App.js
import React, { Component } from 'react';
import Nav from './components/Nav';
import { fade, makeStyles } from '@material-ui/core/styles';
import Tag from './components/Tag';
import LogTask from './components/LogTask';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import AddBoxIcon from '@material-ui/icons/AddBox';
import LoyaltyIcon from '@material-ui/icons/Loyalty';
import Chart from 'react-apexcharts';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';


const useStyles = makeStyles(theme => ({
  root: {
    width: 500,
  },

  secondNav: {
    backgroundColor: fade(theme.palette.common.primary, 0.15),
  }
}));


class App extends Component {
  Tag = () => {
    return <Tag />;
  }

  LogTask = () => {
    return <LogTask />;
  }

  constructor(props) {
    super(props);

    this.state = {
      options: {
        chart: {
          id: 'apexchart-example'
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      series: [{
        name: 'series-1',
        data: []
      }],
      intervalIsSet: false,
      objectToUpdate: null,
      data: []
    }
  }


  // when component mounts, first thing it does is fetch all existing data in our db
  // then we incorporate a polling logic so that we can easily see if our db has
  // changed and implement those changes into our UI
  componentDidMount() {
    this.getDataFromDb();
    this.setData();
    if (!this.state.intervalIsSet) {
      let interval = setInterval(this.getDataFromDb, 100000);
      this.setState({ intervalIsSet: interval });
    }
  }

  // never let a process live forever
  // always kill a process everytime we are done using it
  componentWillUnmount() {
    if (this.state.intervalIsSet) {
      clearInterval(this.state.intervalIsSet);
      this.setState({ intervalIsSet: null });
    }
  }

  // just a note, here, in the front end, we use the id key of our data object
  // in order to identify which we want to Update or delete.
  // for our back end, we use the object id assigned by MongoDB to modify
  // data base entries

  // our first get method that uses our backend api to
  // fetch data from our data base
  getDataFromDb = () => {
    fetch('http://localhost:3001/api/getTagData')
      .then((data) => data.json())
      .then((res) => this.setState({ data: res.data }));
    this.setData();
  };

  setData() {
    let tempTag = [];
    this.state.data.map(e => tempTag.push(e.tag));

    //this.setState({series: {data: tempTag}})

  }


  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {

    return (

      <div>
        <Nav />
        <br />
        <Router>
        <Grid container spacing={3}>
        <Grid item xs={2}>
        <div>
            <List component="nav" aria-label="main mailbox folders">
              <Link to="/tags/">
                <ListItem button>
                  <ListItemIcon>
                    <LoyaltyIcon />
                  </ListItemIcon>
                  <ListItemText primary="Tags" />
                </ListItem>
              </Link>
              <Link to="/logTask/">
                <ListItem button>
                  <ListItemIcon>
                    <AddBoxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Add Log" />
                </ListItem>          </Link>


            </List>
            <Divider />
          </div>
        </Grid>
        <Grid item xs={10}>
            <Route path="/tags" component={Tag} />
            <Route path="/logTask" component={LogTask} />
        </Grid>
      </Grid>
          
        </Router>
        <Container maxWidth="sm">
          <Chart options={this.state.options} series={this.state.series} type="line" width={600} />
        </Container>



      </div>
    );
  }
}

export default App;