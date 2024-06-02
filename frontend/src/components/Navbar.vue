<template>
  <div id="nav">
    <router-link to="/" id="logo-container">
      <img src="/img/logo.jpeg" alt="Events" />
    </router-link>
    |
    <h2 id="nav-title">Next Events</h2>
    <div id="nav-links">
      <router-link to="/">Home</router-link> 
      <router-link to="/about">Entrar</router-link>
      <router-link to="/about">Cadastrar</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar'
}
</script>

<style scoped>
#nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #ccc;
}

#nav a {
  text-decoration: none;
  margin-right: 15px;
}

#nav img {
  width: 50px;
  height: 50px;
}

#nav-title {
  font-weight: 300;
  font-size: 3rem;
}

#logo-container, #nav-links {
  width: 400px;
}

#nav-links {
  display: flex;
  justify-content: flex-end;
}

button {
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: green;
}
</style>
