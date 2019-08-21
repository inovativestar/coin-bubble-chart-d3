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
import { createHierarchyNode, updateHierarchyNode } from '../../actions/hierarchy';
import { Link } from "react-router-dom";

class FormPage extends React.Component {
  constructor(props) {
    super(props);


    const { hierarchy } = this.props;
    if(!hierarchy.selectedNode) {
      this.state = {
        symbolState: "",
        labelState: "",
        symbol: "",
        description : "",
        label: "",
        isDirectory: false
      }
    }
    else
    {
      this.state = {
        symbolState:"has-success",
        labelState:"has-success",
        symbol: hierarchy.selectedNode.symbol || '',
        label : hierarchy.selectedNode.label || '',
        description : hierarchy.selectedNode.description || '',
        isDirectory: !(hierarchy.selectedNode.isLeaf) ,
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.hierarchy.success == true && this.props.hierarchy.success == false) {
        this.props.history.push(route.HIERARCHY_ROUTE);
      }else if(nextProps.hierarchy.isLoading == false && this.props.hierarchy.isLoading == true && this.props.hierarchy.success == false) {
        this.notify("warning", "The Node already exists.")
      }
  }

  onEditPressed() {
    const { hierarchy } = this.props;
    let nodeData = {};
    if(this.state.label === '') {
      this.notify("warning", "Please input Label.")
      return;
    }
    if(!hierarchy.currentNode || !hierarchy.currentNode._id || hierarchy.currentNode._id == '') {
      this.notify("warning", "Parent is not defined. Please open from hierarchy.")
      return;
    }

    if(hierarchy.selectedNode.isLeaf) {
      if(this.state.symbol === '') {
        this.notify("warning", "Please input Symbol.")
        return;
      }
      nodeData = {
        symbol : this.state.symbol,
        label: this.state.label,
        description : this.state.description ,
        isLeaf : hierarchy.selectedNode.isLeaf,
        parent: hierarchy.currentNode._id
      }
    }else {
      nodeData = {
        label: this.state.label,
        description : this.state.description,
        isLeaf : hierarchy.selectedNode.isLeaf,
        parent: hierarchy.currentNode._id
      }
    }

    this.props.dispatch(updateHierarchyNode(hierarchy.selectedNode._id,nodeData));
  }

  onCreatePressed() {
    const { hierarchy } = this.props;
    let nodeData = {};
    if(this.state.label === '') {
      this.notify("warning", "Please input Label.")
      return;
    }
    if(!hierarchy.currentNode || !hierarchy.currentNode._id || hierarchy.currentNode._id == '') {
      this.notify("warning", "Parent is not defined. Please open from hierarchy.")
      return;
    }
    if(this.state.isDirectory) {
      nodeData = {
        label: this.state.label,
        description : this.state.description ,
        isLeaf : !this.state.isDirectory,
        parent: hierarchy.currentNode._id
      }

    }else {
      if(this.state.symbol === '') {
        this.notify("warning", "Please input Symbol.")
        return;
      }
      nodeData = {
        symbol : this.state.symbol,
        label: this.state.label,
        description : this.state.description ,
        isLeaf : !this.state.isDirectory,
        parent: hierarchy.currentNode._id
      }
    }

    this.props.dispatch(createHierarchyNode(nodeData));

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
  changeSymbol(e) {
    var {symbolState, symbol} = this.state;
    symbol = e.target.value;
    if (e.target.value.length > 0) {
        symbolState = "has-success";
    } else {
        symbolState = "has-danger";
    }
    this.setState({ symbol, symbolState });
  }

  changeLabel(e) {
    var {labelState, label} = this.state;
    label = e.target.value;
    if (e.target.value.length > 0) {
        labelState = "has-success";
    } else {
        labelState = "has-danger";
    }
    this.setState({ label, labelState });
  }

  changeDescription(e) {
    var description = e.target.value;
    this.setState({ description });
  }

  render() {
    const { hierarchy } = this.props;
    let selectedNode = hierarchy.selectedNode;
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
                    <CardTitle tag="h4">{selectedNode ? "Edit Node" : "Create Node"} </CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div>
                        Parent: {hierarchy.currentNode? hierarchy.currentNode.label : "Root"}
                    </div>
                    {
                        ((!selectedNode && !this.state.isDirectory) || (selectedNode && selectedNode.isLeaf)) &&
                        <FormGroup
                            className={
                            "has-label " + this.state.symbolState
                            }
                        >
                        <Label>Symbol </Label>
                        <Input
                            type="text"
                            onChange={e => this.changeSymbol(e)}
                            value={this.state.symbol}
                        />
                        </FormGroup>
                    }

                    <FormGroup
                      className={
                        "has-label " + this.state.labelState
                      }
                    >
                      <Label>Label </Label>
                      <Input
                        type="text"
                        onChange={e => this.changeLabel(e)}
                        value={this.state.label}
                      />
                    </FormGroup>

                    <FormGroup
                      className={
                        "has-label has-success"
                      }
                    >
                      <Label>Description</Label>
                      <Input
                        type="text"
                        onChange={e => this.changeDescription(e)}
                        value={this.state.description}
                      />
                    </FormGroup>


                    {
                        !selectedNode &&
                        <FormGroup check className="pull-left">
                            <Label check>
                            <Input type="checkbox"
                                onChange={(event)=>{
                                    this.setState({isDirectory: event.target.checked})
                                }}
                                value={this.state.isDirectory} />
                            <span className="form-check-sign" />
                            Directory
                            </Label>
                        </FormGroup>

                    }


                  </CardBody>
                  <CardFooter className="text-right">
                    <Link to="/hierarchy">
                        <Button color="primary">Cancel</Button>
                    </Link>
                    {" "}
                    {
                    !selectedNode ?
                        <Button
                        color="success"
                        onClick={()=>this.onCreatePressed()}
                        >
                        Add
                        </Button>
                    :
                        <Button
                        color="success"
                        onClick={()=>this.onEditPressed()}
                        >
                        Edit
                        </Button>
                    }
                  </CardFooter>
                </Card>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
    return {
      hierarchy: state.hierarchy
    }
  }

export default withRouter(connect(mapStateToProps)(FormPage));
