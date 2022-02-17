<template>
  <router-view v-slot="{Component}">
    <transition name="fade" mode="out-in"> 
      <component :is=Component></component>
    </transition>
  </router-view>
</template>

<script>
export default {};
</script>

<style>
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease-out;
}
</style>