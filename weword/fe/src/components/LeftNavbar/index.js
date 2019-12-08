import React, {Component} from 'react';
import './LeftNavbar.scss';
import Logo from '../Logo';

class LeftNavbar extends Component {
  render() {
    return (
      <div className="left-navbar">
        <Logo size='80' />
        <h1>{this.props.story.name}</h1>
        <p>{this.props.story.description}</p>
        <div className="divider"></div>
        <h3>Currently online</h3>
        {this.props.users.map((user, idx) => {
          return (
            <div className="user" key={'user' + idx}>
              <div class="online"></div>
              <p>{user}</p>
            </div>
          )
        })}
      </div>
    );
  }
}

export default LeftNavbar;
