<template>
  <v-container fluid class="py-0">
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
          class="mx-1 mt-4 justify-center d-flex"
        >
          <v-btn
            color="grey lighten-4 black--text elevation-0"
            dark
            :loading="loadingDataTable"
            tile
            large
            x-large
            style="border-radius: 30px 0 0 30px;padding:5px;height:48px;"
            @click="getClientBySearchButton()"
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
            divider
            hide-details
            hide-selected
            auto-select-first
            return-object
            chips
            solo
            rounded
            no-data-text="Realiza una busqueda para iniciar..."
            :loading="loadingDataTable"
            class="white--text"
            style="width:100px;max-width: 600px;border-radius: 0;"
          >
            <template v-slot:item="{ item }">
              <v-list-item-content>
                <v-list-item-title class="text-caption" v-text="`${item.dni} / ${item.name} / ${item.phone}`" />
              </v-list-item-content>
              <v-list-item-action class="d-flex flex-row">
                <v-tooltip
                  v-for="service in item.services"
                  :key="service.id"
                  left
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      label
                      outlined
                      class="mr-1"
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-icon
                        :color="service.active ? service.indebt ? 'red darkne-2' : 'green darken-2' : service.indebt ? 'gray' : 'red darken-4'"
                      >
                        {{ service.name === 'INTERNET' ? 'mdi-wifi' : 'mdi-television' }}
                      </v-icon>
                    </v-chip>
                  </template>
                  <span>{{ `${processAddresses(service)} ${processAddressesNeighborhood(service)}` }}</span>
                </v-tooltip>
              </v-list-item-action>
            </template>
          </v-autocomplete>
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :color="searchByAddress ? 'primary white--text elevation-0' : 'grey lighten-4 black--text elevation-0'"
                dark
                :loading="loadingDataTable"
                tile
                large
                x-large
                style="border-radius: 0 30px 30px 0;padding:5px;height:48px;"
                v-bind="searchByAddress ? null : attrs"
                v-on="searchByAddress ? null : on"
                @click="searchByAddress ? searchByAddress = false : null"
              >
                <v-icon>{{ searchByAddress ? 'mdi-close-circle' : 'mdi-filter-outline' }}</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title class="mr-2">
                  Busqueda por direccion
                </v-list-item-title>
                <v-switch
                  v-model="searchByAddress"
                  color="primary"
                  @change="getClientBySearch()"
                />
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'SearchBox',
  data () {
    return {
      search: '',
      select: null,
      searchResults: null,
      loadingDataTable: false,
      searchByAddress: false
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.id == this.$route.query.city) : ''
    }
  },
  watch: {
    '$route.query.clienttype' () {
      this.search = ''
    },
    searchByAddress () {
      this.getClientBySearch()
    },
    search (val) {
      val && val !== this.select && this.searchInDatabase(val)
    },
    select (resultObject) {
      this.getClientBySearch(resultObject)
    }
  },
  mounted () {
    this.searchClientInput = this.$route.params.search
    this.searchByAddress = this.$route.query.fuzzy === 'true'
    const latestSearch = localStorage.getItem('searchClient')
    if (latestSearch && this.$route.query.referer === 'layout') {
      this.searchClientInput = latestSearch
      this.getClientBySearch()
    } else {
      localStorage.setItem('searchClient', this.searchClientInput)
    }
  },
  methods: {
    text: item => `${item.dni} - ${item.name} - ${item.phone}`,
    searchInDatabase (val) {
      if (val.length < 1) { return }
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
                  phone: val
                },
                {
                  dni: val
                },
                {
                  services: {
                    code: val
                  }
                }
              ]
            }
          ]
        },
        populate: ['services', 'services.neighborhood', 'services.service_addresses', 'services.service_addresses.neighborhood', 'services.offer', 'services.offer.plan']
      },
      {
        encodeValuesOnly: true
      })
      fetch(`${this.$config.API_STRAPI_ENDPOINT}normalized-clients?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.clone().json())
        .then((clients) => {
          // group services by service name and count them
          // clients.data.forEach((client) => {
          //   const services = client.services
          //   const groupedServices = services.reduce((r, a) => {
          //     r[a.name] = [...r[a.name] || [], a]
          //     return r
          //   }, {})
          //   const groupedServicesArray = Object.keys(groupedServices).map((key) => {
          //     return { name: key, count: groupedServices[key].length }
          //   })
          //   client.servicesCount = groupedServicesArray
          // })
          this.searchResults = clients.data
        })
        .finally(() => {
          this.loadingDataTable = false
        })
    },
    getClientBySearchButton () {
      if (this.search) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/clients/${this.search}?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}&referer=${this.$route.query.referer}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', this.search || this.$route.params.search)
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: `/clients?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}&referer=${this.$route.query.referer}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', '')
        this.loadingDataTable = false
      }
    },
    getClientBySearch (selectedResult = null) {
      if (selectedResult) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/client/${selectedResult.id}?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}&referer=${this.$route.query.referer}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', this.searchClientInput || this.$route.params.search)
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: `/clients?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}&referer=${this.$route.query.referer}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', '')
        this.loadingDataTable = false
      }
    },
    processAddresses (service) {
      if (!service) { return 'Sin Direccion' }
      const address = service?.address
      const serviceAddresses = service?.service_addresses
      if (address && !serviceAddresses) { return address }
      if (address && serviceAddresses.length === 0) { return address }
      if (!address && serviceAddresses.length < 1) { return 'Sin Dirección' }
      if (address && serviceAddresses.length > 0) { return serviceAddresses.at(-1).address }
      if (!address && serviceAddresses.length > 0) { return serviceAddresses.at(-1).address }
    },
    processAddressesNeighborhood (service) {
      if (!service) { return 'Sin Barrio' }
      const addresses = service.service_addresses
      const neighborhood = service.neighborhood
      if (neighborhood && !addresses) { return neighborhood.name }
      if (neighborhood && addresses.length === 0) { return neighborhood.name }
      if (!neighborhood && addresses.length < 1) { return 'Sin Barrio' }
      if (neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
      if (!neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (!neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
    }
  }
}
</script>
