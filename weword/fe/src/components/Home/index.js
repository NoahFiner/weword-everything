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
      endpoint: process.env.NODE_ENV === "production" ? "https://weword.co" : "http://127.0.0.1:4001",
    };
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
      <div className="everything-outer home-screen">
        <Logo size='150' />
        <h1>We **wrote** a story with a bunch of random people online</h1>
        <p>WeWord was an experiment on the capabilities of the internet crowdsourcing stories.</p>
        <p>Unfortunately, 4chan is also a part of that internet.</p>
        <p>For now, <strong>WeWord has been put to rest.</strong> You can view archived stories below (before the 4chan raid) but <strong>may not submit any more words</strong>.</p>
        <p>(in the meantime, follow us at <a href="https://twitter.com/weword_co" className="link" target="_blank">@weword_co</a> or give <a className="link" target="_blank" href="https://docs.google.com/forms/d/e/1FAIpQLSdTaoCoy686evMyAnDO5djYzo3JxUpRk2UFRQIM7rZ8iR49sw/viewform?usp=sf_link">anonymous feedback</a>)</p>
        <hr></hr>
        <Login></Login>
          <TransitionGroup className="books-outer">
              {stories.sort((a, b) => {
                if (a.onlineCount === b.onlineCount) {
                  return a.length < b.length ? 1 : -1
                }
                return a.onlineCount < b.onlineCount ? 1 : -1;
              }).map((story, idx) => {
                return (<CSSTransition key={story._id} timeout={500} style={{transitionDelay: idx*50+'ms'}} classNames="story">
                  <Link to={"/stories/" + story._id}>
                    <Book story={story} />
                  </Link>
                </CSSTransition>)
              })}
              <CSSTransition key="create" timeout={stories.length*50+'ms'} style={{transitionDelay: stories.length*50+'ms'}} appear={true} classNames="story">
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
