<template>
  <v-app id="inspire" style="background-color: #b1724c">
    <v-app-bar extended style="background-color: #FFCF9D;">
      <v-app-bar-title style="font-size: 22px;">Istražite ponudu recepata</v-app-bar-title>
      <v-spacer />
    </v-app-bar>

    <v-main>
      <v-container>
        <!-- Pretraga -->
        <v-text-field
          v-model="search"
          clearable
          label="Pretraga"
          prepend-inner-icon="mdi-magnify"
          @input="fetchProizvodi"
        />

        <!-- Filter po kategoriji -->
        <v-select
          v-model="selectedKategorija"
          class="mb-4"
          clearable
          item-title="text"
          item-value="value"
          :items="kategorije"
          label="Filter po kategoriji"
          prepend-inner-icon="mdi-filter"
          @update:model-value="fetchProizvodi"
        />

        <!-- Dugme za dodavanje novog proizvoda -->
        <v-btn
          class="mb-4"
          color="#FFCF9D"
          style="color: white"
          :to="{ name: 'DodajProizvod' }"
        >
          Dodaj novi proizvod
        </v-btn>

        <!-- Prikaz proizvoda -->
        <v-row>
          <v-col
            v-for="item in paginatedProizvodi"
            :key="item.id"
            cols="12"
            lg="3"
            md="4"
            sm="6"
          >
            <v-card class="mx-auto" max-width="300" style="background-color: #DE8F5F">
              <v-img
                cover
                height="200px"
                :src="item.slikaUrl"
              />

              <v-card-title class="text-h6">{{ item.naziv }}</v-card-title>
              <v-card-subtitle>{{ item.kategorija }}</v-card-subtitle>

              <!-- Sastojci i upute uklonjeni iz liste -->

              <v-card-actions>
                <v-btn
                  color=black
                  :to="{ name: 'ProizvodiDetalji', params: { id: item.id } }"
                >
                  Detalji
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Pagiranje -->
        <v-row v-if="totalPages > 1" justify="center">
          <v-pagination
            v-model="currentPage"
            :length="totalPages"
            rounded
            total-visible="5"
          />
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { getKategorije, getProizvodi } from '@/services/proizvodiService'

const proizvodi = ref([])
const search = ref('')
const selectedKategorija = ref(null)
const kategorije = ref([])

const itemsPerPage = 8
const currentPage = ref(1)
const loading = ref(false)

// Funkcija za dohvat proizvoda
const fetchProizvodi = async () => {
  loading.value = true
  console.log('Šaljem na backend:', {
    pretraga: search.value,
    kategorija: selectedKategorija.value,
  })
  try {
    const res = await getProizvodi({
      pretraga: search.value,
      kategorija: selectedKategorija.value,
    })
    proizvodi.value = res.data
    currentPage.value = 1
  } catch (error) {
    console.error(error)
    alert('Greška pri dohvaćanju proizvoda')
  } finally {
    loading.value = false
  }
}

// Funkcija za dohvat kategorija
const fetchKategorije = async () => {
  try {
    const res = await getKategorije()
    kategorije.value = res.data.map(k => ({ value: k.id, text: k.naziv }))
  } catch (error) {
    console.error(error)
    alert('Greška pri dohvaćanju kategorija')
  }
}

// Ukupan broj stranica za paginaciju
const totalPages = computed(() => {
  return Math.ceil(proizvodi.value.length / itemsPerPage)
})

// Paginated proizvodi
const paginatedProizvodi = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return proizvodi.value.slice(start, start + itemsPerPage)
})

// Poziv funkcija prilikom montaže
onMounted(() => {
  fetchProizvodi()
  fetchKategorije()
})
</script>
