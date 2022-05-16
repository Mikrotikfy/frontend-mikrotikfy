<template>
  <v-row class="mb-1 justify-center w-100">
    <v-col
      cols="12"
    >
      <v-row
        class="mx-1 mt-1 mb-1 justify-center d-flex"
      >
        <v-btn
          color="grey lighten-4 black--text elevation-0"
          dark
          :loading="loadingDataTable"
          tile
          large
          x-large
          style="border-radius: 30px 0 0 30px;padding:5px;height:56px;"
          @click="getClientBySearch()"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-text-field
          ref="searchClient"
          v-model="search"
          :label="loadingDataTable ? 'Cargando... Por favor espere.' : 'Buscar por código, nombre, barrio o dirección'"
          single-line
          hide-details
          filled
          rounded
          autofocus
          :loading="loadingDataTable"
          :disabled="loadingDataTable"
          class="white--text"
          style="width:100px;max-width: 600px;border-radius: 0 30px 30px 0;"
          @keyup.enter="getClientBySearch()"
        />
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'ClientSearch',
  data () {
    return {
      search: '',
      loadingDataTable: false
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.id == this.$route.query.city) : ''
    }
  },
  methods: {
    getClientBySearch () {
      if (this.search) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/billing/${this.search}?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}`
        })
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: '/billing'
        })
        this.loadingDataTable = false
      }
    }
  }
}
</script>
