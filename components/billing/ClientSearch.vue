<template>
  <v-row class="justify-center w-100">
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
          style="border-radius: 30px 0 0 30px;padding:5px;height:48px;"
          @click="getClientBySearch()"
        >
          <v-icon>mdi-magnify</v-icon>
        </v-btn>
        <v-autocomplete
          v-model="select"
          :items="searchResults"
          :label="loadingDataTable ? 'Cargando... Por favor espere.' : 'Buscar por código, nombre, barrio o dirección'"
          :search-input.sync="search"
          :item-text="text"
          item-value="id"
          clearable
          hide-details
          hide-selected
          auto-select-first
          return-object
          solo
          rounded
          no-data-text="Realiza una busqueda para iniciar..."
          :loading="loadingDataTable"
          class="white--text"
          style="width:100px;max-width: 600px;border-radius: 0 30px 30px 0;"
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
      search: null,
      searchResults: [],
      select: null,
      loadingDataTable: false
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.name == this.$route.query.city) : ''
    }
  },
  watch: {
    search (val) {
      val && val !== this.select && this.searchInDatabase(val)
    },
    select (resultObject) {
      this.getClientBySearch(resultObject)
    }
  },
  methods: {
    text: item => `${item.code} - ${item.name} - ${item.dni} - ${item.address} - ${item.neighborhood.name}`,
    searchInDatabase (val) {
      if (val.length < 4) { return }
      this.loadingDataTable = true
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          $and: [
            {
              city: {
                name: this.$route.query.city
              }
            },
            {
              clienttype: {
                name: this.$route.query.clienttype
              }
            },
            {
              $or: [
                {
                  name: {
                    $contains: val
                  }
                },
                {
                  code: val
                },
                {
                  dni: val
                }
              ]
            }
          ]
        },
        populate: ['neighborhood', 'plan', 'offer', 'offer.plan', 'offermovements.offer', 'offermovements', 'debtmovements', 'debtmovements.technician']
      },
      {
        encodeValuesOnly: true
      })
      fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.clone().json())
        .then((clients) => {
          this.searchResults = clients.data
        })
        .finally(() => {
          this.loadingDataTable = false
        })
    },
    getClientBySearch (search) {
      this.$store.commit('billing/resetInvoices')
      this.$store.commit('billing/resetSelected')
      this.$store.commit('billing/resetCurrentClient')
      this.$store.commit('billing/setShowPayedToFalse')
      this.$store.commit('billing/getClientsBySearch', search)
      if (search) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/billing/${search.id}?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}`
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
