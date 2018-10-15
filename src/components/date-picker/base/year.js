export default {
    name: 'b-table-year',
    props: {
        value: null,
        firstYear: Number,
        disabledYear: {
            type: Function,
            default: () => {
                return false
            }
        }
    },
    methods: {
        isDisabled(year) {
            return this.disabledYear(year) ? true : false
        },
        selectYear(year) {
            if (!this.isDisabled(year)) {
                this.$emit('select', year)
            }
        }
    },
    render(h) {
        let firstYear = Math.floor(this.firstYear / 10) * 10
        let curYear = this.value && new Date(this.value).getFullYear()

        return (
            <div class="b-panel b-panel-year">
                {
                    Array.apply(null, { length: 10 }).map((_, i) => {
                        let year = firstYear + i
                        
                        return (
                            <span
                                class={{
                                    'cell': true,
                                    'actived': curYear === year,
                                    'disabled': this.isDisabled(year)
                                }}
                                onClick={() => this.selectYear(year)}
                                onClick={this.selectYear.bind(this, year)}>
                                {year}
                            </span>
                        )
                    })
                }
            </div>
        )
    }
}