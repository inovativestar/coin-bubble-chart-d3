import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  Form,
  Container,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText
} from "reactstrap";

import { Button } from "components";

import nowLogo from "assets/img/now-logo.png";

import bgImage from "assets/img/bg14.jpg";

import {withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import { route } from "../../config"; 
import { auth } from "../../actions/auth";

class LoginPage extends React.Component {

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
      var message = "Login Success";
      var options = {};
      options = {
        place: "tr",
        message: message,
        type: "info",
        icon: "now-ui-icons ui-1_bell-53",
        autoDismiss: 7
      };
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

  render() {
    return (
      <div>
        <div className="full-page-content">
          <div className="login-page">
            <Container>
              <Col xs={12} md={8} lg={4} className="ml-auto mr-auto">
                <Form>
                  <Card className="card-login card-plain">
                    <CardBody>
                      <InputGroup
                        className={
                          "no-border form-control-lg " +
                          (this.state.firstnameFocus ? "input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons ui-1_email-85" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          placeholder="Email..."
                          onFocus={e => this.setState({ emailFocus: true })}
                          onBlur={e => this.setState({ emailFocus: false })}
                          onChange={(event)=>{
                            this.setState({email: event.target.value})
                          }}
                        />
                      </InputGroup>
                      <InputGroup
                        className={
                          "no-border form-control-lg " +
                          (this.state.lastnameFocus ? "input-group-focus" : "")
                        }
                      >
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="now-ui-icons ui-1_lock-circle-open" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password..."
                          onFocus={e => this.setState({ passwordFocus: true })}
                          onBlur={e => this.setState({ passwordFocus: false })}
                          onChange={(event)=>{
                            this.setState({password: event.target.value})
                          }}
                        />
                      </InputGroup>
                      <div style={styles.errorText}>
                          {this.props.auth.errorText}
                      </div>
                    </CardBody>


                    <CardFooter>
                      <Button
                        block
                        round
                        color="primary"
                        size="lg"
                        href="#pablo"
                        className="mb-3"
                        onClick={()=>this.onLoginPress()}
                      >
                        Sign In
                      </Button>
                    </CardFooter>
                  </Card>
                </Form>
              </Col>
            </Container>
          </div>
        </div>
        <div
          className="full-page-background"
          style={{ backgroundImage: "url(" + bgImage + ")" }}
        />
      </div>
    );
  }
}

const styles = {
  errorText: {
    color: "red",
    fontSize: 10,
    marginTop: 3
  }
}
const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}
export default withRouter(connect(mapStateToProps)(LoginPage));
