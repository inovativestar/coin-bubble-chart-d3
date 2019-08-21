import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { grey } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PageBase from "../atoms/PageBase";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { route } from "../../config"; 
import { withStyles } from "@material-ui/core/styles";

import { changePassword, logout } from '../../actions/auth';


class Account extends Component {
  constructor(props) {
    super(props);
    this.state = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
      isDirectory: false,
      open: false,
      message: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.auth.changePasswordSuccess == true && this.props.auth.changePasswordSuccess == false) {
        alert("Password changed successfully.");
    }else if(this.props.auth.changePasswordSuccess == false && nextProps.auth.isLoading == true && this.props.auth.isLoading == false) {
        alert("Invaild old password.");
    }
  }

  onSavePressed() {
    if(this.state.oldPassword == '' || this.state.newPassword == '' ) {
        alert("Please input all fields");
        return;
    }
    if( this.state.newPassword != this.state.confirmNewPassword){
        alert("Confirm password is not the same with password");
        return;
    }
    this.props.dispatch(changePassword(this.state.oldPassword, this.state.newPassword));

  }
  onLogoutPressed(){
    this.props.dispatch(logout());
    this.props.history.push(route.ROOT);
  }
  alert(message){
    this.setState({open: true, message})
  }
  handleClose(){
    this.setState({open:false})
  }

  render(){

    return (
      <div>
      <PageBase title="Change Password" navigation="Application / Account">
        <div>
           <TextField
              hintText="Old Password"
              label="Old Password"
              type="password"
              fullWidth={true}
              margin="normal"
              onChange={(event)=>{
                this.setState({oldPassword: event.target.value})
              }}
            />
         
          <TextField
            hintText="New Password"
            label="New Password"
            fullWidth={true}
            type="password"
            margin="normal"
            onChange={(event)=>{
              this.setState({newPassword: event.target.value})
            }}
          />  

          <TextField
            hintText="Confirm New Password"
            label="Confirm New Password"
            fullWidth={true}
            type="password"
            margin="normal"
            onChange={(event)=>{
              this.setState({confirmNewPassword: event.target.value})
            }}
          />  
            
          
          <Divider />
  
          <div style={styles.buttons}>
  
            <Button
              style={styles.saveButton}
              variant="contained"
              type="submit"
              color="primary"
              onClick={()=>this.onSavePressed()}
            >
              Save
            </Button>
          </div>
          <Dialog
            open={this.state.open}
            onClose={this.handleClose.bind(this)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">{"Wrong"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose.bind(this)} color="primary" autoFocus>
              Ok
            </Button>
          </DialogActions>
        </Dialog>
        </div>
      </PageBase>
      <div style={{display:'flex', alignItems:'center', justifyContent:'center', marginTop:20}}>
        <Button
            style={styles.logoutButton}
            variant="contained"
            type="submit"
            color="secondary"
            onClick={()=>this.onLogoutPressed()}
            >
            Log Out
        </Button>
       </div>
        </div>
    );
  }

}

const styles = {
  toggleDiv: {
    marginTop: 20,
    marginBottom: 5
  },
  toggleLabel: {
    color: grey[400],
    fontWeight: 100
  },
  buttons: {
    marginTop: 30,
    float: "right"
  },
  saveButton: {
    marginLeft: 5
  },
  saveButton: {
    marginTop: 10,
    align:'center'
  }
  
};

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(null, { withTheme: true })(Account)));
