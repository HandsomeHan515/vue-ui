<template>
    <div
        class="b-datepicker"
        :class="{'b-date-picker': range, disabled}"
        :style="wrapperStyle"
        v-clickoutside="closePopup">
        <div
            class="b-input-wrapper"
            @click="showPopup">
            <input 
                ref="input"
                type="text"
                autocomplete="off"
                :class="inputClass"
                :name="inputName"
                :disabled="disabled"
                :readonly="!editable"
                :value="text"
                :placeholder="innerPlaceholder"
                @input="handleInput"
                @change="handleChange">
            <span class="b-input-append">
                <slot name="calendar-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 200 200" class="b-calendar-icon">
                        <rect x="13" y="29" rx="14" ry="14" width="174" height="158" fill="transparent" />
                        <line x1="46" x2="46" y1="8" y2="50" />
                        <line x1="154" x2="154" y1="8" y2="50" />
                        <line x1="13" x2="187" y1="70" y2="70" />
                        <text x="50%" y="135" font-size="90" stroke-width="1" text-anchor="middle" dominant-baseline="middle">{{new Date().getDate()}}</text>
                    </svg>
                </slot>
            </span>
            <span
                v-if="showClearIcon"
                class="b-input-append b-clear-wrapper"
                @click.stop="clearDate">
                <slot name="b-clear-icon">
                    <i class="b-input-icon b-clear-icon"></i>
                </slot>
            </span>
        </div>
        <div
            v-show="popupVisible"
            class="b-datepicker-popup"
            :style="innerPopupStyle"
            ref="calendar">
            <slot name="header">
                <div
                    v-if="range && innerShortcuts.length"
                    class="b-shortcuts-wrapper">
                    <button
                        type="button"
                        class="b-shortcuts"
                        v-for="(range, index) in innerShortcuts"
                        :key="index"
                        @click="selectRange(range)">
                        {{range.text}}
                    </button>
                </div>
            </slot>
            <panel
                :type="innerType"
                :date-format="innnerDateFormat"
                :value="curVal"
                :visible="popupVisible"
                @select-date="selectDate"
                @select-time="selectTime">
            </panel>
            <slot name="footer" :confirm="confirmDate">
                <div v-if="confirm" class="b-datepicker-footer">
                    <button
                        type="button"
                        class="b-datepicker-btn b-datepicker-btn-confirm"
                        @click="confirmDate">
                        {{confirmText}}
                    </button>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
import clickoutside from './directives/clickoutside'
import { isValidDate, isValidRange, isDateObject, isPlainObject, formatDate, parseDate, throttle, isDateObjecttle } from './utils'
import Panel from './panel/panel'
import locale from './mixins/locale'
import Languages from './locale/language'

