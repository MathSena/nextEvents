<template>
  <el-button
    type="primary"
    native-type="submit"
    @click="handleClick"
    :style="{ width: '100%' }"
  >
    {{ text }}
  </el-button>
</template>

<script>
import { ElButton } from 'element-plus'

export default {
  name: 'InputSubmit',
  components: {
    ElButton
  },
  props: {
    text: {
      type: String,
      default: 'Submit'
    }
  },
  methods: {
    handleClick(event) {
      // Emitir evento personalizado para tratamento externo
      this.$emit('click', event)
    }
  }
}
</script>

<style scoped>
input[type='submit'] {
  background-color: #4caf50;
  color: white;
  padding: 10px 15px;
  margin: 8px 0;
  border: none;
  cursor: pointer;
  width: 100%;
  box-sizing: border-box; /* Assegura que padding e border sejam incluídos na largura total */
}

input[type='submit']:hover {
  background-color: #45a049;
}
</style>
