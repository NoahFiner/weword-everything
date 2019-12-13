import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import './Story.scss';
import Footer from '../Footer';
import LeftNavbar from '../LeftNavbar';
import axios from 'axios';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {connect} from 'react-redux';
import moment from 'moment';

import * as Scroll from 'react-scroll';
import { animateScroll as scroll } from 'react-scroll';

const mapStateToProps = state => {
  return { name: state.name, loggedIn: state.loggedIn };
};

class ConnectedStory extends Component {
  constructor() {
    super();
    this.state = {
      story: {},
      words: [],
      // endpoint: process.env.REACT_APP_API_URL || "http://127.0.0.1:4001",
      endpoint: process.env.NODE_ENV === "production" ? "https://weword.co" : "http://127.0.0.1:4001",
      socket: null,
      users: [],
      disabled: false,
    };
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  async componentDidMount() {
    let {storyId} = this.props.match.params;

    let initialLoad = false;

    const {endpoint} = this.state;
    try {
      const response = await axios.get(endpoint + "/stories/" + storyId);
      const {story} = response.data;
      this.setState({story});

      const socket = socketIOClient(endpoint);
      this.setState({socket});


      socket.emit("join", {room: storyId, username: this.props.name}, error => {
        if(error) {
          alert(error);
          this.props.history.push('/');
        }
      });

      socket.on("sendWords", words => {
        this.setState({words});
        if(!initialLoad) {
          initialLoad = true;
          setTimeout(async () => {
            scroll.scrollToBottom();
          }, 750);
        }
      });

      socket.on("disable", data => {
        this.setState({disabled: true});
      });

      socket.on("enable", data => {
        this.setState({disabled: false});
      });

      socket.on("sendUsers", data => {
        this.setState({users: data});
      });
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    const {words} = this.state;
    return (
      <div>
        <LeftNavbar story={this.state.story} users={this.state.users} />
        <div className="content-outer">
          <div className="content">
            <TransitionGroup>
              {words.map((value, idx) => {
                const time = moment(value.createdAt).format("MM-DD-YYYY h:mm A");
                return (<CSSTransition key={"transition"+idx} timeout={500} classNames="word">
                  <>
                  <p key={idx} className="word">
                    {value.word}
                  </p>
                  <span className="user-view">
                    by <span className="bold">{value.author}</span> on {time}
                  </span>
                  </>
                </CSSTransition>)
              })}
              <div className="next-word"></div>
            </TransitionGroup>
          </div>
        </div>
        <Footer inactive={this.state.disabled} socket={this.state.socket} storyId={this.state.story._id} />
      </div>
    );
  }
}

const Story = connect(mapStateToProps)(ConnectedStory);

export default Story;
