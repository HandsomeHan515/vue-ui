<template>
    <div class="b-calendar">
        <div class="b-calendar-header">
            <a
                v-show="panel !== 'TIME'"
                class="b-icon-last-year"
                @click="handleIconYear(-1)">
                &laquo;
            </a>
            <a
                v-show="panel === 'DATE'"
                class="b-icon-last-month"
                @click="handleIconMonth(-1)">
                &lsaquo;
            </a>
            <a
                v-show="panel === 'YEAR'"
                class="b-current-year">
                {{yearHeader}}
            </a>
            <a
                v-show="panel === 'DATE'"
                class="b-current-month"
                @click="handleClickMonth">
                {{months[month]}}
            </a>
            <a
                v-show="panel === 'DATE' || panel === 'MONTH'"
                class="b-current-year"
                @click="handleClickYear">
                {{year}}
            </a>
            <a
                v-show="panel === 'DATE'"
                class="b-icon-next-month"
                @click="handleIconMonth(1)">
                &rsaquo;
            </a>
            <a
                v-show="panel !== 'TIME'"
                class="b-icon-next-year"
                @click="handleIconYear(1)">
                &raquo;
            </a>
            <a
                v-show="panel === 'TIME'"
                class="b-time-header"
                @click="handleTimeHeader">
                {{timeHeader}}
            </a>
        </div>
        <div class="b-calendar-content">
            <table-year
                v-show="panel === 'YEAR'"
                :value='value'
                :disabled-year='isDisabledYear'
                :first-year='firstYear'
                @select="selectYear">
            </table-year>
            <table-month
                v-show="panel === 'MONTH'"
                :value="value"
                :disabled-month="isDisabledMonth"
                @select="selectMonth">
            </table-month>
            <table-date
                v-show="panel === 'DATE'"
                :value="value"
                :date-format="dateFormat"
                :month="month"
                :year="year"
                :start-at="startAt"
                :end-at="endAt"
                :first-day-of-week="firstDayOfWeek"
                :disabled-date="isDisabledDate"
                @select="selectDate">
            </table-date>
            <table-time
                v-show="panel === 'TIME'"
                :value="value"
                :minute-step="minuteStep"
                :disabled-time="isDisabledTime"
                :time-picker-options="timePickerOptions"
                :time-type="timeType"
                @select="selectTime"
                @pick="pickTime">
            </table-time>
        </div>
    </div>
</template>

<script>
import { isValidDate, isDateObject, formatDate } from '../utils'
import Languages from '../locale/language'
import scrollIntoView from '../utils/scroll-into-view'
import { TableYear, TableMonth, TableDate, TableTime } from '../base'

export default {
    name: 'b-panel',
    components: { TableYear, TableMonth, TableDate, TableTime },
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
                        break
                    default:
                        this.panel = 'DATE'
                }
            } else {
                this.panel = 'NONE'
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
            if (this.type === 'datetime') {
                let time = new Date(date)
                if (isDateObject(this.value)) {
                    time.setHours(this.value.getHours(), this.value.getMinutes(), this.value.getSeconds())
                }
                if (this.isDisabledTime(time)) {
                    time.setHours(0, 0, 0, 0)
                    if (this.notBefore && time.getTime() < new Date(this.notBefore).getTime()) {
                        time = new Date(this.notBefore)
                    }
                    if (this.startAt && time.getTime() < new Date(this.startAt).getTime()) {
                        time = new Date(this.startAt)
                    }
                }
                this.selectTime(time)
                this.panel = 'TIME'
                return
            }
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
        // Todo
        getCriticalTime(value) {
            if (!value) return null

            let date = new Date()
            if (this.type === 'year') {
                return new Date(date.getFullYear(), 0).getMonth()
            } else if (this.type === 'month') {
                return new Date(date.getFullYear(), date.getMonth()).getTime()
            } else if (this.type === 'date') {
                return date.setHours(0, 0, 0, 0)
            }
            return date.getTime()
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
        },
        isDisabledMonth(month) {
            let time = new Date(this.year, month).getTime()
            let maxTime = new Date(this.year, month + 1).getTime() - 1
            return this.inBefore(maxTime) || this.inAfter(time) || (this.type === 'month' && this.inDisabledDays(time))
        },
        isDisabledDate(date) {
            let time = new Date(date).getTime()
            let maxTime = new Date(date).setHours(23, 59, 59, 999)
            return this.inBefore(maxTime) || this.inAfter(time) || this.inDisabledDays(time)
        },
        isDisabledTime(date, startAt, endAt) {
            let time = new Date(date).getTime()
            return this.inBefore(time, startAt) || this.inAfter(time, endAt) || this.inDisabledDays(time)
        },
        getSibling () {
            let calendars = this.$parent.$children.filter(v => v.$options.name === this.$options.name)
            let index = calendars.indexOf(this)
            let sibling = calendars[index ^ 1]
            return sibling
        },
        changePanelYears (flag) {
            this.firstYear = this.firstYear + flag * 10
        },
        handleIconYear (flag) {
            if (this.panel === 'YEAR') {
                this.changePanelYears(flag)
            } else {
                let year = this.year
                this.changeYear(year + flag)
                this.$parent.$emit('change-calendar-year', {
                    year,
                    flag,
                    vm: this,
                    sibling: this.getSibling()
                })
            }
        },
        handleIconMonth(flag) {
            let month = this.month
            this.changeMonth(month + flag)
            this.$parent.$emit('change-calendar-month', {
                month,
                flag,
                vm: this,
                sibling: this.getSibling()
            })
        },
        handleClickYear() {
            this.panel = 'YEAR'
        },
        handleClickMonth() {
            this.panel = 'MONTH'
        },
        handleTimeHeader() {
            if (this.type === 'time') return
            this.panel = 'DATE'
        }
    }
}
</script>