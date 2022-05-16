<template>
  <v-row class="mb-1 justify-center w-100">
    <v-col
      cols="12"
      xs="12"
      sm="8"
      md="6"
      lg="6"
      xl="6"
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
          v-model="searchClientInput"
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
  name: 'SearchBox',
  data () {
    return {
      searchClientInput: '',
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
      if (this.searchClientInput) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/clients/${this.searchClientInput}?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}`
        })
        this.$emit('search', this.searchClientInput)
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: `/clients?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}`
        })
        this.$emit('search', '')
        this.loadingDataTable = false
      }
    }
  }
}
</script>
