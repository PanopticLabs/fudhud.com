import React, { Component } from "react";
import { Card, Typography } from '@material-ui/core';
import FudHudAreaChart from './charts/FudHudAreaChart';
import sizeMe from 'react-sizeme';


class TwitterFrequency extends Component {
  constructor() {
    super();
    this.state = { data: [], keys: [], xcoord: 'date', width:0 };
  }

  componentDidMount() {
    this.queryAPI(this.props)
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.size.width !== this.props.size.width){
      this.setState({width: nextProps.size.width})
    }
    if(nextProps.coinList !== this.props.coinList && this.props.coinList.length !== 0){
      this.queryAPI(nextProps)
    }
    if(nextProps.time !== this.props.time){
      this.queryAPI(nextProps)
    }
  }

  queryAPI(props) {
    const { coinList, time } = props
    let query = `https://api.panoptic.io/fudhud/frequency?data=twitter&time=${time}`
    coinList.forEach(function(item){
      query += `&topics[]=${item}`
    })
    fetch(query)
      .then(response => response.json())
      .then(json => {
        const frequency = json.data.frequency.map(row => (
          {...row,
            date : new Date(row.date.toString().substring(0,4), row.date.toString().substring(4,6)-1, row.date.toString().substring(6,8), row.date.toString().substring(8,10)).toLocaleString()
          }
        ))
        this.setState({ data: frequency, keys: coinList, width: this.props.size.width });
      })
  }

  render() {
    const { data, keys, xcoord, width } = this.state
    return (
      <Card>
        <Typography color='textSecondary' align="center" variant="subtitle1" component="h2" style={{marginTop:'20px', lineHeight:'35px'}}>
          Twitter Mention Frequency
        </Typography>
        <FudHudAreaChart
          data={data}
          keys={keys}
          xcoord={xcoord}
          width={width}
          height={300}
        />
      </Card>
    );
  }
}
export default sizeMe()(TwitterFrequency);
