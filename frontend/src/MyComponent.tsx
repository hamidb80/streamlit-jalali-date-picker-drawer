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
  joiner: string
  show_when: "click" | "hover"
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

function cmpArray(a: number[], b: number[]): number {
  let size = Math.min(a.length, b.length)

  for (let i = 0; i < size; i++) {
    if (a[i] > b[i]) return +1
    if (a[i] < b[i]) return -1
  }
  return 0
}

function isMoreThan(a: number[], b: number[]): boolean {
  return cmpArray(a, b) === +1
}

function isLessThan(a: number[], b: number[]): boolean {
  return cmpArray(a, b) === -1
}

function isLessEqThan(a: number[], b: number[]): boolean {
  return !isMoreThan(a, b)
}
function isMoreEqThan(a: number[], b: number[]): boolean {
  return !isLessThan(a, b)
}

// React things ----------------------------

function int2str(n: number) {
  return n >= 10 ? `${n}` : `0${n}`
}

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
            {int2str(y)}
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
            {int2str(m)}
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
            {int2str(d)}
          </div>
        )
      }
    </div>
  </div>
}

function atleast2(n: number): string {
  return (n < 10) ? `0${n}` : `${n}`
}

function form_date(date: number[], joiner: string): string {
  return date.map(atleast2).join(joiner)
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
    this.open = this.open.bind(this)
    this.close = this.close.bind(this)

    this.mouseEnterHandler = this.mouseEnterHandler.bind(this)
    this.mouseLeaveHandler = this.mouseLeaveHandler.bind(this)
    this.mouseClickHandler = this.mouseClickHandler.bind(this)
  }


  open() {
    this.setState({ is_active: true })
  }

  close() {
    this.setState({ is_active: false })
  }

  toggle() {
    this.setState({ is_active: !this.state.is_active })
  }


  mouseEnterHandler() {
    if (this.props.args.show_when === 'hover')
      this.open()
  }

  mouseClickHandler() {
    if (this.props.args.show_when === 'click')
      this.toggle()
  }

  mouseLeaveHandler() {
      this.close()
  }

  render() {
    // let { theme } = this.props
    let { start, end, joiner } = this.props.args
    let { selected } = this.state

    if (isLessThan(selected, start))
      this.setState({selected: start})

    if (isLessThan(end, selected))
      this.setState({selected: end})

    return <div className="wrapper" onMouseLeave={this.mouseLeaveHandler}>
      <div className="bg input pointer" onMouseEnter={this.mouseEnterHandler} onClick={this.mouseClickHandler}>
        <span>
          {form_date(selected, joiner)}
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
