import React from 'react'
import ReactEcharts from 'echarts-for-react'

const Humidity = React.createClass({
  propTypes: {
  },
  timeTicket: null,
  count: 51,
  getInitialState () {
    return { option: this.getOption() }
  },
  fetchNewDate () {
    let axisData = (new Date()).toLocaleTimeString().replace(/^\D*/, '')
    let option = this.state.option
    // option.title.text = `Hello Echarts-for-react.${new Date().getSeconds()}`
    let data0 = option.series[0].data
    // let data1 = option.series[1].data
    data0.shift()
    data0.push(Math.round(Math.random() * 100))
    // data1.shift()
    // data1.push((Math.random() * 10 + 5).toFixed(1) - 0)

    option.xAxis[0].data.shift()
    option.xAxis[0].data.push(axisData)
    // option.xAxis[1].data.shift()
    // option.xAxis[1].data.push(this.count += 1)
    this.setState({ option })
  },
  componentDidMount () {
    if (this.timeTicket) {
      clearInterval(this.timeTicket)
    }
    this.timeTicket = setInterval(this.fetchNewDate, 1000)
  },
  componentWillUnmount () {
    if (this.timeTicket) {
      clearInterval(this.timeTicket)
    }
  },
  getOption () {
    const option = {
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        data: ['最新成交价', '湿度队列'],
      },
      toolbox: {
        show: true,
        feature: {
          dataView: { readOnly: false },
          restore: {},
          saveAsImage: {},
        },
      },
      grid: {
        top: 60,
        left: 30,
        right: 60,
        bottom: 30,
      },
      dataZoom: {
        show: false,
        start: 0,
        end: 100,
      },
      visualMap: {
        show: false,
        min: 0,
        max: 1000,
        color: ['#BE002F', '#F20C00', '#F00056', '#FF2D51', '#FF2121', '#FF4C00', '#FF7500',
          '#FF8936', '#FFA400', '#F0C239', '#FFF143', '#FAFF72', '#C9DD22', '#AFDD22',
          '#9ED900', '#00E500', '#0EB83A', '#0AA344', '#0C8918', '#057748', '#177CB0'],
      },
      xAxis: [
        {
          type: 'category',
          boundaryGap: true,
          data: (function () {
            let now = new Date()
            let res = []
            let len = 50
            while (len--) {
              res.unshift(now.toLocaleTimeString().replace(/^\D*/, ''))
              now = new Date(now - 2000)
            }
            return res
          }()),
        },
        // {
        //   type: 'category',
        //   boundaryGap: true,
        //   data: (function () {
        //     let res = []
        //     let len = 50
        //     while (len--) {
        //       res.push(50 - len + 1)
        //     }
        //     return res
        //   }()),
        // },
      ],
      yAxis: [
        {
          type: 'value',
          scale: true,
          name: '湿度',
          max: 100,
          min: 1,
          boundaryGap: [0.2, 0.2],
        },
        // {
        //   type: 'value',
        //   scale: true,
        //   name: '预购量',
        //   max: 1200,
        //   min: 0,
        //   boundaryGap: [0.2, 0.2],
        // },
      ],
      series: [
        {
          name: '湿度队列',
          type: 'bar',
          xAxisIndex: 0,
          yAxisIndex: 0,
          itemStyle: {
            normal: {
              barBorderRadius: 4,
            },
          },
          animationEasing: 'elasticOut',
          animationDelay (idx) {
            return idx * 10
          },
          animationDelayUpdate (idx) {
            return idx * 10
          },
          data: (function () {
            let res = []
            let len = 50
            while (len--) {
              res.push(Math.round(Math.random() * 100))
            }
            return res
          }()),
        },
        /*{
          name: '最新成交价',
          type: 'line',
          data: (function () {
            let res = []
            let len = 0
            while (len < 50) {
              res.push((Math.random() * 10 + 5).toFixed(1) - 0)
              len++
            }
            return res
          }()),
        },*/
      ],
    }

    return option
  },
  render () {
    return (
      <div className="examples">
        <div className="parent">
          <ReactEcharts ref="echarts_react"
            option={this.state.option}
            style={{ height: 400 }}
          />
        </div>
      </div>
    )
  },
})

export default Humidity
