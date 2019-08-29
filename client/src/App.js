// /client/App.js
import React, { Component } from 'react';
import Nav from './components/Nav';
import Container from './components/Container';
import Tag from './components/Tag';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
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
        <Container />
        <Router>
        <div>
          <nav>
          <Link to="/tags/">See Tags</Link>
          </nav>

          <Route path="/tags" component={Tag} />
        </div>
      </Router>
        

      </div>
    );
  }
}

export default App;