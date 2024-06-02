<template>
  <header id="nav">
    <router-link to="/" id="logo-container" aria-label="Homepage">
      <img src="/img/logo.jpeg" alt="Logo da Empresa" />
    </router-link>
    <nav id="nav-links">
      <router-link to="/" class="nav-item">Home</router-link>
      <router-link to="/about" class="nav-item">Entrar</router-link>
      <router-link to="/register" class="nav-item">Cadastrar</router-link>
    </nav>
  </header>
</template>


<style scoped>
#nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5%;
  border-bottom: 2px solid #ccc;
  background-color: #4CAF50
}

.nav-item {
  text-decoration: none;
  color: #333;
  margin: 0 10px;
  font-size: 16px;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #0056b3; /* Cor de destaque ao passar o mouse */
}

#nav img {
  width: auto;
  height: 50px;
}

#nav-links {
  display: flex;
  justify-content: flex-end;
}

button {
  background-color: #4CAF50; /* Verde mais suave */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049; /* Verde escuro */
}
</style>
