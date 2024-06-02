<template>
  <footer class="footer">
    <div class="footer-content">
      <h3>&copy; 2021 - Todos os direitos reservados</h3>
      <nav>
        <ul class="footer-links">
          <li><router-link to="/privacy">Política de Privacidade</router-link></li>
          <li><router-link to="/terms">Termos de Serviço</router-link></li>
          <li><router-link to="/contact">Contato</router-link></li>
        </ul>
      </nav>
    </div>
  </footer>
</template>


<style scoped>
.footer {
  background-color: #2c662d; /* Um verde mais escuro para um visual mais refinado */
  color: white;
  text-align: center;
  padding: 20px;
  border-top: 1px solid #ccc;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  display: inline;
  margin: 0 10px;
}

.footer-links a {
  color: white;
  text-decoration: none;
  transition: color 0.3s;
}

.footer-links a:hover {
  color: #a4de95; /* Um tom de verde mais claro ao passar o mouse */
}
</style>
