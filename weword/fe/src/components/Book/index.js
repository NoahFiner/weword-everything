import React, {Component} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import './Book.scss';

class Book extends Component {
  render() {
    console.log(this.props.story);
    return (
      <div className={"book-outer " + (this.props.create ? "create" : "")}>
        {
          this.props.create ? (
            <div className="book-single">
              <h1>create a new story</h1>
              <FontAwesomeIcon icon={faPlusCircle} className="create-book" ></FontAwesomeIcon>
            </div>
          ) : (
            <>
              <div className="book-header">
                <h1>{this.props.story.name}</h1>
                <p>{this.props.story.description}</p>
              </div>
              <div className="book-footer">
                <p>{this.props.story.length} words</p>
                <div className="online-outer">
                  <div className={this.props.story.onlineCount ? "online" : ""}></div>
                  <p className={this.props.story.onlineCount ? "online-text" : ""}>{this.props.story.onlineCount} writers online</p>
                </div>
              </div>
            </>
          )
        }
      </div>
    );
  }
}

export default Book;
