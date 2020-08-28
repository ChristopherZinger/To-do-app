import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import AuthMenu from './components/auth/AuthMenu/AuthMenu';
import { connect } from 'react-redux';
import Navbar from './components/Navbar/Navbar';
import TodoMenu from './components/todo/TodoMenu/TodoMenu';
import Cookies from 'js-cookie';
import axios from 'axios';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: null,
    }
  }


  componentDidMount() {
    // check if cookies includes token and adjust isAuth State 
    const accessToken = Cookies.get('accessToken');
    if (accessToken === '') {
      this.setState({ isAuth: false });
    } else {
      this.setState({ isAuth: true });
      axios.defaults.headers.common['authorization'] = 'AUTH ' + accessToken;
    }
  }

  handleLogin() {
    this.setState({ isAuth: true })
  }

  handleLogout() {
    this.setState({ isAuth: false })
  }


  render() {
    return (
      <div className="App">
        <Router>
          <Navbar isAuth={this.state.isAuth} login={this.handleLogin.bind(this)} logout={this.handleLogout.bind(this)} />

          <div className='container'>
            <Switch>
              <Route path="/auth"
                component={(props) => <AuthMenu {...props} login={this.handleLogin.bind(this)} />}
              />
              <Route path="/todo-menu" component={(c_props) => <TodoMenu {...c_props} isAuth={this.state.isAuth} />} />
            </Switch>
          </div>
        </Router>

      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    accessToken: state.auth.accessToken,
  }
}

export default connect(mapStateToProps)(App);
