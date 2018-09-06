<template>
    <div v-show="$parent.value === name">
        <slot></slot>
    </div>
</template>

<script>
export default {
  name: "TabPane",
  props: {
    label: {
      type: String
    },
    name: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    console.log(this.$parent);
  }
};
</script>

<style scoped>
</style>
