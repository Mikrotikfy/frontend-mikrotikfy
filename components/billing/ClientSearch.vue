<template>
  <v-row class="justify-center w-100">
    <v-col
      cols="12"
    >
      <v-row
        class="mx-1 mt-1 mb-1 justify-center d-flex"
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
          hide-details
          auto-select-first
          return-object
          solo
          rounded
          no-data-text="Realiza una busqueda para iniciar..."
          :loading="loadingDataTable"
          class="white--text"
          style="width:100px;max-width: 600px;border-radius: 0 30px 30px 0;"
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
                    class="mr-1"
                    v-bind="attrs"
                    v-on="on"
                    @click="getClientBySearchFromService(service)"
                  >
                    <v-icon
                      :color="service.active ? service.indebt ? 'red darkne-2' : 'green darken-2' : service.indebt ? 'gray' : 'red darken-4'"
                      class="mr-1"
                    >
                      {{ service.name === 'INTERNET' ? 'mdi-wifi' : 'mdi-television' }}
                    </v-icon>
                    {{ service.code }} {{ service.balance ? `$${service.balance}` : 'Al Dia' }}
                  </v-chip>
                </template>
                <span>{{ `${processAddresses(service)} ${processAddressesNeighborhood(service)}` }}</span>
              </v-tooltip>
            </v-list-item-action>
          </template>
        </v-autocomplete>
      </v-row>
    </v-col>
  </v-row>
</template>
<script>
import { debounce } from 'lodash'
export default {
  name: 'ClientSearch',
  data () {
    return {
      search: null,
      searchResults: [],
      select: null,
      loadingDataTable: false,
      selectedCity: null
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.name == this.$route.query.city) : ''
    },
    cities () {
      return this.$store.state.auth.cities
    }
  },
  watch: {
    search (val) {
      val && val !== this.select && val !== null && this.debounceSearchInDatabase(val)
    },
    select (resultObject) {
      if (this.search && resultObject.services.length === 1) {
        this.getClientBySearchFromClient(resultObject)
      }
    }
  },
  mounted () {
    this.setSelectedCity()
  },
  methods: {
    text: item => `${item.code} - ${item.name} - ${item.dni}`,
    changeCity (city) {
      this.$router.push({ query: { city: city.name, clienttype: this.$route.query.clienttype, view: this.$route.query.view } })
    },
    setSelectedCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    debounceSearchInDatabase: debounce(function (val) {
      this.searchInDatabase(val)
    }, 300),
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
        populate: ['services', 'services.service_addresses', 'services.service_addresses.neighborhood', 'services.plan', 'services.offer', 'services.offer.plan', 'services.offermovements.offer', 'services.offermovements', 'services.debtmovements', 'services.debtmovements.technician']
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
          clients.map((client) => {
            client.code = client.services.length > 0 ? client.services.filter((service) => {
              return service.code === val
            })[0].code : ''
          })
          this.searchResults = clients
        })
        .finally(() => {
          this.loadingDataTable = false
        })
    },
    getClientBySearchFromService (service) {
      this.$store.commit('billing/resetInvoices')
      this.$store.commit('billing/resetSelected')
      this.$store.commit('billing/resetCurrentClient')
      this.$store.commit('billing/setShowPayedToFalse')
      this.$store.commit('billing/getClientsBySearch', service)
      if (service) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/billing/${service.id}?city=${this.$route.query.city}`
        })
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: `/billing?city=${this.$route.query.city}`
        })
        this.loadingDataTable = false
      }
    },
    getClientBySearchFromClient (client) {
      this.$store.commit('billing/resetInvoices')
      this.$store.commit('billing/resetSelected')
      this.$store.commit('billing/resetCurrentClient')
      this.$store.commit('billing/setShowPayedToFalse')
      this.$store.commit('billing/getClientsBySearch', client)
      if (client) {
        this.loadingDataTable = true
        this.$router.push({
          path: `/billing/${client.services[0].id}?city=${this.$route.query.city}`
        })
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: `/billing?city=${this.$route.query.city}`
        })
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
