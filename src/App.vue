<template>
  <div class="d-flex flex-column min-vh-100">
    <TopPart></TopPart>
    <MiddlePart></MiddlePart>
    <BottomPart class="mt-auto"></BottomPart>
  </div>
</template>

<script>
import TopPart from './components/TopPart.vue';
import MiddlePart from './components/MiddlePart.vue';
import BottomPart from './components/BottomPart.vue'
export default {
  name: "App",
  components: {TopPart, MiddlePart, BottomPart},
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2f4255;
  width: 100%;
}

.container-fluid{
    padding: 0 !important;
}
</style>
