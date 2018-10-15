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
        selectTime(time) {
            if (!this.disabledTime(time)) {
                this.$emit('select', new Date(time))
            }
        },
        pickTime(time) {
            if (!this.disabledTime(time)) {
                this.$emit('select', new Date(time))
            }
        },
        getTimeSelectOptions() {
            let result = []
            let options = this.timePickerOptions

            if (typeof options === 'function') {
                return options()
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

    }
}