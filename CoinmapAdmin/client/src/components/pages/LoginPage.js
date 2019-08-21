import React, { Component } from 'react';
import MuiThemeProvider from "@material-ui/core/styles/MuiThemeProvider";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import { grey } from "@material-ui/core/colors";
import PersonAdd from "@material-ui/icons/PersonAdd";
import Help from "@material-ui/icons/Help";
import TextField from "@material-ui/core/TextField";
import {withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import { route } from "../../config"; 
import theme from "../../theme";

import {auth} from "../../actions/auth";
class LoginPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
        password: '',
        email: '',
        password_error: null,
        email_error: null 
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.login == true && this.props.auth.login == false) {
      this.props.history.push(route.ROOT);
    }
  }
  onLoginPress = () => {
    var {email, password} = this.state;
    let credential = {
      email,
      password
    }

    this.props.dispatch(auth(credential));

  }

  render(){
    return (
      <MuiThemeProvider theme={theme}>
        <div>
          <div style={styles.loginContainer}>
            <Paper style={styles.paper}>
              <form>
                <TextField 
                  hintText="E-mail" 
                  label="E-mail"
                  onChange={(event)=>{
                    this.setState({email: event.target.value})
                  }}
                  fullWidth={true} />
                <div style={{ marginTop: 16 }}>
                  <TextField
                    hintText="Password"
                    label="Password"
                    fullWidth={true}
                    type="password"
                    errorText="error"
                    onChange={(event)=>{
                      this.setState({password: event.target.value})
                    }}
                  />
                </div>
                <div style={styles.errorText}>
                    {this.props.auth.errorText}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Button
                      variant="contained"
                      color="primary"
                      style={styles.loginBtn}
                      onClick={()=>this.onLoginPress()}
                    >
                      Login
                  </Button>
                </div>
              </form>
            </Paper>
  
            <div style={styles.buttonsDiv}>
              <Button href="/forgetpassword" style={styles.flatButton}>
                <Help />
                <span style={{ margin: 5 }}>Forgot Password?</span>
              </Button>
            </div>
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

const styles = {
  loginContainer: {
    minWidth: 320,
    maxWidth: 400,
    height: "auto",
    position: "absolute",
    top: "20%",
    left: 0,
    right: 0,
    margin: "auto"
  },
  paper: {
    padding: 20,
    overflow: "auto"
  },
  buttonsDiv: {
    textAlign: "center",
    padding: 10
  },
  flatButton: {
    color: grey[500],
    margin: 5
  },
  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: 3
  },
  checkRemember: {
    style: {
      float: "left",
      maxWidth: 180,
      paddingTop: 5
    },
    labelStyle: {
      color: grey[500]
    },
    iconStyle: {
      color: grey[500],
      borderColor: grey[500],
      fill: grey[500]
    }
  },
  loginBtn: {
    float: "right"
  },
  btn: {
    background: "#4f81e9",
    color: "white",
    padding: 7,
    borderRadius: 2,
    margin: 2,
    fontSize: 13
  },
  btnFacebook: {
    background: "#4f81e9"
  },
  btnGoogle: {
    background: "#e14441"
  },
  btnSpan: {
    marginLeft: 5
  }
};
const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}
export default withRouter(connect(mapStateToProps)(LoginPage));
