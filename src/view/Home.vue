<template>
  <div>
    <!-- <b-tabs v-model="activeName">
      <b-tab-pane label="香蕉" name="first">1</b-tab-pane>
      <b-tab-pane label="苹果" name="second">2</b-tab-pane>
      <b-tab-pane label="橘子" :disabled="true" name="third">3</b-tab-pane>
      <b-tab-pane label="荔枝" name="fourth">4</b-tab-pane>
    </b-tabs> -->
    <!-- <b-carousel 
      animation="slide" 
      :hoverPause="false" 
      :interval="5000">
      <b-carousel-item><img style="height: 100%; width: 100%;" src="../assets/4.jpg" alt=""></b-carousel-item>
      <b-carousel-item><img style="height: 100%; width: 100%;" src="../assets/1.jpg" alt=""></b-carousel-item>
      <b-carousel-item><img style="height: 100%; width: 100%;" src="../assets/2.jpg" alt=""></b-carousel-item>
      <b-carousel-item><img style="height: 100%; width: 100%;" src="../assets/3.jpg" alt=""></b-carousel-item>
    </b-carousel> -->
    <!-- <b-message message='hello message!' type='success'></b-message> -->

    <!-- <div id="demo">
      <button v-on:click="show = !show">
        Toggle
      </button>
      <transition name="fade">
        <p v-if="show">hello</p>
      </transition>
    </div> -->
    <b-datepicker v-model="year" type="year" format="YYYY"></b-datepicker>
    <b-datepicker v-model="month" type="month" format="YYYY-MM"></b-datepicker>
    <b-datepicker v-model="date"></b-datepicker>
    <b-datepicker v-model="date2" shortcuts></b-datepicker>
    <b-datepicker v-model="time" type='time' format="HH:mm:ss"></b-datepicker>
    <b-datepicker v-model="arr" range></b-datepicker>
    <b-datepicker v-model="arr2" range shortcuts></b-datepicker>

    <b-datepicker v-model="datetime" type='datetime' format='YYYY-MM-DD HH:mm:ss'></b-datepicker>
    <b-datepicker v-model="datetime2" range type='datetime' format='YYYY-MM-DD HH:mm:ss'></b-datepicker>

    <button @click="getTime">获取</button>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      activeName: "first",
      height: 0,
      show: true,
      year: '',
      month: '',
      date: '',
      date2: '',
      time: '',
      arr: '',
      arr2: [],
      datetime: '',
      datetime2: ''
    };
  },
  mounted() {
    this.height = window.innerHeight;
  },
  methods: {
    getTime() {
      console.log('time', this.year, this.month, this.date, this.date2, this.time, this.arr, this.arr2, this.datetime, this.datetime2)
    }
  }
};
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
