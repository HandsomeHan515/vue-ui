import { formatDate } from '../utils'
import Languages from '../locale/language'

export default {
    name: 'b-table-date',
    props: {
        value: null,
        startAt: {
            type: String,
            default: null
        },
        endAt: {
            type: String,
            default: null
        },
        dateFormat: {
            type: String,
            default: 'YYYY-MM-DD'
        },
        month: {
            type: Number,
            default: new Date().getMonth()
        },
        year: {
            type: Number,
            default: new Date().getFullYear()
        },
        firstDayOfWeek: {
            type: Number,
            default: 7,
            validator: val => val >= 1 && val <= 7
        },
        disabledDate: {
            type: Function,
            default: () => {
                return false
            }
        }
    },
    methods: {
        selectDate({ year, month, day }) {
            let date = new Date(year, month, day)
            if (!this.disabledDate(date)) {
                this.$emit('select', date)
            }
        },
        getDays(firstDayOfWeek) {
            let { days } = Languages.zh
            let firstDay = parseInt(firstDayOfWeek, 10)
            return days.concat(days).slice(firstDay, firstDay + 7)
        },
        getDates(year, month, firstDayOfWeek) {
            let arr = []
            let time = new Date(year, month)

            time.setDate(0) // 上月最后一天
            let lastMonthLenth = (time.getDay() + 7 - firstDayOfWeek) % 7 + 1
            let lastMonthFirst = time.getDate() - (lastMonthLenth - 1)
            for(let i = 0; i < lastMonthLenth; i ++) {
                arr.push({ year, month: month - 1, day: lastMonthFirst + i })
            }

            time.setMonth(time.getMonth() + 2, 0) // 当前月最后一天
            let curMonthLength = time.getDate()
            for(let i = 0; i < curMonthLength; i ++) {
                arr.push({ year, month, day: i + 1 })
            }

            time.setMonth(time.getMonth() + 1, 1) // 下个月第一天
            let nextMonth = 42 - (lastMonthLenth + curMonthLength)
            for(let i = 0; i < nextMonth; i ++) {
                arr.push({ year, month: month + 1, day: i + 1 })
            }

            return arr
        },
        getCellClasses({ year, month, day }) {
            let classes = []
            let cellTime = new Date(year, month, day).getTime()
            let today = new Date().setHours(0, 0, 0, 0)
            let curTime = this.value && new Date(this.value).setHours(0, 0, 0, 0)
            let startTime = this.startAt && new Date(this.startAt).setHours(0, 0, 0, 0)
            let endTime = this.endAt && new Date(this.endAt).setHours(0, 0, 0, 0)

            if (month < this.month) {
                classes.push('last-month')
            } else if (month > this.month) {
                classes.push('next-month')
            } else {
                classes.push('cur-month')
            }

            if (cellTime === today) {
                classes.push('today')
            }

            if (this.disabledDate(cellTime)) {
                classes.push('disabled')
            }

            if (curTime) {
                if (cellTime === curTime) {
                    classes.push('actived')
                } else if (startTime && cellTime <= curTime) {
                    classes.push('inrange')
                } else if (endTime && cellTime >= curTime) {
                    classes.push('inrange')
                }
            }
            return classes
        },
        getCellTitle({ year, month, day }) {
            return formatDate(new Date(year, month, day), this.dateFormat)
        }   
    },
    render(h) {
        let days = this.getDays(this.firstDayOfWeek)
        let dates = this.getDates(this.year, this.month, this.firstDayOfWeek)

        return (
            <table class="b-panel b-panel-date">
                <thead>
                    {
                        days.map(day => {
                            return (
                                <th>{day}</th>
                            )
                        })
                    }
                </thead>
                <tbody>
                    {
                        Array.apply(null, { length: 6 }).map((week, i) => {
                            return (
                                <tr>
                                    {
                                        dates.slice(7 * i, 7 * i + 7).map(date => {
                                            let attrs = { class: this.getCellClasses(date) }

                                            return (
                                                <td
                                                    class="cell"
                                                    {...attrs}
                                                    title={this.getCellTitle(date)}
                                                    onClick={() => this.selectDate(date)}>
                                                    {date.day}
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}