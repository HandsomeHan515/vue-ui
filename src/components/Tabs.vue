<template>
  <div class="b-tabs-wrapper">
    <div class="b-tabs-btn-wraper">
      <button
        class="b-tabs-btn" 
        v-for="(item, index) in tabs" 
        :key="index"
        :disabled="item.disabled"
        @click="handleClick(item)">
        {{item.label}}
      </button>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "Tabs",
  props: ["value"],
  data() {
    return {
      tabs: []
    };
  },
  mounted() {
    this.tabs = this.$children;
  },
  methods: {
    handleClick(e) {
      this.$emit("input", e.name);
    }
  }
};
</script>

<style scoped>
.b-tabs-wrapper {
  height: 100%;
  margin: 0 auto;
}
.b-tabs-btn-wraper {
  overflow: hidden;
}
</style>
