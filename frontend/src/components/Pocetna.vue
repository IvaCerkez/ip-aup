<template>
  <v-container class="pa-0 fill-height" fluid>
    <v-row class="fill-height" no-gutters>
      <v-col
        class="pa-0"
        cols="12"
        md="7"
        style="height: 100vh; position: relative; overflow: hidden;"
      >
        <img
          alt="HRANA"
          src="@/assets/pocetna_hrana.jpg"
          style="
            height: 100%;
            width: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
          "
        >
      </v-col>
      <v-col
        class="d-flex align-center justify-center"
        cols="12"
        md="5"
        style="
          height: 100vh;
          background-color: #DE8F5F;
          color: white;
        "
      >
        <div class="text-center px-8">
          <h1 class="text-h3 font-weight-bold mb-4">Ponuda slatko i slano</h1>
          <p class="text-subtitle-1 mb-6">
            Uz najljepše poslastice
          </p>

          <v-btn
            class="px-8 py-4 text-h6"
            color="#FFCF9D"
            size="large"
            :to="{ name: 'Proizvodi' }"
          >
             Recepti za hranu
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>