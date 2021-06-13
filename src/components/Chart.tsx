// this comment tells babel to convert jsx to calls to a function called jsx instead of React.createElement
/** @jsxRuntime classic */
/** @jsx jsx */

import * as React from 'react';
import { createChart, BarData, IChartApi } from 'lightweight-charts';
import axios from 'axios';
import ClipLoader from "react-spinners/ClipLoader";
import { css, jsx } from '@emotion/react'

interface IChartProps{
    symbol: string;
}

const override = css` 
  display: block;
  margin: 0 auto;
  border-color: blue;
`;

const chartProterties = {
  width:1200,
  height:800,
  timeScale:{
      timeVisible:true,
      secondsVisible:false,
  }
}

const defaultData: BarData[] = [];

const chartDiv = document.createElement('div')
chartDiv.setAttribute("id", 'tvchart')

const chart = createChart(chartDiv, chartProterties);

chart.applyOptions({
  crosshair: {
      mode: 0,
  },
});

const candleSeries = chart.addCandlestickSeries();

export default function Chart(props: IChartProps){

    const [data, setData]: [BarData[], (data: BarData[]) => void] = React.useState(defaultData);

    //TODO loading code is duplicated in all components. figure smth out
    const [isLoading, setLoading]: [boolean, (loading: boolean) => void] = React.useState<boolean>(true);

    React.useEffect(() => {
        setLoading(true);

        axios
        
        .get<BarData[]>(`https://localhost:5001/api/CandleStick/GetAllData?symbol=${props.symbol}&timeFrame=1d`, {
          headers: {
            "Content-Type": "application/json"
          }
        })
        .then(response => {
          setData(response.data)

          candleSeries.setData(response.data)

          setLoading(false);
        })
        .catch(ex => {
          if (ex.response) {
            // client received an error response (5xx, 4xx)
          } else if (ex.request) {
            // client never received a response, or request never left
          } else {
            // anything else
          }
          setLoading(false);
        });
      }, [props.symbol]);

      return <div>
        {isLoading 
          ? <ClipLoader loading={isLoading} css={override}  size={300}/>
          : <div ref={(nodeElement) => {nodeElement && nodeElement.appendChild(chartDiv)}}/>}
      </div>
}