export default {
    name: 'b-datepicker',
    components: { Panel },
    mixins: [ locale ],
    directives: { clickoutside },
    props: {
        value: null,
        placeholder: {
            type: String,
            default: null
        },
        lang: {
            type: [String, Object],
            default: 'zh'
        },
        format: {
            type: String,
            default: 'YYYY-MM-DD'
        },
        dateFormat: String,
        type: {
            type: String,
            default: 'date'
        },
        range: {
            type: Boolean,
            default: false
        },
        rangeSeparator: {
            type: String,
            default: '~'
        },
        width: {
            type: [String, Number],
            default: null
        },
        confirm: {
            type: Boolean,
            default: false
        },
        confirmText: {
            type: String,
            default: '保存'
        },
        editable: {
            type: Boolean,
            default: true
        },
        disabled: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: true
        },
        shortcuts: {
            type: [Boolean, Array],
            default: true
        },
        inputName: {
            type: String,
            default: 'date'
        },
        inputClass: {
            type: [ String, Array ],
            default: 'b-input'
        },
        appendToBody: {
            type: Boolean,
            default: false
        },
        popupStyle: Object
    },
    data() { 
        return {
            curVal: this.range ? [null, null] : null,
            userInput: null,
            popupVisible: false,
            position: {}
        }
    },
    watch: {
        // value: {
        //     immediate: true,
        //     handler: 'handleValChange'
        // },
        popupVisible(val) {
            if (val) {
                // this.init()
            } else {
                this.userInput = null
            }
        }
    },
    computed: {
        language () {
            return Language.zh
        },
        innerPlaceholder() {
            if (typeof this.placeholder === 'string')  return this.placeholder
            return this.range ? this.t('placeholder.dateRange') : this.t('placeholder.date')
        },
        text() {
            if (this.userInput !== null) return this.userInput
            if (!this.range) return isValidDate(this.value) ? this.stringify(this.value) : ''
            return isValidRange(this.value) 
                ? `${this.stringify(this.value[0])} ${this.rangeSeparator} ${this.stringify(this.value[1])}`
                : ''
        },
        wrapperStyle() {
            if (typeof this.width === 'number' || (typeof this.width === 'string' && /^\d+$/.test(this.width))) {
                return this.width + 'px'
            }
            return {
                width: this.width
            }
        },
        showClearIcon() {
            return !this.disabled && this.clearable && (this.range ? isValidRange(this.value) : isValidDate(this.value))
        },
        innerType() {
            return String(this.type).toLowerCase()
        },
        innerShortcuts() {
            if (Array.isArray(this.shortcuts)) return this.shortcuts
            if (this.shortcuts === false) return []
            let pickers = this.t('pickers')
            // TODO 
            const arr = [
                {
                    text: pickers[0],
                    onClick (self) {
                        self.currentValue = [ new Date(), new Date(Date.now() + 3600 * 1000 * 24 * 7) ]
                        self.updateDate(true)
                    }
                },
                {
                    text: pickers[1],
                    onClick (self) {
                        self.currentValue = [ new Date(), new Date(Date.now() + 3600 * 1000 * 24 * 30) ]
                        self.updateDate(true)
                    }
                },
                {
                    text: pickers[2],
                    onClick (self) {
                        self.currentValue = [ new Date(Date.now() - 3600 * 1000 * 24 * 7), new Date() ]
                        self.updateDate(true)
                    }
                },
                {
                    text: pickers[3],
                    onClick (self) {
                        self.currentValue = [ new Date(Date.now() - 3600 * 1000 * 24 * 30), new Date() ]
                        self.updateDate(true)
                    }
                }
            ]
            return arr
        },
        innnerDateFormat() {
            if (this.dateFormat) return this.dateFormat
            if (this.innerType === 'date') return this.format
            return this.format.replace(/[Hh]+.*[msSaAZ]|\[.*?\]/g, '').trim() || 'YYYY-MM-DD'
        },
        innerPopupStyle () {
            return { ...this.position, ...this.popupStyle }
        }
    },
    mounted() {
        // TODO 
        if (this.appendToBody) {
            this.popupElm = this.$refs.calendar
            document.body.appendChild(this.popupElm)
        }
        this._displayPopup = throttle(() => {
            if (this.popupVisible) {
                this.displayPopup()
            }
        }, 200)
        window.addEventListener('resize', this._displayPopup)
        window.addEventListener('scroll', this._displayPopup)
    },
    beforeDestroy() {
        window.removeEventListener('resize', this._displayPopup)
        window.removeEventListener('scroll', this._displayPopup)
    },
    methods: {
        handleValChange(value) {
            if (!this.range) {
                this.curVal = isValidDate(value) ? new Date(value) : null
            } else {
                let [start, end] = value
                this.curVal = isValidRange(value) ? [new Date(start), new Date(end)] : [null, null]
            }
        },
        init() {
            this.handleValChange(this.value)
            // this.displayPopup()   
        },
        stringify(date, format) {
            return formatDate(date, format || this.format)
        },
        parseDate(value, format) {
            return parseDate(value, format || this.format)
        },
        dateEqual (a, b) {
            return isDateObject(a) && isDateObject(b) && a.getTime() === b.getTime()
        },
        rangeEqual (a, b) {
            return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((item, index) => this.dateEqual(item, b[index]))
        },
        selectRange(range) {
            if (typeof range.onClick === 'function') {
                return range.onClick(this)
            }
            let { start, end } = range
            this.curVal = [new Date(start), new Date(end)]
            // todo
            this.updateDate(true)
        },
        clearDate() {
            let date = this.range ? [null, null] : null
            this.curVal = date
            // todo
            this.updateDate(true)
            this.$emit('clear')
        },
        confirmDate() {
            let valid = this.range ? isValidRange(this.curVal) : isValidDate(this.curVal)
            if (valid) {
                // todo
                this.updateDate(true)
            }
            this.$emit('confirm', this.curVal)
            // todo
            this.clearPopup()
        },
        updateDate(confirm = false) {
            if ((this.confirm && !confirm) || this.disabled) return false
            if (this.range ? this.rangeEqual(this.value, this.currentValue) : this.dateEqual(this.value, this.currentValue)) return false
            this.$emit('input', this.curVal)
            this.$emit('change', this.curVal)
            return true
        },
        selectDate(date) {
            this.curVal = date
            this.updateDate() && this.closePopup()
        },
        selectTime(time, close) {
            this.curVal = time
            this.updateDate() && close && this.closePopup()
        },
        selectStartTime (time) {
            this.selectStartDate(time)
        },
        selectEndTime (time) {
            this.selectEndDate(time)
        },
        selectStartDate(date) {
            this.$set(this.curVal, 0, date)
            if (this.curVal[1]) {
                this.updateDate()
            }
        },
        selectEndDate(date) {
            this.$set(this.curVal, 1, date)
            if (this.curVal[0]) {
                this.updateDate()
            }
        },
        showPopup() {
            if (this.disabled) return 
            this.popupVisible = true
        },
        closePopup() {
            this.popupVisible = false
        },
        handleInput (e) {
            this.userInput = e.target.value
            console.log('input', this.userInput)
        },
        handleChange (e) {
            let value = e.target.value
            if (this.editable && this.userInput !== null) {
                let calender = this.$children[0]
                console.log('cha', calender)
            }
        }
    }
 }
</script>
