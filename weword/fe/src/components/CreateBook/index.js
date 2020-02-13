import React, {Component} from 'react';
import Logo from '../Logo';
import axios from 'axios';
import './CreateBook.scss';
import {withRouter} from 'react-router';

import ReactGA from 'react-ga';

class CreateBook extends Component {
  constructor() {
    super();
    this.state = {
      title: '',
      description: '',
      error: null,
      rulesShown: false,
      minLength: 1,
      maxLength: 16,
      minWords: 1,
      maxWords: 1,
      bannedCharacters: '',
      bannedWords: '',
      endpoint: process.env.NODE_ENV === "production" ? "https://weword.co" : "http://127.0.0.1:4001",
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleRulesShown = this.toggleRulesShown.bind(this);
  }

  toggleRulesShown(event) {
    event.preventDefault();
    this.setState({rulesShown: !this.state.rulesShown});
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
      error: null,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    const params = {
      name: this.state.title,
      description: this.state.description,
      rules: {
        minLength: this.state.minLength,
        maxLength: this.state.maxLength,
        minWords: this.state.minWords,
        maxWords: this.state.maxWords,
        bannedWords: this.state.bannedWords,
        bannedCharacters: this.state.bannedCharacters,
      }
    }
    // we need to use == instead of === because of int to string comparisons
    if(!(
      this.state.minLength == 1 && this.state.maxLength == 16
      && this.state.maxWords == 1 && this.state.minWords == 1
      && this.state.bannedWords.length === 0
      && this.state.bannedCharacters.length === 0
    )) params.customRules = true;
    try {
      const {data} = await axios.post(this.state.endpoint + '/create', null, {params});
      ReactGA.pageview("/stories/create");
      ReactGA.event({
        category: "Users",
        action: "Book creation",
      });
      this.props.history.push('/stories/' + data.story._id);
    } catch(error) {
      if(error.response) {
        this.setState({error: error.response.data.message});
      } else {
        this.setState({error: "Error in creating your story"});
      }
    }
  }

  render() {
    return (
      <div className="everything-outer">
        <Logo size='150' />
        <h1>Let's start something great</h1>
        <form onSubmit={this.handleSubmit}>
          <label>
            Title
            <span>Think of something short and sweet</span>
          </label>
          <input type="text" name="title" value={this.state.title} onChange={this.handleInputChange} />

          <label>
            Description
            <span>What's this thing even about?</span>
          </label>
          <input type="text" name="description" value={this.state.description} onChange={this.handleInputChange} />
          <div className="input-button" onClick={this.toggleRulesShown}>Add custom rules</div>
          <div className="rules-outer" style={{display: this.state.rulesShown ? 'block' : 'none'}}>
          <label>
              Submission length
              <span>How many words can each person add a time?</span>
            </label>
            Minimum words: <input min="1" max="16" type="number" name="minWords" value={this.state.minWords} onChange={this.handleInputChange} />
            Maximum words: <input min="1" max="16" type="number" name="maxWords" value={this.state.maxWords} onChange={this.handleInputChange} />

            
            <label>
              Word length
              <span>How long can each word be?</span>
            </label>
            Minimum characters: <input min="1" max="16" type="number" name="minLength" value={this.state.minLength} onChange={this.handleInputChange} />
            Maximum characters: <input min="1" max="16" type="number" name="maxLength" value={this.state.maxLength} onChange={this.handleInputChange} />

            <label>
              Banned words
              <span>Separate any banned words with spaces or commas</span>
            </label>
            <input type="text" name="bannedWords" value={this.state.bannedWords} onChange={this.handleInputChange} />

            <label>
              Banned characters
              <span>Separate any banned characters with spaces or commas</span>
            </label>
            <input type="text" name="bannedCharacters" value={this.state.bannedCharacters} onChange={this.handleInputChange} />

          </div>
          <input type="submit" value="Submit" />
          <p className="error" style={{display: (this.state.error ? "block" : "none")}}>{this.state.error && this.state.error.split(':')[this.state.error.split(':').length - 1]}</p>
        </form>
      </div>
    );
  }
}

export default withRouter(CreateBook);
