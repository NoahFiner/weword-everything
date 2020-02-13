import React, {Component} from 'react';
import './LeftNavbar.scss';
import Logo from '../Logo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';

class LeftNavbar extends Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true}

    this.toggleNavbar = this.toggleNavbar.bind(this);
  }

  toggleNavbar() {
    this.setState({collapsed: !this.state.collapsed});
  }

  render() {
    const rules = this.props.story.rules;
    let showWordLength, showSentenceLength, showBannedWords, showBannedLetters, showCustomRules = false;
    if(this.props.story.customRules) {
      // Due to types disagreeing (strings vs ints), we need to use != instead of !== (not a good look :/)
      showWordLength = rules.minLength != 1 || (rules.maxLength != 16 && rules.maxLength != 50);
      showSentenceLength = rules.minWords != 1 || rules.maxWords != 1;
      showBannedWords = rules.bannedWords.length > 0;
      showBannedLetters = rules.bannedCharacters.length > 0;
      showCustomRules = showWordLength || showSentenceLength || showBannedLetters || showBannedWords;
    }
    let hasCustomRules = showWordLength || showSentenceLength || showBannedWords || showBannedLetters || showCustomRules;
    
    return (
      <div className={"left-navbar " + (this.state.collapsed ? "collapsed" : "")}>
        <FontAwesomeIcon icon={faAngleDoubleRight} className="sidebar-toggle" onClick={this.toggleNavbar}></FontAwesomeIcon>
        <div className="left-content">
          <Logo size='80' />
          <h1>{this.props.story.name}</h1>
          <p>{this.props.story.description}</p>
          {hasCustomRules && (
            <>
              <div className="divider"></div>
              <div className="rules">
                {showCustomRules && <h3><FontAwesomeIcon icon={faStar} className="icon" ></FontAwesomeIcon>Custom Rules</h3>}
                {showSentenceLength && <p>Submissions must be <span> {rules.minWords === rules.maxWords ? rules.minWords : rules.minWords + '-' + rules.maxWords}</span> words</p>}
                {showWordLength && <p>Words must be <span>{rules.minLength}-{rules.maxLength}</span> letters</p>}
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
      </div>
    );
  }
}

export default LeftNavbar;
