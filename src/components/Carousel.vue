<template>
    <div class="carousel" :style="{height: height + 'px'}">
        <div 
          v-if="animation=='fade'" 
          class="carousel-wrapper" 
          :style="{height: height + 'px'}"
          @mouseover="mouseOver" 
          @mouseleave="mouseLeave"
          ref="wrapper">
            <slot/>
        </div>
        <div 
          v-if="animation=='slide'"
          class="carousel-wrapper"  
          :style="{height: height + 'px'}"
          ref="wrapper">
            <div 
              class="carousel-scroll" 
              :style="style" 
              ref="scroll">
                <slot/>
            </div>
        </div>
        <ul 
          class="carousel-control" 
          v-if="pointer">
            <li 
              :class="{'active':index===active}" 
              v-for="(item,index) in pages" 
              :key="index"
              @click="handleClickPointer(index)">
            </li>
        </ul>
        <ul 
          class="carousel-direction" 
          v-if="arrow">
            <li 
              class="carousel-prev" 
              @click="slideControl(-1)" 
              :class="{'disable':previous}">
            </li>
            <li 
              class="carousel-next" 
              @click="slideControl(1)" 
              :class="{'disable':next}">
            </li>
        </ul>
    </div>
</template>
<script>
export default {
  name: "carousel",
  data() {
    return {
      timer: null, // 定时器
      active: this.slideTo,
      previous: !this.loop, //上下可点击，循环时就一直是false
      next: false,
      pages: 0, //共有多少页
      conWidth: "", //组件总宽度
      moveWidth: "" //每次移动的宽
    };
  },
  props: {
    className: String,
    height: {
      type: Number,
      default: 360
    },
    animation: {
      type: String,
      default: "fade" //fade和slide两种
    },
    // 停留时间，毫秒
    interval: {
      type: Number,
      default: 3000
    },
    // 是否自动播放
    auto: {
      type: Boolean,
      default: true
    },
    // 鼠标划过时暂停
    hoverPause: {
      type: Boolean,
      default: true
    },
    // 循环播放
    loop: {
      type: Boolean,
      default: true
    },
    slideTo: {
      //滑动到第几个
      type: Number,
      default: 0
    },
    // 下方点控制
    pointer: {
      type: Boolean,
      default: true
    },
    // 箭头控制
    arrow: {
      type: Boolean,
      default: true
    },
    speed: {
      //动画过度时间，单位毫秒
      type: Number,
      default: 300
    },
    after: Function, //加载完成
    slideAfter: Function //滑动结束
  },
  computed: {
    style() {
      return {
        width: this.conWidth * this.pages + "px",
        overflow: "hidden",
        transform: `translate(${this.moveWidth},0)`,
        transition: `transform ${this.speed / 1000}s`
      };
    }
  },
  mounted() {
    this.controlClass(this.animation, true, this.active);

    this.$nextTick(() => {
      this.pages = this.$children.length;
      this.conWidth = this.$refs.wrapper.offsetWidth;
      //自动轮播
      this.autoPlay();
      //加载完成
      this.after ? this.after() : "";
    });
  },
  watch: {
    active(val, oldval) {
      this.controlClass(this.animation, false, oldval);
      this.controlClass(this.animation, true, val);
      this.slideAfter ? this.slideAfter(val) : "";
    }
  },
  methods: {
    // 自动播放
    autoPlay() {
      if (this.auto) {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
          this.slideControl(1);
        }, this.interval);
      }
    },
    // 鼠标划过，自动暂停
    mouseOver() {
      if (this.hoverPause) {
        clearInterval(this.timer);
      }
    },
    // 鼠标离开、继续滑动
    mouseLeave() {
      this.autoPlay();
    },
    // 切换当前内容
    slideControl(d) {
      if (d > 0) {
        this.previous = false;
        if (this.active < this.pages - 1) {
          this.active++;
        } else {
          if (this.loop) {
            this.active = 0;
          } else {
            this.next = true;
          }
        }
      } else {
        this.next = false;
        if (this.active > 0) {
          this.active--;
        } else {
          if (this.loop) {
            this.active = this.pages - 1;
          } else {
            this.previous = true;
          }
        }
      }
    },
    // 点击下方导航
    handleClickPointer(i) {
      console.log("current: %o, active: %o", i, this.active);
    },
    hasClass(elements, cName) {
      return !!elements.className.match(
        new RegExp("(\\s|^)" + cName + "(\\s|$)")
      );
    },
    addClass(elements, cName) {
      if (!this.hasClass(elements, cName)) {
        if (elements.className) {
          elements.className += " " + cName;
        } else {
          elements.className += cName;
        }
      }
    },
    removeClass(elements, cName) {
      if (this.hasClass(elements, cName)) {
        elements.className = elements.className.replace(
          new RegExp("(\\s|^)" + cName + "(\\s|$)"),
          ""
        );
      }
    },
    controlClass(animation, show, index) {
      let el = this.$children[index].$el;

      if (animation === "fade") {
        if (show) {
          this.addClass(el, "active");
          el.style.opacity = 1;
          el.style.zIndex = 1;
        } else {
          this.removeClass(el, "active");
          el.style.opacity = 0;
          el.style.zIndex = "";
        }
      } else if (animation === "slide") {
        if (show) {
          //left
          this.addClass(el, "active");
          this.moveWidth = -this.conWidth * index + "px";
        } else {
          //right
          this.removeClass(el, "active");
          this.moveWidth = this.conWidth * index + "px";
        }
      }
    }
  }
};
</script>