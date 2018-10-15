import { formatTime, parseTime } from '../utils'

export default {
    name: 'b-table-time',
    props: {
        value: null,
        disabledTime: {
            type: Function,
            default: () => {
                return false
            }
        },
        timePickerOptions: {
            type: [Object, Function],
            default: () => {
                return null
            }
        },
        minuteStep: {
            type: Number,
            default: 0,
            validator: val => val >=0 && val <= 60
        },
        timeType: {
            type: Array,
            default: () => {
                return ['24', 'a']
            }
        }
    },
    computed: {
        curHours() {
            return this.value ? new Date(this.value).getHours() : 0
        },
        curMinutes() {
            return this.value ? new Date(this.value).getMinutes() : 0
        },
        curSeconds() {
            return this.value ? new Date(this.value).getSeconds() : 0
        }
    },
    methods: {
        stringifyText(value) {
            return ('00' + value).slice(String(value).length)
        },
        selectTime(time) {
            if (!this.disabledTime(time)) {
                console.log('time', time)
                this.$emit('select', new Date(time))
            }
        },
        pickTime(time) {
            if (!this.disabledTime(time)) {
                this.$emit('pick', new Date(time))
            }
        },
        getTimeSelectOptions() {
            let result = []
            let options = this.timePickerOptions

            if (!options) {
                return []
            }

            if (typeof options === 'function') {
                return options() || []
            }

            let { start, end, step } = options
            start = parseTime(start)
            end = parseTime(end)
            step = parseTime(step)

            if (start && end && step) {
                let startMinutes = start.minutes + start.hours * 60
                let endMinutes = end.minutes + end.hours * 60
                let stepMinutes = step.minutes + step.hours * 60
                let len = Math.floor((endMinutes - startMinutes) / stepMinutes)
                for(let i = 0; i <= len; i ++) {
                    let timeMinutes = startMinutes + i * stepMinutes
                    let hours = Math.floor(timeMinutes / 60)
                    let minutes = timeMinutes % 60
                    let value = { hours, minutes }
                    result.push({
                        value,
                        label: formatTime(value, ...this.timeType)
                    })
                }
            }
            return result
        }
    },
    render(h) {
        let date = new Date(this.value)
        let disabledTime = typeof this.disabledTime === 'function' && this.disabledTime
        let pickers = this.getTimeSelectOptions()

        if (Array.isArray(pickers) && pickers.length) {
            return (
                <div class="b-panel b-panel-time">
                    <ul class="b-time-list">
                        {
                            pickers = pickers.map(picker => {
                                let { hours, minutes } = picker.value
                                let time = new Date(date).setHours(hours, minutes, 0)
                                return (
                                    <li
                                        class={{
                                            'b-time-picker-item': true,
                                            cell: true,
                                            actived: hours === this.curHours && minutes === this.curMinutes,
                                            disabled: 'disabledTime && disabledTime(time)'
                                        }}
                                        onClick={() => this.pickTime(time)}>
                                        {picker.label}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
            )
        }
        // 小时
        let hours = Array.apply(null, { length: 24 }).map((_, i) => {
            let time = new Date(date).setHours(i)

            return (
                <li
                    class={{
                        cell: true,
                        actived: i === this.curHours,
                        disabled: disabledTime && disabledTime(time)
                    }}
                    onClick={() => this.selectTime(time)}>
                    {this.stringifyText(i)}
                </li>
            )
        })
        // 分钟
        let step = this.minuteStep || 1
        let length = parseInt(60 / step)
        let minutes = Array.apply(null, { length }).map((_, i) => {
            let value = i * step
            let time = new Date(date).setMinutes(value)

            return (
                <li
                    class={{
                        cell: true,
                        actived: value === this.curMinutes,
                        disabled: disabledTime && disabledTime(time)
                    }}
                    onClick={() => this.selectTime(time)}>
                    {this.stringifyText(value)}
                </li>
            )
        })
        // 秒
        let seconds = Array.apply(null, { length: 60 }).map((_, i) => {
            let time = new Date(date).setSeconds(i)

            return(
                <li
                    class={{
                        cell: true,
                        actived: i === this.curSeconds,
                        disabled: disabledTime && disabledTime(time)
                    }}
                    onClick={() => this.selectTime(time)}>
                    {this.stringifyText(i)}
                </li>
            )
        })

        let times = [hours, minutes]
        if (this.minuteStep === 0) {
            times.push(seconds)
        }

        return (
            <div class="b-panel b-panel-time">
                {
                    times.map(list => {
                        return (
                            <ul 
                                class='b-time-list' 
                                style={{ width: 100 / times.length + '%' }}>
                                {list}
                            </ul>
                        )
                    })
                }
            </div>
        )
    }
}