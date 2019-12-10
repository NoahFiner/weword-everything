import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import './Story.scss';
import Footer from '../Footer';
import LeftNavbar from '../LeftNavbar';
import axios from 'axios';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import {connect} from 'react-redux';

const mapStateToProps = state => {
  return { name: state.name, loggedIn: state.loggedIn };
};

class ConnectedStory extends Component {
  constructor() {
    super();
    this.state = {
      story: {},
      words: [],
      endpoint: process.env.REACT_APP_API_URL || "http://127.0.0.1:4001",
      socket: null,
      users: [],
      disabled: false,
    };
    console.log(process.env.NODE_ENV);
    console.log("API URL", process.env.REACT_APP_API_URL);
  }

  componentWillUnmount() {
    this.state.socket.close();
  }

  async componentDidMount() {
    let {storyId} = this.props.match.params;
    const {endpoint} = this.state;
    try {
      const response = await axios.get(endpoint + "/stories/" + storyId);
      const {story} = response.data;
      console.log(story);
      this.setState({story});

      const socket = socketIOClient(endpoint);
      this.setState({socket});

      console.log(this.props.name + " is joining");

      socket.emit("join", {room: storyId, username: this.props.name}, error => {
        if(error) {
          alert(error);
          this.props.history.push('/');
        }
      });

      socket.on("sendWords", words => {
        console.log("gettings sent words", words);
        this.setState({words});
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
    console.log(words);
    return (
      <div>
        <LeftNavbar story={this.state.story} users={this.state.users} />
        <div className="content-outer">
          <div className="content">
            <TransitionGroup>
              {words.map((value, idx) => {
                return (<CSSTransition timeout={500} classNames="word">
                  <p key={idx} className="word">{value.word}</p>
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
