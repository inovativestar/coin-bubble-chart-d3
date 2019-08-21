import React, { Component } from 'react';
import { Link } from "react-router-dom";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import ContentCreate from "@material-ui/icons/Create";
import ContentAdd from "@material-ui/icons/Add";
import ContentDelete  from "@material-ui/icons/Delete";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

import PageBase from "../atoms/PageBase";
import Data from "../../data";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { route } from "../../config"; 


import { getHierarchyNode, removeHierarchyNode, getHierarchyNodeById } from '../../actions/hierarchy';
class Hierarchy extends Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      message: "",
      confirm_open:false,
      confirm_message:"",
      data:{}
    }
  }
  componentDidMount() {
    let symbolToOpen  = "root";
    if(this.props.hierarchy.currentNode)
      symbolToOpen = this.props.hierarchy.currentNode.symbol;
    console.log("symbolToOpen", symbolToOpen)
    this.props.dispatch(getHierarchyNode(symbolToOpen));
  }
  componentWillReceiveProps(nextProps) {
 
  }
  onAddPress = () => {
  }
  onOpenPressed(symbol) {
    if(!symbol) {
      this.alert("Symbol is not defined.");
      return;
    }
    this.props.dispatch(getHierarchyNode(symbol));
  }
  onDeletePressed(id) {
    if(!id) {
      this.alert("Id is not defined.");
      return;
    }
    this.confirmAlert("Do you really want to remove this node?",{id})

 
  }
  onBackPressed(){
    if(this.props.hierarchy.currentNode && this.props.hierarchy.currentNode.parent) {
      this.props.dispatch(getHierarchyNodeById(this.props.hierarchy.currentNode.parent))
    }
    
  }
  alert(message){
    this.setState({open: true, message})
  }
  confirmAlert(message, data){
    this.setState({confirm_open: true, confirm_message: message, data})
  }
  confirmAgree(){
    if(this.state.data.id)
    this.props.dispatch(removeHierarchyNode(this.state.data.id));
    this.setState({confirm_open:false, data: {}})
  }
  handleClose(){
    this.setState({open:false})
  }
  handleConfirmClose(){
    this.setState({confirm_open:false})
  }


  render(){
    const { hierarchy } = this.props;
    let children = hierarchy.currentNode && hierarchy.currentNode.children ? hierarchy.currentNode.children : [];
    return (
      <div>
        {
          this.props.hierarchy.currentNode && this.props.hierarchy.currentNode.parent &&
          <Button
            style={styles.saveButton}
            variant="contained"
            type="submit"
            color="primary"
            onClick={()=>this.onBackPressed()}
          >
          {'< Back'} 
          </Button>
        }

      <PageBase title={hierarchy.currentNode?hierarchy.currentNode.label: "Root"} navigation="Application / Hierarchy">
        <div>
          <Link to="/form">
            <Button
              mini={true}
              variant="fab"
              style={styles.floatingActionButton}
              color="secondary"
            >
              <ContentAdd />
            </Button>
          </Link>
  
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={styles.columns.id}>Symbol</TableCell>
                <TableCell style={styles.columns.name}>Label</TableCell>
                <TableCell style={styles.columns.directory}>Directory</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {children.map(item => (
                <TableRow key={item.symbol}>
                  <TableCell style={styles.columns.id}>{item.symbol}</TableCell>
                  <TableCell style={styles.columns.name}>{item.label}</TableCell>
                  <TableCell style={styles.columns.directory}>{item.isLeaf ? "No" : "Yes"}</TableCell>
                  <TableCell style={styles.columns.edit}>
                      {
                        hierarchy.currentNode && !item.isLeaf &&
                        <Button mini={true} variant="fab" onClick={()=>this.onOpenPressed(item.symbol)}>
                          <ContentCreate />
                        </Button>
                      }

                      <Button mini={true} variant="fab" onClick={()=>this.onDeletePressed(item._id)}>
                        <ContentDelete />
                      </Button>

                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
        <Dialog
            open={this.state.confirm_open}
            onClose={this.handleConfirmClose.bind(this)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
          <DialogTitle id="alert-dialog-title">{"Confirm"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.confirm_message}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleConfirmClose.bind(this)} color="primary" autoFocus>
              Cancel
            </Button>
            <Button onClick={this.confirmAgree.bind(this)} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        </div>
      </PageBase>
      </div>
    );
  }
}

const styles = {
  floatingActionButton: {
    margin: 0,
    top: "auto",
    right: 20,
    bottom: 20,
    left: "auto",
    position: "fixed"
  },
  columns: {
    id: {
      width: "30%"
    },
    name: {
      width: "40%"
    },
    directory: {
      width: "20%"
    },
    edit: {
      width: "10%"
    }
  }
};
const mapStateToProps = state => {
  return {
    hierarchy: state.hierarchy
  }
}
export default withRouter(connect(mapStateToProps)(withStyles(null, { withTheme: true })(Hierarchy)));
