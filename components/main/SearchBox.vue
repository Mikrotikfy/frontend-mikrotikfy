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
          <v-select
            v-model="selectedCity"
            :items="cities"
            label="Filtrar Ciudad"
            item-value="id"
            item-text="name"
            return-object
            solo
            rounded
            hide-details="auto"
            class="elevation-0"
            style="max-width:180px;border-radius: 30px 0 0 30px;height:48px;"
            @change="changeCity(selectedCity)"
          >
            <template v-slot:item="{ item }">
              {{ item.name }}
            </template>
          </v-select>
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
                <v-list-item-title class="text-caption" v-text="`${item.code} / ${item.dni} / ${item.name} / ${item.phone}`" />
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
                      :to="`/client/${item.id}?service=${service.id}`"
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
      selectedCity: null,
      searchResults: null,
      loadingDataTable: false,
      searchByAddress: false
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.id == this.$route.query.city) : ''
    },
    cities () {
      return this.$store.state.auth.cities
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
    this.setSelectedCity()
    this.searchClientInput = this.$route.params.search
    this.searchByAddress = this.$route.query.fuzzy === 'true'
  },
  methods: {
    text: item => `${item.code} - ${item.dni} - ${item.name} - ${item.phone}`,
    changeCity (city) {
      this.$router.push({ query: { city: city.name } })
    },
    setSelectedCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    searchInDatabase (val) {
      if (val.length < 1) { return }
      this.loadingDataTable = true
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          $and: [
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
            },
            {
              services: {
                city: this.selectedCity.id
              }
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
        .then(({ data: clients }) => {
          if (!Array.isArray(clients)) {
            throw new TypeError('Invalid data: clients is not an array')
          }
          clients.map((client) => {
            if (!Array.isArray(client.services)) {
              throw new TypeError(`Invalid data: client ${client.id} has invalid services`)
            }
            const service = client.services.find(service => service.code === val)
            client.code = service ? service.code : 'N/A'
          })
          this.searchResults = clients
          this.loadingDataTable = false
        })
    },
    getClientBySearchButton () {
      if (this.search) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/client/${this.search}?city=${this.$route.query.city}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', this.search || this.$route.params.search)
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: `/client?city=${this.$route.query.city}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', '')
        this.loadingDataTable = false
      }
    },
    getClientBySearch (selectedResult = null) {
      if (selectedResult) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/client/${selectedResult.id}?service=${this.$route.query.service}&city=${this.$route.query.city}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', this.searchClientInput || this.$route.params.search)
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: `/client?city=${this.$route.query.city}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
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
