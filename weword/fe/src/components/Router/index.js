import React, {Component} from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Story from  '../Story';
import Home from '../Home';
import CreateBook from '../CreateBook';
import './RouterOuter.scss';

class RouterOuter extends Component {

  componentWillMount() {
    document.title = 'WeWord';
  }

  render() {
    return (
      <div className="outer">
        <Router>
          <Switch>
            <Route path="/create" component={CreateBook} />
            <Route path="/stories/:storyId" component={Story} />
            <Route path="/" component={Home} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default RouterOuter;
