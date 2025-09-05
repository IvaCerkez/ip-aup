<template>
  <v-container fluid style="background-color: #b1724c; min-height: 100vh;">
    <h1 style="color: white;">Detalji proizvoda</h1>
    <br><br>
    <v-row>
      <!-- Slika proizvoda -->
      <v-col cols="12" md="6">
        <v-card style="background-color: #DE8F5F;">
          <v-img height="400px" :src="proizvod.slikaUrl" />
        </v-card>
      </v-col>

      <!-- Podaci o proizvodu -->
      <v-col cols="12" md="6">
        <v-card style="background-color: #DE8F5F; color: white;">
          <v-card-title>{{ proizvod.naziv }}</v-card-title>
          <v-card-subtitle>{{ proizvod.kategorija }}</v-card-subtitle>
          <v-card-text>
            <div><strong>Sastojci:</strong> {{ proizvod.sastojci }}</div>
            <div><strong>Uputa:</strong> {{ proizvod.uputa }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn color="#6f472f" dark @click="obrisiProizvod">
              Izbriši
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Loader -->
    <v-progress-circular
      v-if="loading"
      class="mt-3"
      color="primary"
      indeterminate
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProizvodById } from '@/services/proizvodiService'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const id = route.params.id
const proizvod = ref({})
const loading = ref(false)

// Dohvati detalje proizvoda
const fetchProizvodi = async () => {
  loading.value = true
  try {
    const res = await getProizvodById(id)
    proizvod.value = res.data
  } catch (error) {
    console.error(error)
    alert('Greška pri dohvaćanju proizvoda')
  } finally {
    loading.value = false
  }
}

// Brisanje proizvoda
const obrisiProizvod = async () => {
  if (!confirm('Jeste li sigurni da želite obrisati ovaj proizvod?')) return
  try {
    await axios.delete(`http://localhost:5000/api/proizvodi/${id}`)
    alert('Proizvod je obrisan.')
    router.push({ name: 'Proizvodi' })
  } catch (error) {
    console.error('Greška kod brisanja proizvoda:', error)
    alert('Došlo je do greške prilikom brisanja proizvoda.')
  }
}

onMounted(() => {
  fetchProizvodi()
})
</script>

<style scoped>
h1 {
  color: white;
}
</style>
