import React from "react";
import {
  Form,
  FormGroup,
  Input,
  Label,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  CardFooter,
  Row,
  Col
} from "reactstrap";

import {withRouter} from 'react-router-dom';
import { connect } from "react-redux";
import { route } from "../../config"; 
import { changePassword, logout } from '../../actions/auth';
import NotificationAlert from "react-notification-alert";
import { PanelHeader, Button } from "components";

class Account extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      register: {
        passwordState: "",
        oldPasswordState: "",
        confirmState: "",
        fullNameState: "",
        oldPassword: "",
        password: "",
        confirm: "",
        fullName: ""
      },
    };
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.changePasswordSuccess == true && this.props.auth.changePasswordSuccess == false) {
      this.notify("success", "Password changed successfully.")  
    }else if(this.props.auth.changePasswordSuccess == false && nextProps.auth.isLoading == true && this.props.auth.isLoading == false) {
      this.notify("warning", "Invalid old password.")    
  
    }
  }
  registerEmail(e) {
    var register = this.state.register;
    register["email"] = e.target.value;
    var emailRex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailRex.test(e.target.value)) {
      register["emailState"] = "has-success";
    } else {
      register["emailState"] = "has-danger";
    }
    this.setState({ register });
  }

  notify(type, message) {
    var options = {};
    options = {
      place: "tr",
      message: (
        <div>
          <div>
            {message}
          </div>
        </div>
      ),
      type: type,
      icon: "now-ui-icons ui-1_bell-53",
      autoDismiss: 7
    };
    this.refs.notificationAlert.notificationAlert(options);
  }
  registerPassword(e) {
    var register = this.state.register;
    register["password"] = e.target.value;
    if (e.target.value.length > 0) {
      register["passwordState"] = "has-success";
    } else {
      register["passwordState"] = "has-danger";
    }
    if (register["password"] === register["confirm"]) {
      register["confirmState"] = "has-success";
    } else {
      register["confirmState"] = "has-danger";
    }
    this.setState({ register });
  }
  registerOldPassword(e) {
    var register = this.state.register;
    register["oldPassword"] = e.target.value;
    if (e.target.value.length > 0) {
      register["oldPasswordState"] = "has-success";
    } else {
      register["oldPasswordState"] = "has-danger";
    }
    this.setState({ register });
  }
  registerConfirm(e) {
    var register = this.state.register;
    register["confirm"] = e.target.value;
    if (register["password"] === register["confirm"]) {
      register["confirmState"] = "has-success";
    } else {
      register["confirmState"] = "has-danger";
    }
    this.setState({ register });
  }
  registerSubmit(e) {
    var register = this.state.register;
    if (register["oldPasswordState"] !== "has-success")
      register["oldPasswordState"] = "has-danger";
    if (register["passwordState"] !== "has-success")
      register["passwordState"] = "has-danger";
    if (register["confirmState"] !== "has-success")
      register["confirmState"] = "has-danger";
    this.setState({ register });

    if(register["oldPasswordState"] === "has-success" && 
       register["passwordState"] === "has-success" && 
       register["confirmState"] === "has-success"
      )
    this.props.dispatch(changePassword(this.state.register.oldPassword, this.state.register.password));
  }
  onLogoutPressed(){
    this.props.dispatch(logout());
    this.props.history.push(route.ROOT);
  }
  render() {
    return (
      <div>
        <PanelHeader size="sm" />
        <div className="content">
          <NotificationAlert ref="notificationAlert" />
          <Row>
            <Col xs={12}>
              <Form>
                <Card>
                  <CardHeader>
                    <CardTitle tag="h4">Change Password</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <FormGroup
                        className={
                          "has-label " + this.state.register.oldPasswordState
                        }
                      >
                      <Label>Old Password *</Label>
                      <Input
                        type="password"
                        onChange={e => this.registerOldPassword(e)}
                      />
                    </FormGroup>
                    <FormGroup
                      className={
                        "has-label " + this.state.register.oldPasswordState
                      }
                    >
                      <Label>Password *</Label>
                      <Input
                        type="password"
                        onChange={e => this.registerPassword(e)}
                      />
                    </FormGroup>
                    <FormGroup
                      className={
                        "has-label " + this.state.register.confirmState
                      }
                    >
                      <Label>Confirm Password *</Label>
                      <Input
                        type="password"
                        onChange={e => this.registerConfirm(e)}
                      />
                    </FormGroup>
                    <div className="category form-category">
                      * Required fields
                    </div>
                  </CardBody>
                  <CardFooter className="text-right">
                    <Button
                      color="primary"
                      onClick={e => this.registerSubmit(e)}
                    >
                      Save
                    </Button>
                  </CardFooter>
                </Card>
              </Form>
            </Col>
            <Col  className="text-center">
              <Button
                    round
                    color="danger"
                    onClick={()=>this.onLogoutPressed()}
                  >
                  Log Out
              </Button>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
      auth: state.auth
    }
  }
  
  export default withRouter(connect(mapStateToProps)(Account));
