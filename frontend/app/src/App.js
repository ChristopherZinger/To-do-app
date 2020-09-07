import React, { Component } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom';
import AuthMenu from './components/auth/AuthMenu/AuthMenu';
import Navbar from './components/Navbar/Navbar';
import TodoMenu from './components/todo/TodoMenu/TodoMenu';
import Jumbotron from './components/Jumbotron/Jumbotron';
import { auth, authEmiter, } from './utils/auth/auth';
import axios from 'axios';


class App extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // try to get access token with refresh token
    if (!auth.isAuth) {
      this.handleGetNewAccessToken();
    }
  }

  handleGetNewAccessToken() {
    console.log(
      '[APP.js]token before login \n',
      axios.defaults.headers.common['authorization']
    )
    const url = '/get-new-access-token';
    axios.get(url)
      .then(res => {
        const { accessToken, expirationPeriod } = res.data.auth;
        auth.login(accessToken, expirationPeriod);
      })
      .catch(err => {
        if (err.response && err.response.status === 401) console.log('You need to log in.')
        console.log(err)
      })
  }

  render() {
    return (
      <div className="App">
        <Router>
          <Navbar />

          <div className='container'>
            <br /> <br /> <br />

            <Route path='/' exact component={() => < Jumbotron />} />

            <Switch>
              <Route path="/auth"
                component={(props) => <AuthMenu {...props} />}
              />
              <Route path="/todo-menu" component={(c_props) => <TodoMenu {...c_props} />} />
            </Switch>

          </div>
        </Router>

      </div >
    );
  }
}


export default App;
