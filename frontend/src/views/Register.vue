<template>
  <div class="register">
    <h2>Crie uma conta</h2>
    <UserForm />
  </div>
</template>

<script>
import UserForm from '@/components/UserForm.vue';

export default {
  name: 'Register',
  components: {
    UserForm
  }
};
</script>

<style scoped>

</style>