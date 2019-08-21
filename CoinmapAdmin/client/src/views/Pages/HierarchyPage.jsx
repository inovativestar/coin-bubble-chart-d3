import React from "react";
import {
  Table,
  UncontrolledTooltip,
  ButtonGroup,
  FormGroup,
  Label,
  Input,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Row,
  Col
} from "reactstrap";

import { PanelHeader, Button } from "components";
import SweetAlert from "react-bootstrap-sweetalert";
import { withRouter } from 'react-router-dom';
import { connect } from "react-redux";
import { route } from "../../config"; 
import { getHierarchyNode, removeHierarchyNode, getHierarchyNodeById, editHierarchyNode } from '../../actions/hierarchy';


class Hierarchy extends React.Component {
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
    this.props.dispatch(editHierarchyNode(null));
    this.props.history.push(route.FORM_ROUTE);
  }
  onEditPress = (node) => {
    this.props.dispatch(editHierarchyNode(node));
    this.props.history.push(route.FORM_ROUTE);
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

  render() {
    const { hierarchy } = this.props;
    let children = hierarchy.currentNode && hierarchy.currentNode.children ? hierarchy.currentNode.children : [];
    return (
      <div>
        <PanelHeader size="sm" />
        <div className="content">
          <Row>
            <Col xs={12}>
              
              {
                this.props.hierarchy.currentNode && this.props.hierarchy.currentNode.parent &&
                <Button
                  round
                  color="primary"
                  onClick={()=>this.onBackPressed()}
                >
                {'< Back'} 
                </Button>
              }
              <div className="text-right">
                <Button
                  round
                  color="success"
                  onClick={()=>this.onAddPress()}
                 >
                {'Add'} 
                </Button>
              </div>


              <Card>
                <CardHeader>
                  <CardTitle tag="h4">{hierarchy.currentNode?hierarchy.currentNode.label: "Root"}</CardTitle>
                </CardHeader>
                <CardBody>
                  <Table responsive>
                    <thead>
                      <tr className="text-primary">

                        <th>Symbol</th>
                        <th>Label</th>
                        <th>Directory</th>
                      </tr>
                    </thead>
                    <tbody>
                    {children.map(item => (
                      <tr>
                        <td>{item.symbol}</td>
                        <td>{item.label}</td>
                        <td>{item.isLeaf ? "No" : "Yes"} </td>
                        <td className="text-right">
                          {
                            hierarchy.currentNode && !item.isLeaf &&
                            <Button icon color="info" size="sm" onClick={()=>this.onOpenPressed(item.symbol)}>
                              <i className="now-ui-icons arrows-1_minimal-right" />
                            </Button>
                          }
                          {" "}
                          <Button icon color="success" size="sm" onClick={()=>this.onEditPress(item)}>
                            <i className="now-ui-icons ui-2_settings-90" />
                          </Button>{" "}
                          <Button icon color="danger" size="sm" onClick={()=>this.onDeletePressed(item._id)}>
                            <i className="now-ui-icons ui-1_simple-remove" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>
            </Col>
            
          </Row>
          {
            this.state.confirm_open &&
            <SweetAlert 
              warning
              showCancel
              confirmBtnText="Yes, delete it!"
              confirmBtnBsStyle="danger"
              cancelBtnBsStyle="default"
              title="Confirm"
              onConfirm={this.confirmAgree.bind(this)}
              onCancel={this.handleConfirmClose.bind(this)}
            >
              Do you really want to delete this node?
            </SweetAlert>
          }

          
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
export default withRouter(connect(mapStateToProps)(Hierarchy));

