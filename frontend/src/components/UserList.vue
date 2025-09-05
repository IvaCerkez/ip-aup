<template>
  <div>
    <h2>Podaci s backenda:</h2>
    <ul>
      <li v-for="item in podaci" :key="item.id">{{ item.naziv }}</li>
    </ul>
  </div>
</template>

<script setup>
  import axios from 'axios';
  import { ref, onMounted } from 'vue';

  const podaci = ref([]);

  onMounted(async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/podaci');
      podaci.value = res.data;
    } catch (err) {
      console.error('Greška:', err);
    }
  })
</script>
