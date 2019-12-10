import React, {Component} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import Story from  '../Story';
import Login from '../Login';
import Book from '../Book';
import Logo from '../Logo';
import axios from 'axios';
import './Home.scss';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {withRouter} from 'react-router';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      stories: [],
      // TODO THIS IS HELLA INSECURE
      endpoint: process.env.REACT_APP_API_URL || "http://127.0.0.1:4001",
    };
    console.log(process.env.NODE_ENV);
    console.log("API URL", process.env.REACT_APP_API_URL);
  }

  async componentDidMount() {
    const { endpoint } = this.state;
    try {
      const response = await axios.get(endpoint + "/stories");
      const stories = response.data.stories;
      this.setState({stories});
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    const stories = this.state.stories;
    return (
      <div className="everything-outer">
        <Logo size='150' />
        <h1>Write a story with a bunch of random people online</h1>
        <Login></Login>
          <TransitionGroup className="books-outer">
              {stories.sort((a, b) => {
                if (a.onlineCount === b.onlineCount) {
                  return a.length < b.length ? 1 : -1
               }
               return a.onlineCount < b.onlineCount ? 1 : -1;
              }).map((story, idx) => {
                return (<CSSTransition key={story._id} timeout={500} style={{transitionDelay: idx*25+'ms'}} classNames="story">
                  <Link to={"/stories/" + story._id}>
                    <Book story={story} />
                  </Link>
                </CSSTransition>)
              })}
              <CSSTransition key="create" timeout={stories.length*25+'ms'} style={{transitionDelay: stories.length*25+'ms'}} appear={true} classNames="story">
                <Link to="/create">
                  <Book create />
                </Link>
              </CSSTransition>
          </TransitionGroup>
      </div>
    );
  }
}

export default withRouter(Home);
