// imports ----c----------------------------

import React from "react"

import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"
import { ComponentProps } from "streamlit-component-lib/dist/StreamlitReact"

const jalaali = require('jalaali-js')

// types -----------------------------------

type Year = number
type Month = number
type Day = number
type DateFormat = [Year, Month, Day]

const Y = 0
const M = 1
const D = 2

type State = {
  is_active: boolean
  selected: DateFormat
}

type Props = {
  selected: DateFormat
  start: DateFormat
  end: DateFormat
  close_on_select_day: boolean
}

type SelectFn = (y: number, m: number, d: number, what: number) => void


// math utils ----------------------------

function inRange(n: number, a: number, b: number): boolean {
  return a <= n && n <= b
}

function range(head: number, tail: number): number[] {
  let acc = []
  for (let i = head; i <= tail; i++)
    acc.push(i)
  return acc
}

// jalali utils ----------------------------
function isLeapYear(year: number): boolean {
  return jalaali.isLeapJalaaliYear(year)
}

function daysOfMonth(year: number, month: number): number {
  if (inRange(month, 1, 6)) return 31
  else if (inRange(month, 7, 11)) return 30
  else if (month === 12) return isLeapYear(year) ? 30 : 29
  else throw new Error(`Invalid month: ${month}`)
}

// React things ----------------------------

function drawer(selected: DateFormat, head: DateFormat, tail: DateFormat, onSelect: SelectFn) {
  let years =
    range(head[Y], tail[Y])

  let months = (year: number) =>
    range(
      year === head[Y] ? head[M] : 1,
      year === tail[Y] ? tail[M] : 12)

  let days = (year: number, month: number) =>
    range(
      year === head[Y] && month === head[M] ? head[D] : 1,
      year === tail[Y] && month === tail[M] ? tail[D] : daysOfMonth(year, month))

  let clsx = (cond: boolean) =>
    "pointer item " + (cond ? "active" : "")

  return <div className="d-flex select">
    <div className="year-list sec">
      {
        years.map(
          y => <div
            onClick={() => onSelect(y, selected[M], selected[D], Y)}
            className={clsx(y === selected[Y])}>
            {y}
          </div>
        )
      }
    </div>
    <div className="month-list sec">
      {
        months(selected[Y]).map(
          m => <div
            onClick={() => onSelect(selected[Y], m, selected[D], M)}
            className={clsx(m === selected[M])}>
            {m}
          </div>
        )
      }
    </div>
    <div className="day-list sec">
      {
        days(selected[Y], selected[M]).map(
          d => <div
            onClick={() => onSelect(selected[Y], selected[M], d, D)}
            className={clsx(d === selected[D])}>
            {d}
          </div>
        )
      }
    </div>
  </div>
}

class MyComponent extends StreamlitComponentBase<State, Props> {

  constructor(props: any) {
    super(props)

    this.state = {
      is_active: false,
      selected: (props as ComponentProps<Props>).args.selected
    }

    this.onChange = this.onChange.bind(this)
    this.toggle = this.toggle.bind(this)
  }

  toggle() {
    this.setState({ is_active: !this.state.is_active })
  }

  render() {
    // let { theme } = this.props
    let { start, end } = this.props.args
    let { selected } = this.state

    return <div className="wrapper">
      <div className="bg input pointer" onClick={this.toggle}>
        <span>
          {selected.join(' - ')}
        </span>
      </div>

      {this.state.is_active &&
        <div className="center">
          {drawer(selected, start, end, this.onChange)}
        </div>
      }
    </div>
  }

  private onChange(y: number, m: number, d: number, which: number) {
    let date = [y, m, d] as DateFormat
    this.setState({
      selected: date,
      is_active:
        this.props.args.close_on_select_day &&
        !(which === D)
    })
    Streamlit.setComponentValue(date)
  }
}

// Export ----------------------------------

export default withStreamlitConnection(MyComponent)
