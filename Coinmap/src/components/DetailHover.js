import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
const mapStateToProps = state => {
    return {
      coin: state.coin
    }
}

class DetailHover extends Component {

  render() {
      const { hidden, left, top, data} = this.props;
      return (

        <div style={styles.container}> 
          <div  style={styles.textStyle}>CRYPTOCURRENCIES</div>
          <div  style={styles.textStyle}>#Coins</div>
          <div  style={styles.textStyle}>Including</div>
        </div>
      );
    }
}
  
var styles = {
  container: {
    position: 'absolute', 
    left: 200, 
    top: 200, 
    width: 200, 
    height: 300, 
    backgroundColor: 'black',
    flexDirection: 'column'
  },
  textStyle: {
    padding: '5',
    marginLeft: '5',
    fontSize: '17',
    color: 'white',
    fontWeight: 'bold'
  }
};
export default connect(mapStateToProps)(DetailHover);