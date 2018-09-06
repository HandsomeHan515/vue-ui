<template>
  <div>
    <!-- <b-tabs v-model="activeName">
      <b-tab-pane label="香蕉" name="first">1</b-tab-pane>
      <b-tab-pane label="苹果" name="second">2</b-tab-pane>
      <b-tab-pane label="橘子" :disabled="true" name="third">3</b-tab-pane>
      <b-tab-pane label="荔枝" name="fourth">4</b-tab-pane>
    </b-tabs> -->
    <b-carousel animation="fade" :height="600">
      <b-carousel-item><img style="height: 100%; width: 100%;" src="../assets/4.jpg" alt=""></b-carousel-item>
      <b-carousel-item><img style="height: 100%; width: 100%;" src="../assets/1.jpg" alt=""></b-carousel-item>
      <b-carousel-item><img style="height: 100%; width: 100%;" src="../assets/2.jpg" alt=""></b-carousel-item>
      <b-carousel-item><img style="height: 100%; width: 100%;" src="../assets/3.jpg" alt=""></b-carousel-item>
    </b-carousel>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      activeName: "first"
    };
  }
};
</script>