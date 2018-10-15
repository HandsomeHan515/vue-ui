<template>
    <div class="b-calendar">
        <div class="b-calendar-header">
            <a
                v-show="panel === 'YEAR'"
                class="b-current-year">
                {{yearHeader}}
            </a>
        </div>
        <div class="b-calendar-content">
            <year-pane
                :value='value'
                :disabled-year='isDisabledYear'
                :first-year='firstYear'
                @select="selectYear" />
        </div>
    </div>
</template>

<script>
import { isValidDate, isDateObject, formatDate } from '../utils'
import Languages from '../locale/language'
import ScrollIntoView from '../utils/scroll-into-view'
import YearPane from './year'
import MonthPane from './month'
import DatePane from './date'

export default {
    name: 'b-panel',
    components: { YearPane, MonthPane, DatePane },
    props: {
        value: {
            default: null,
            validator: val => {
                return val === null || isValidDate(val)
            }
        },
        startAt: null,
        endAt: null,
        visible: {
            type: Boolean,
            default: false
        },
        type: {
            type: String,
            default: 'date'
        },
        dateFormat: {
            type: String,
            default: 'YYYY-MM-DD'
        },
        firstDayOfWeek: {
            type: Number,
            default: 7,
            validator: val => val >=1 && val <= 7
        },
        notBefore: {
            default: null,
            validator: function (val) {
                return !val || isValidDate(val)
            }
        },
        notAfter: {
            default: null,
            validator: function (val) {
                return !val || isValidDate(val)
            }
        },
        disabledDays: {
            type: [Array, Function],
            default: function () {
                return null
            }
        },
        minuteStep: {
            type: Number,
            default: 0,
            validator: val => val >= 0 && val <= 60
        },
        timePickerOptions: {
            type: [Object, Function],
            default () {
                return null
            }
        }
    },
    data() { 
        let _date = new Date()
        let year = _date.getFullYear()
        let month = _date.getMonth()
        let firstYear = Math.floor(year / 10) * 10

        return {
            panel: 'NONE',
            dates: [],
            year,
            month,
            firstYear
        }
    },
    computed: {
        now: {
            get() {
                return new Date(this.year, this.month).getTime()
            },
            set(val) {
                let _date = new Date(val)
                this.year = _date.getFullYear()
                this.month = _date.getMonth()
            }
        },
        timeType() {
            let h = /h+/.test(this.$parent.format) ? '12' : '24'
            let a = /A/.test(this.$parent.format) ? 'A' : 'a'
            return [h, a]
        },
        months() {
            return Languages.zh.months
        },
        yearHeader() {
            return this.firstYear + ' ~ ' + (this.firstYear + 10)
        },
        timeHeader() {
            if (this.type === 'time') {
                return this.$parent.format
            }
            return this.value && formatDate(this.value, this.dateFormat)
        }
    },
    watch: {
        value: {
            immediate: true,
            handler: 'updateNow'
        },
        visible: {
            immediate: true,
            handler: 'init'
        },
        panel: {
            handler: 'handelPanelChange'
        }
    },
    methods: {
        updateNow(val) {
            this.now = val ? new Date(val) : new Date()
        },
        init(val) {
            if (val) {
                switch (this.type) {
                    case 'year':
                        this.panel = 'YEAR'
                        break
                    case 'month':
                        this.panel = 'MONTH'
                        break
                    case 'date':
                        this.panel = 'DATE'
                        break
                    case 'time':
                        this.panel = 'TIME'
                }
            }
            this.updateNow(this.value)
        },
        handelPanelChange(panel, oldPanel) {
            this.$emit('panel-change', panel, oldPanel)
            if (panel === 'YEAR') {
                this.firstYear = Math.floor(this.year / 10) * 10
            } else if (panel === 'TIME') {
                this.$nextTick(() => {
                    let list = this.$el.querySelectorAll('.b-panel-time .b-time-list')
                    for (let i = 0, len = list.length; i < len; i++) {
                        const el = list[i]
                        scrollIntoView(el, el.querySelector('.actived'))
                    }
                })
            }
        },
        selectDate(date) {
            this.$emit('select-date', date)
        },
        changeYear (year) {
            this.now = new Date(year, this.month)
        },
        selectYear (year) {
            this.changeYear(year)
            if (this.type.toLowerCase() === 'year') {
                return this.selectDate(new Date(this.now))
            }
            this.panel = 'MONTH'
        },
        changeMonth(month) {
            this.now = new Date(this.year, month)
        },
        selectMonth (month) {
            this.changeMonth(month)
            if (this.type.toLowerCase() === 'month') {
                return this.selectDate(new Date(this.now))
            }
            this.panel = 'DATE'
        },
        selectTime (time) {
            this.$emit('select-time', time, false)
        },
        pickTime (time) {
            this.$emit('select-time', time, true)
        },
        inBefore (time, startAt) {
            startAt = startAt || this.startAt
            return (this.notBeforeTime && time < this.notBeforeTime) || (startAt && time < this.getCriticalTime(startAt))
        },
        inAfter (time, endAt) {
            endAt = endAt || this.endAt
            return (this.notAfterTime && time > this.notAfterTime) || (endAt && time > this.getCriticalTime(endAt))
        },
        inDisabledDays (time) {
            if (Array.isArray(this.disabledDays)) {
                return this.disabledDays.some(v => this.getCriticalTime(v) === time)
            } else if (typeof this.disabledDays === 'function') {
                return this.disabledDays(new Date(time))
            }
            return false
        },
        isDisabledYear (year) {
            let time = new Date(year, 0).getTime()
            let maxTime = new Date(year + 1, 0).getTime() - 1
            return this.inBefore(maxTime) || this.inAfter(time) || (this.type === 'year' && this.inDisabledDays(time))
        }
    }
}
</script>