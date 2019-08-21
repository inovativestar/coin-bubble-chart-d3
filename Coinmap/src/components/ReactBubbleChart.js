import React, { Component } from 'react';
import BubbleChart from '../modules/react-bubble-chart-d3';
import { connect } from 'react-redux';
import { showNode } from '../actions/coinActions';
import DetailHover from './DetailHover';
const mapStateToProps = state => {
    return {
        coin: state.coin
    }
}
class DetailHoverComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showHover: false
        }
    }
    bubbleClick(id) {
        if (id) {
            let symbol = id.replace('-', '_');
            this.props.dispatch(showNode(symbol))
        }
    }
    onHoverCircle(event) {

        // console.log("onHover",event);
        //this.setState({showHover: true});
    }
    onMouseOffCircle(event) {

        // console.log("offHover",event);
        // this.setState({showHover: false});
    }

    render() {
        console.log(this.state.showHover);
        const zoomLen = window.innerWidth < 999 ? parseFloat('0.' + window.innerWidth.toString()[0]) : 0.4;
        return (
            <div>
                <BubbleChart
                    graph={{
                        zoom: zoomLen,
                        offsetX: 0,
                        offsetY: 0,
                    }}
                    width={(window.innerWidth - 40) * 1.1}
                    height={1000}
                    showValue={true}
                    showLegend={false} // optional value, pass false to disable the legend.
                    legendPercentage={20} // number that represent the % of with that legend going to use.
                    legendFont={{
                        family: 'Arial',
                        size: 12,
                        color: '#000',
                        weight: 'bold',
                    }}
                    valueFont={{
                        family: 'Arial',
                        size: 12,
                        color: '#fff',
                        weight: 'bold',
                    }}
                    labelFont={{
                        family: 'Arial',
                        size: 16,
                        color: '#fff',
                        weight: 'bold',
                    }}

                    //Custom bubble/legend click functions such as searching using the label, redirecting to other page
                    bubbleClickFun={this.bubbleClick.bind(this)}
                    onMouseHoverCircle={this.onHoverCircle}
                    onMouseOffCircle={this.onMouseOffCircle}
                    data={this.props.data}
                />
                {
                    this.state.showHover &&
                    <DetailHover />
                }

            </div>

        );
    }
}

var styles = {
    overlay: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: 100,
        background: '#000',
        height: 100
    },
    changeType: {
        textAlign: 'center'
    }
};

export default connect(mapStateToProps)(DetailHoverComponent);