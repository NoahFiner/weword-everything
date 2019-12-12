import React, {Component} from 'react';
import './Login.scss';
import {connect} from 'react-redux'
import {login, logout} from '../../redux/actions';

const mapStateToProps = state => {
  return { name: state.name, loggedIn: state.loggedIn };
};

function mapDispatchToProps(dispatch) {
  return {
    login: name => dispatch(login(name)),
    logout: () => dispatch(logout())
  };
}


class ConnectedLogin extends Component {
  constructor() {
    super();
    this.state = {
      typedName: '',
      error: null,
      // endpoint: process.env.REACT_APP_API_URL || "http://127.0.0.1:4001",
      endpoint: process.env.NODE_ENV === "production" ? "http://localhost:4001" : "http://127.0.0.1:4001",
    };

    console.log("API URL", process.env.REACT_APP_API_URL);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.value;

    this.setState({
      typedName: value,
      error: null,
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    if(this.props.loggedIn) {
      this.props.logout();
    } else {
      this.props.login(this.state.typedName);
    }

    this.setState({ typedName: "" });
    console.log(this.props.loggedIn);

    // try {
    //   const {data} = await axios.post(this.state.endpoint + '/create', null, {params});
    //   this.props.history.push('/stories/' + data.story._id);
    // } catch(error) {
    //   console.log(error);
    //   this.setState({error: JSON.stringify(error)});
    // }
  }

  render() {
    return (
      <form id="login" onSubmit={this.handleSubmit}>
        {this.props.loggedIn ? (
          <>
          <h2>Writing as {this.props.name}</h2>
          <input type="submit" value="Log out" />
          </>
        ) : (
          <>
            <input type="text" name="name" placeholder="what's your name?" value={this.state.typedName} onChange={this.handleInputChange} />
            <input type="submit" value="Log in" />
            <p className="error" style={{display: (this.state.error ? "block" : "none")}}>Couldn't log in as that user</p>
          </>
        )}
      </form>
    );
  }
}

const Login = connect(mapStateToProps, mapDispatchToProps)(ConnectedLogin);

export default Login;