import React, { Component } from 'react';

class Header extends Component {

  render() {
    const { coinObj: { marketCapUsd = 0, volumeUsd24Hr = 0 } } = this.props;
    return (
      <div className="main-header">
        <div className="text-wrapper">
          <div>Market Cap: {parseFloat(marketCapUsd).toFixed(2) || ''}</div>
          <div>Market Volume: {parseFloat(volumeUsd24Hr).toFixed(2) || ''}</div>
        </div>
        <div className="backbutton-wrapper"> <button className="btn-round btn btn-primary" type="button" onClick={this.props.backClick}> &lt; Back </button>
        </div>
      </div>)
  }
}

export default Header;
