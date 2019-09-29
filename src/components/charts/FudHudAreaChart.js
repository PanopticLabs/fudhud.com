import React, { Component } from 'react';
import {
  AreaChart, Area, XAxis, Legend, Tooltip,
} from 'recharts';
import chroma from 'chroma-js';

export default function FudHudAreaChart(props){
  const { data, keys, xcoord, width, height} = props
  const palette = chroma.scale(['navy', '#e5bf02']).mode('lch').colors(keys.length)

  return (
    <div style={{width: `${width-60}px`}}>
      <AreaChart
        width={width+30}
        height={height-40}
        data={data}
        margin={{
          top: 10, right: 30, left: 0, bottom: 0,
        }}
      >
        <defs>
          {keys.map((key, index) => (
            <linearGradient key={index} id={`color${index}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={chroma(palette[index]).saturate(2)} stopOpacity={1}/>
              <stop offset="95%" stopColor={palette[index]} stopOpacity={0.25}/>
            </linearGradient>
          ))}
        </defs>
        <XAxis dataKey={xcoord} hide={true}/>
        <Tooltip />
        <Legend verticalAlign="top"/>
        {keys.map((key, index) => (
          <Area type="monotone" key={index} dataKey={key} stackId={index} stroke={palette[index]} fill={`url(#color${index})`} fillOpacity={1}/>
        ))}
      </AreaChart>
    </div>
  )
}
