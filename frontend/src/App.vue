<template>
  <div>
    <Navbar/>
    <router-view class="view"></router-view>
    <footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  name: 'App',
  components: {
    Navbar, Footer
  }
}

</script>

<style>

</style>
