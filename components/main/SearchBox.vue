<template>
  <v-container fluid>
    <div
      v-if="!$store.state.isDesktop"
      class="d-flex"
    >
      <div>
        <v-select
          v-model="selectedCity"
          :items="cities"
          label="Ciudad"
          item-value="id"
          item-text="name"
          return-object
          filled
          dense
          rounded
          hide-details="auto"
          class="elevation-0"
          style="border-radius: 30px 0 0 30px;height:48px;"
          @change="changeCity(selectedCity)"
        >
          <template v-slot:selection="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </div>
      <div>
        <v-select
          v-model="selectedClienttype"
          :items="clienttypes"
          label="Tipo"
          item-value="id"
          item-text="name"
          return-object
          filled
          dense
          rounded
          hide-details="auto"
          class="elevation-0"
          style="border-radius: 0 30px 30px 0;height:48px;"
          @change="changeType(selectedClienttype)"
        >
          <template v-slot:selection="{ item }">
            {{ item.name }}
          </template>
        </v-select>
      </div>
    </div>
    <div
      class="mt-4 justify-center d-flex"
    >
      <v-select
        v-if="$store.state.isDesktop"
        v-model="selectedCity"
        :items="cities"
        label="Ciudad"
        item-value="id"
        item-text="name"
        return-object
        solo
        rounded
        hide-details="auto"
        class="elevation-0 mr-1"
        style="max-width:180px;border-radius: 30px 0 0 30px;height:48px;"
        @change="changeCity(selectedCity)"
      >
        <template v-slot:selection="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-select
        v-if="$store.state.isDesktop"
        v-model="selectedClienttype"
        :items="clienttypes"
        label="Tipo"
        item-value="id"
        item-text="name"
        return-object
        solo
        rounded
        hide-details="auto"
        class="elevation-0 mr-1"
        style="max-width:180px;border-radius: 0;height:48px;"
        @change="changeType(selectedClienttype)"
      >
        <template v-slot:selection="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-text-field
        v-if="searchByAddress"
        v-model="search"
        :label="loadingDataTable ? 'Cargando... Por favor espere.' : 'Buscar por direccion o barrio'"
        :item-text="text"
        item-value="id"
        hide-details
        return-object
        chips
        solo
        rounded
        :loading="loadingDataTable"
        class="white--text"
        style="width:100px;max-width: 1100px;"
        :style="$store.state.isDesktop ? 'border-radius: 0;' : 'border-radius: 30px 0 0 30px;'"
        @keyup.enter="searchClients(select)"
      />
      <v-autocomplete
        v-else
        v-model="select"
        :items="searchResults"
        :label="loadingDataTable ? 'Cargando... Por favor espere.' : 'Buscar por código, nombre, telefono o email'"
        :search-input.sync="search"
        :item-text="text"
        item-value="id"
        prepend-inner-icon="mdi-magnify"
        placeholder="Buscar por código, cedula, nombre o telefono..."
        persistent-placeholder
        clearable
        divider
        hide-details
        auto-select-first
        return-object
        chips
        solo
        rounded
        :loading="loadingDataTable"
        :no-data-text="search ? `No hay resultados para '${search}' en ${selectedClienttype.name} de ${selectedCity.name}...` : 'Ingrese un valor para buscar'"
        class="white--text"
        style="width:100px;max-width: 1100px;"
        :style="$store.state.isDesktop ? 'border-radius: 0;' : 'border-radius: 30px 0 0 30px;'"
      >
        <template v-slot:item="{ item }">
          <v-list-item-content>
            <v-list-item-title class="text-caption">
              {{ item.name }}
            </v-list-item-title>
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
                  @click="getClientBySearch(item, service, fromChip = true)"
                >
                  <v-icon
                    :color="service.active ? service.indebt ? 'red darkne-2' : 'green darken-2' : service.indebt ? 'gray' : 'red darken-4'"
                  >
                    {{ service.name === 'INTERNET' ? 'mdi-wifi' : 'mdi-television' }}
                  </v-icon>
                  <span style="font-size:0.8rem;">
                    {{ service.code }} {{ service.neighborhood }}
                  </span>
                </v-chip>
              </template>
              <span>{{ `${processAddresses(service)} ${processAddressesNeighborhood(service)}` }}</span>
            </v-tooltip>
          </v-list-item-action>
        </template>
      </v-autocomplete>
      <v-tooltip>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            v-if="searchByAddress"
            :color="fuzzySearch ? 'primary white--text elevation-0' : 'grey lighten-4 black--text elevation-0'"
            dark
            :loading="loadingDataTable"
            tile
            style="border-radius: 0;padding:5px;height:48px;"
            v-bind="attrs"
            v-on="on"
            @click="fuzzySearch = !fuzzySearch"
          >
            <v-icon>mdi-filter-outline</v-icon>
          </v-btn>
        </template>
        <span>Busqueda por direccion</span>
      </v-tooltip>
      <v-btn
        :color="searchByAddress ? 'primary white--text elevation-0' : 'grey lighten-4 black--text elevation-0'"
        dark
        :loading="loadingDataTable"
        tile
        style="border-radius: 0 30px 30px 0;padding:5px;height:48px;"
        @click="searchByAddress ? toGoClient() : toGoClientAddress()"
      >
        <v-icon>{{ searchByAddress ? 'mdi-close-circle' : 'mdi-cog-outline' }}</v-icon>
      </v-btn>
    </div>
  </v-container>
