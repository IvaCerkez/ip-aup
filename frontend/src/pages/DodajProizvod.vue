<template>
  <v-container
    class="py-10"
    fluid
    style="background-color: #b1724c; min-height: 100vh;"
  >
    <v-row align="center" justify="center">
      <v-col cols="12" lg="6" md="8">
        <h1 class="text-h4 font-weight-bold mb-6 text-center" style="color: white;">
          Dodaj novi proizvod
        </h1>

        <v-form ref="form" v-model="isValid" lazy-validation>
          <v-row>
            <!-- Naziv -->
            <v-col cols="12">
              <v-text-field
                v-model="proizvod.naziv"
                label="Naziv"
                required
                :rules="[rules.required]"
              />
            </v-col>

            <!-- Sastojci -->
            <v-col cols="12">
              <v-textarea
                v-model="proizvod.sastojci"
                label="Sastojci"
                required
                :rules="[rules.required]"
              />
            </v-col>

            <!-- Uputa -->
            <v-col cols="12">
              <v-textarea
                v-model="proizvod.uputa"
                label="Uputa"
                required
                :rules="[rules.required]"
              />
            </v-col>

            <!-- Kategorija -->
            <v-col cols="12">
              <v-select
                v-model="proizvod.kategorija"
                item-title="text"
                item-value="value"
                :items="kategorije"
                label="Kategorija"
                required
                :rules="[rules.required]"
              />
            </v-col>

            <!-- URL slike -->
            <v-col cols="12">
              <v-text-field
                v-model="proizvod.slikaUrl"
                label="URL slike"
                placeholder="https://example.com/slika.jpg"
                required
                :rules="[rules.required, rules.url]"
              />
            </v-col>

            <!-- Dugmad -->
            <v-col class="text-center" cols="12">
              <v-btn color="#FFB38E" @click="spremiProizvod">
                Spremi
              </v-btn>
              <v-btn class="ml-2" color="#FFCF9D" @click="resetForm">
                Očisti
              </v-btn>
            </v-col>
          </v-row>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const proizvod = ref({
  naziv: '',
  sastojci: '',
  uputa: '',
  kategorija: '',
  slikaUrl: '' // novo polje za URL slike
})

const kategorije = [
  { value: 1, text: 'Slatko' },
  { value: 2, text: 'Slano' }
]

const isValid = ref(false)
const form = ref(null)
const router = useRouter()

const rules = {
  required: v => !!v || 'Polje je obavezno',
  url: v => {
    if (!v) return true
    const pattern = /^(https?:\/\/)[^\s]+$/i
    return pattern.test(v) || 'Unesite validan URL'
  }
}

const spremiProizvod = async () => {
  if (form.value?.validate()) {
    try {
      const payload = {
        naziv: proizvod.value.naziv,
        sastojci: proizvod.value.sastojci,
        uputa: proizvod.value.uputa,
        kategorija_id: proizvod.value.kategorija,
        slikaUrl: proizvod.value.slikaUrl
      }

      console.log('Šaljem podatke:', payload)

      await axios.post('http://localhost:5000/api/proizvodi', payload)

      alert('Proizvod je uspješno dodan!')
      resetForm()
      router.push({ name: 'Proizvodi' })
    } catch (error) {
      console.error('Greška kod spremanja proizvoda:', error)
      alert('Došlo je do greške prilikom dodavanja proizvoda.')
    }
  } else {
    alert('Molimo ispunite sva obavezna polja.')
  }
}

const resetForm = () => {
  form.value.reset()
  proizvod.value = {
    naziv: '',
    sastojci: '',
    uputa: '',
    kategorija: '',
    slikaUrl: ''
  }
}
</script>
