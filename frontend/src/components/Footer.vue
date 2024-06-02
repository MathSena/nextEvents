<template>
  <footer>
      <h3>&copy; 2021 - Todos os direitos reservados</h3>
  </footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
footer {
  background-color: green;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #ccc;
  flex-direction: column;
}
#footer h3 {
  color: white;
}


</style>
