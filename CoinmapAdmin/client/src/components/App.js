import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import Main from "./pages/Main";
import Login from "./pages/LoginPage";
import ForgetPassword from "./pages/ForgetPasswordPage"
import PrivateRoute from "./molecules/PrivateRoute";
class App extends React.Component {

    render() {
       const { history } = this.props;
        return(
          <Router history={history}>
            <Switch>
              <Route exact path="/login" component={Login} />
              <Route exact path="/forgetpassword" component={ForgetPassword} />
              <PrivateRoute path="/" component={Main} />
            </Switch>
          </Router>
        );
    }
}

export default connect()(App);