</template>
<script>
import { debounce } from 'lodash'
export default {
  name: 'SearchBox',
  data () {
    return {
      search: '',
      select: null,
      fuzzySearch: false,
      selectedCity: null,
      selectedClienttype: null,
      searchResults: null,
      loadingDataTable: false,
      preventWatchRedirect: false
    }
  },
  computed: {
    searchByAddress () {
      return this.$route.path.includes('address')
    },
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.id == this.$route.query.city) : ''
    },
    cities () {
      return this.$store.state.auth.cities
    },
    clienttypes () {
      return this.$store.state.auth.clienttypes
    }
  },
  watch: {
    search (val) {
      if (!this.$route.path.includes('address')) {
        val && val !== this.select && this.debounceSearchInDatabase(val)
      }
    },
    select (resultObject) {
      this.getClientBySearch(resultObject)
    },
    fuzzySearch () {
      this.setFuzzyToStore()
    }
  },
  mounted () {
    this.setSelectedCity()
    this.setSelectedClienttype()
    if (this.$route.params.search && this.$route.path.includes('address')) {
      this.search = this.$route.params.search
    }
  },
  methods: {
    text: item => `${item.code} - ${item.dni} - ${item.name} - ${item.phone}`,
    setFuzzyToStore () {
      this.$store.commit('client/setFuzzySearch', this.fuzzySearch)
    },
    toGoClient () {
      if (this.search && this.search !== '') {
        this.$router.push({ path: `/client/${this.search}`, query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype } })
      } else {
        this.$router.push({ path: '/client', query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype } })
      }
    },
    toGoClientAddress () {
      if (this.search && this.search !== '') {
        this.$router.push({ path: `/client/address/${this.search}`, query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype } })
      } else {
        this.$router.push({ path: '/client/address', query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype } })
      }
    },
    searchClients () {
      this.$router.push({ path: `/client/address/${this.search}`, query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype, searchByAddress: this.$route.query.searchByAddress } })
    },
    changeCity (city) {
      this.$router.push({ query: { city: city.name, clienttype: this.$route.query.clienttype, searchByAddress: this.searchByAddress } })
    },
    changeType (clienttype) {
      this.$router.push({ query: { city: this.$route.query.city, clienttype: clienttype.name, searchByAddress: this.searchByAddress } })
    },
    setSelectedCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    setSelectedClienttype () {
      if (this.$route.query.clienttype) {
        this.selectedClienttype = this.$store.state.auth.clienttypes.find(c => c.name === this.$route.query.clienttype)
      }
    },
    debounceSearchInDatabase: debounce(function (val) {
      this.searchInDatabase(val)
    }, 300),
    searchInDatabase (valTrim) {
      if (valTrim.length < 1) { return }
      const val = valTrim.trim()
      let filters = {}
      if (val > 1 && val < 20000) {
        filters = {
          $and: [
            {
              services: {
                code: val
              }
            },
            {
              services: {
                city: this.selectedCity.id
              }
            },
            {
              services: {
                clienttype: this.selectedClienttype.id
              }
            }
          ]
        }
      } else {
        filters = {
          $or: [
            {
              dni: val
            },
            {
              name: {
                $contains: val
              }
            },
            {
              phone: {
                $contains: val
              }
            },
            {
              email: {
                $contains: val
              }
            }
          ]
        }
      }
      this.loadingDataTable = true
      const qs = require('qs')
      const query = qs.stringify({
        filters,
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
    getClientBySearch (selectedResult = null, service = null) {
      if (selectedResult) {
        this.loadingDataTable = true
        this.$router.push({
          query: service ? {
            search: selectedResult.id,
            city: this.$route.query.city,
            clienttype: this.$route.query.clienttype,
            service: service?.id,
            searchByAddress: this.searchByAddress
          } : {
            search: selectedResult.id,
            city: this.$route.query.city,
            clienttype: this.$route.query.clienttype,
            searchByAddress: this.searchByAddress
          }
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
