<template>
    <div class="carousel-slide" :style="style">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: "carouselItem",
  computed: {
    style() {
      if (this.$parent.animation === "fade") {
        return {
          position: "absolute",
          opacity: 0,
          width: "100%",
          height: `${this.$parent.height}px`,
          transition: `opacity ${this.$parent.speed / 1000}s`
        };
      } else {
        return {
          width: this.$parent.conWidth + "px",
          height: `${this.$parent.height}px`,
          float: "left"
        };
      }
    }
  },
  mounted() {
    console.log("children: %o", this);
  }
};
</script>