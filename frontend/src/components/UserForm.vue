<template>
  <div class="register">
    <h2>Formulário de Registro</h2>
    <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent="registerUser">
      <el-form-item
        v-for="field in fields"
        :key="field.id"
        :prop="field.model"
        :label="field.label"
        :rules="rules[field.model]"
      >
        <el-input
          :type="field.type"
          :placeholder="`Digite seu(a) ${field.label.toLowerCase()}`"
          v-model="form[field.model]"
          :prefix-icon="field.icon"
        />
      </el-form-item>
      <el-button type="primary" native-type="submit" @click="validateForm">Registrar</el-button>
    </el-form>
  </div>
</template>


<script>
import { ElForm, ElFormItem, ElInput, ElButton } from 'element-plus';

export default {
  name: 'RegisterForm',
  components: {
    ElForm,
    ElFormItem,
    ElInput,
    ElButton
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        password: '',
        confirmpassword: ''
      },
      fields: [
        { id: 'name', label: 'Nome', type: 'text', model: 'name', icon: 'el-icon-user' },
        { id: 'email', label: 'Email', type: 'email', model: 'email', icon: 'el-icon-mail' },
        { id: 'password', label: 'Senha', type: 'password', model: 'password', icon: 'el-icon-lock' },
        { id: 'confirmpassword', label: 'Confirme a senha', type: 'password', model: 'confirmpassword', icon: 'el-icon-lock' }
      ],
      rules: {
        name: [
          { required: true, message: 'Por favor, insira o nome', trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Por favor, insira o email', trigger: 'blur' },
          { type: 'email', message: 'Por favor, insira um email válido', trigger: ['blur', 'change'] }
        ],
        password: [
          { required: true, message: 'Por favor, insira a senha', trigger: 'blur' },
          { min: 6, message: 'A senha deve ter no mínimo 6 caracteres', trigger: 'blur' }
        ],
        confirmpassword: [
          { required: true, message: 'Por favor, confirme a senha', trigger: 'blur' },
          { validator: (rule, value, callback) => {
              if (value === '') {
                callback(new Error('Por favor, confirme a senha'));
              } else if (value !== this.form.password) {
                callback(new Error('As senhas não coincidem'));
              } else {
                callback();
              }
            }, trigger: 'blur'
          }
        ]
      }
    };
  },
  methods: {
    validateForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.registerUser();
        } else {
          return false;
        }
      });
    },
    async registerUser() {
      const data ={
        name: this.form.name,
        email: this.form.email,
        password: this.form.password,
        confirmPassword: this.form.confirmpassword
      }

      const jsonData = JSON.stringify(data);

      await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      })
      .then(resp => resp.json())
      .then(data => {
        let auth = false;

        if(data.error) {
          this.msg = data.error.message
        }else{
          auth = true;
          this.msg = data.msg,
          this.msgClass = "sucess"
        }

        setTimeout(() =>{
          if(!auth){
            this.msg = ""
          }else{
            // Redirect
            this.$router.push("dashboard")
          }
        })
      })
    }
  }
}
</script>


<style scoped>
.register {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  box-sizing: border-box;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-container {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.input-group {
  display: flex;
  align-items: center;
}

input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-left: 10px;
}

.fa {
  font-size: 16px;
  color: #666;
}

InputSubmit {
  display: block;
  width: 100%;
}

button {
  width: 100%;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}
</style>
