import React, {Component} from 'react';
import './LeftNavbar.scss';
import Logo from '../Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

class LeftNavbar extends Component {
  render() {
    const rules = this.props.story.rules;
    let showWordLength, showSentenceLength, showBannedWords, showBannedLetters, showCustomRules = false;
    if(this.props.story.customRules) {
      showWordLength = rules.minLength !== 1 || (rules.maxLength !== 16 && rules.maxLength !== 50);
      showSentenceLength = rules.minWords !== 1 || rules.maxWords !== 1;
      showBannedWords = rules.bannedWords.length > 0;
      showBannedLetters = rules.bannedCharacters.length > 0;
      showCustomRules = showWordLength || showSentenceLength || showBannedLetters || showBannedWords;
    }
    return (
      <div className="left-navbar">
        <Logo size='80' />
        <h1>{this.props.story.name}</h1>
        <p>{this.props.story.description}</p>
        {this.props.story.customRules && (
          <>
            <div className="divider"></div>
            <div className="rules">
              {showCustomRules && <h3><FontAwesomeIcon icon={faStar} className="icon" ></FontAwesomeIcon>Custom Rules</h3>}
              {showWordLength && <p>Words must be <span>{rules.minLength}-{rules.maxLength}</span> letters</p>}
              {showSentenceLength && <p>Submissions must be <span> {rules.minWords}-{rules.maxWords}</span> words</p>}
              {showBannedWords && <p>You cannot use <span>{rules.bannedWords.join(', ')}</span></p>}
              {showBannedLetters && <p>Words cannot contain <span>{rules.bannedCharacters.join(', ')}</span></p>}
            </div>
          </>
        )}
        <div className="divider"></div>
        <h3>Currently online</h3>
        {this.props.users.map((user, idx) => {
          return (
            <div className="user" key={'user' + idx}>
              <div className="online"></div>
              <p>{user}</p>
            </div>
          )
        })}
      </div>
    );
  }
}

export default LeftNavbar;
