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

import { createHierarchyNode } from '../../actions/hierarchy';

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      symbol: '',
      label: '',
      isDirectory: false,
      open: false,
      message: ""
    }
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.hierarchy.success == true && this.props.hierarchy.success == false) {
      this.props.history.push(route.HIERARCHY_ROUTE);
    }else if(nextProps.hierarchy.isLoading == false && this.props.hierarchy.isLoading == true && this.props.hierarchy.success == false) {
      this.alert("The Node is already exists.")
    }
  }

  onCreatePressed() {
    const { hierarchy } = this.props;
    let nodeData = {};
    if(this.state.label === '') {
      this.alert("Please input Label.");
      return;
    }
    if(!hierarchy.currentNode || !hierarchy.currentNode._id || hierarchy.currentNode._id == '') {
      this.alert("Parent is not defined. Please open from hierarchy.");
      return;
    }
    if(this.state.isDirectory) {
      nodeData = {
        label: this.state.label,
        isLeaf : !this.state.isDirectory,
        parent: hierarchy.currentNode._id
      }

    }else {
      if(this.state.symbol === '') {
        this.alert("Please input Symbol.");
        return;
      }
      nodeData = {
        symbol : this.state.symbol,
        label: this.state.label,
        isLeaf : !this.state.isDirectory,
        parent: hierarchy.currentNode._id
      }
    }
    
    this.props.dispatch(createHierarchyNode(nodeData));

  }

  alert(message){
    this.setState({open: true, message})
  }
  handleClose(){
    this.setState({open:false})
  }

  render(){
    const { hierarchy } = this.props;
    return (
      <PageBase title="Create Node" navigation="Application / Create Node">
        <div>
          Parent: {hierarchy.currentNode? hierarchy.currentNode.label : "Root"}
          {
            !this.state.isDirectory && 
            <TextField
              hintText="Symbol"
              label="Symbol"
              fullWidth={true}
              margin="normal"
              onChange={(event)=>{
                this.setState({symbol: event.target.value})
              }}
            />
          }

          <TextField
            hintText="Label"
            label="Label"
            fullWidth={true}
            margin="normal"
            onChange={(event)=>{
              this.setState({label: event.target.value})
            }}
          />  
          
          
          <div style={styles.toggleDiv}>
            <FormControlLabel control={<Switch />} 
                              onChange={(event, checked)=>{
                                this.setState({isDirectory: checked})
                              }} 
                              label="Directory" 
                              value={this.state.isDirectory} />
          </div>
          <Divider />
  
          <div style={styles.buttons}>
            <Link to="/hierarchy">
              <Button variant="contained">Cancel</Button>
            </Link>
  
            <Button
              style={styles.saveButton}
              variant="contained"
              type="submit"
              color="primary"
              onClick={()=>this.onCreatePressed()}
            >
              Add
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
  }
};

const mapStateToProps = state => {
  return {
    hierarchy: state.hierarchy
  }
}

export default withRouter(connect(mapStateToProps)(withStyles(null, { withTheme: true })(Form)));
