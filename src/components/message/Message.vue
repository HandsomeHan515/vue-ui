<template>
    <transition class="b-message-fade" mode="in-out">
        <div
            v-show="show"
            class="b-message-wrapper"
            :style="{zIndex: zIndex}">
            <div
                class="b-message"
                @mouseenter="enter"
                @mouseleave="leave">
                <img 
                    v-if="imgSrc" 
                    class="b-message-img"
                    :src="imgSrc">
                {{message}}
                <button
                    v-if="showClose"
                    class="b-message-close"
                    @click="close">
                    ×
                </button>
            </div>
        </div>
    </transition>
</template>

<script>
import info from '../../assets/info.svg'
import error from '../../assets/error.svg'
import success from '../../assets/success.svg'
import warning from '../../assets/warning.svg'
import closeImg from '../../assets/close.svg'

export default {
    name: 'b-message',
    data() { 
        return {
            show: true,
            timer: null,
            zIndex: 80,
            closed: false,
            closeImg
        }
    },
    props: {
        message: String,
        type: String,
        duration: {
            type: Number,
            default: 30000
        },
        showClose: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        imgSrc() {
            let img = {
                info,
                error,
                success,
                warning
            }
            return img[this.type]
        }
    },
    mounted() {
        this.enter()
        if (this.duration <= 0) {
            this.showClose = true
        }
    },
    watch: {
        closed(val) {
            this.show = false
            this.$el.addEventListener('animationend', this.destroyElement)
        }
    },
    methods: {
        close() {
            this.closed = true
        },
        destroyElement() {
            this.$el.removeEventListener('transitionend', this.destroyElement)
            this.$destroy(true)
            this.$el.parentNode.removeChild(this.$el)
        },
        enter() {
            this.timer = setTimeout(() => {
                if (!this.closed) {
                    this.close()
                }
            }, this.duration)
        },
        leave() {
            clearTimeout(this.timer)
        }
    }
}
</script>