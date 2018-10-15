import Languages from '../locale/language'

export default {
    name: 'b-table-month',
    props: {
        value: null,
        year: {
            type: Number,
            default: new Date().getFullYear()
        },
        disabledMonth: {
            type: Function,
            default: () => {
                return false
            }
        }
    },
    methods: {
        isDisabled(month) {
            return this.disabledMonth(month) ? true : false
        },
        selectMonth(month) {
            if (!this.isDisabled(month)) {
                this.$emit('select', month)
            }
        }
    },
    render(h) {
        let { months } = Languages.zh
        let curYear = this.value && new Date(this.value).getFullYear()
        let curMonth = this.value && new Date(this.value).getMonth()

        return (
            <div class="b-panel b-panel-month">
                {
                    months.map((month, i) => {
                        return (
                            <span
                                class={{
                                    'cell': true,
                                    'actived': curYear === this.year && curMonth === i,
                                    'disabled': this.isDisabled(i)
                                }}
                                onClick={this.selectMonth.bind(this, i)}>
                                {month}
                            </span>
                        )
                    })
                }
            </div>
        )
    }
}