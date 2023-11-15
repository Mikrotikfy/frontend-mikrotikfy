<template>
  <v-container fluid>
    <v-row class="mt-0">
      <v-col class="pt-0">
        <v-card class="elevation-0 rounded-lg">
          <v-card-text>
            <client-only>
              <v-data-table
                :headers="getHeadersByClienttype"
                :items="newclient && !fuzzy ? clients : services"
                :items-per-page="itemsPerPage"
                :loading="loadingDataTable"
                :search="filter"
                no-data-text="No hay resultados a la busqueda..."
                loading-text="Cargando información de clientes..."
                hide-default-footer
                mobile-breakpoint="100"
              >
                <template v-slot:top>
                  <div class="d-flex">
                    <v-checkbox
                      v-model="fuzzy"
                      label="Busqueda Avanzada por Direccion"
                      hide-details
                      class="mb-4 mr-4"
                    />
                    <v-checkbox
                      v-model="newclient"
                      label="Busqueda de clientes nuevos"
                      hide-details
                      class="mb-4"
                    />
                  </div>
                  <v-text-field
                    v-model="filter"
                    append-icon="mdi-magnify"
                    label="Filtrar resultados por Codigo, Nombre, Direccion, Telefono"
                    dense
                    outlined
                    hide-details
                  />
                </template>
                <template v-slot:[`item.dni`]="{ item, index }">
                  <v-chip
                    v-if="$store.state.isDesktop && ($isAdmin() || $isBiller())"
                    x-small
                    :color="item.corporate === null ? 'grey darken-3' : item.corporate === false ? 'blue darken-3' : 'green darken-4'"
                    @click="toggleDniType(item, index)"
                  >
                    {{ item.corporate === null ? 'No definido' : item.corporate === false ? 'Plan Hogar' : 'Corporativo' }}
                  </v-chip>
                  <v-chip
                    v-else
                    x-small
                    :color="item.corporate === null ? 'grey darken-3' : item.corporate === false ? 'blue darken-3' : 'green darken-4'"
                  >
                    {{ item.corporate === null ? 'No definido' : item.corporate === false ? 'Plan Hogar' : 'Corporativo' }}
                  </v-chip>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        v-bind="attrs"
                        icon
                        :color="$vuetify.theme.dark ? 'white' : 'green darken-4 white--text'"
                        class="rounded-xl"
                        :to="newclient
                          ? `/client/${item.id}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`
                          : `/client/${item.normalized_client ? item.normalized_client.id : ''}?city=${$route.query.city}&clienttype=${$route.query.clienttype}&service=${item.id}`"
                        v-on="on"
                      >
                        <v-icon>
                          mdi-account
                        </v-icon>
                      </v-btn>
                    </template>
                    <span>Cliente</span>
                  </v-tooltip>
                </template>
              </v-data-table>
            </client-only>
            <v-row v-if="pagination.pageCount > 1">
              <v-col>
                <div class="text-center pt-2">
                  <v-pagination
                    v-model="page"
                    :disabled="loadingDataTable"
                    :length="pagination.pageCount"
                    @input="getClientBySearch"
                  />
                </div>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'ClientList',
  data () {
    return {
      isRx: true,
      fuzzy: false,
      newclient: false,
      loadingDataTable: false,
      options: {},
      page: 1,
      itemsPerPage: 25,
      update_password: false,
      refreshLoading: false,
      searchClientInput: '',
      result: '',
      filter: ''
    }
  },
  computed: {
    search () {
      return this.$route.query.search
    },
    services () {
      return this.$store.state.client.services
    },
    clients () {
      return this.$store.state.client.clients
    },
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.auth.cities ? this.$store.state.auth.cities.find(c => c.name == this.$route.query.city) : ''
    },
    pagination () {
      return this.$store.state.client.pagination
    },
    getHeadersByClienttype () {
      return this.$store.state.isDesktop ? this.newclient ? [
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Cedula', value: 'dni', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ] : [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'client_name', sortable: false },
        { text: 'Direccion', sortable: false, value: 'address' },
        { text: 'Barrio', value: 'neighborhood', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ] : [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'client_name', sortable: false },
        { text: 'Direccion', sortable: false, value: 'address' },
        { text: 'Barrio', value: 'neighborhood', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ]
    }
  },
  watch: {
    search () {
      this.page = 1
      this.getClientBySearch()
    },
    fuzzy () {
      this.getClientBySearch()
    },
    newclient () {
      this.getClientBySearch()
    },
    '$route.query.clienttype' () {
      this.page = 1
      this.getClientBySearch()
    },
    '$route.query.city' () {
      this.page = 1
      this.getClientBySearch()
    }
  },
  mounted () {
    if (this.search) {
      this.getClientBySearch()
    } else {
      this.resetsearchfn()
    }
  },
  methods: {
    toggleDniType (client, index) {
      const dniType = !client.corporate
      this.$store.dispatch('client/updateDniType', { client, corporate: dniType, index, token: this.$store.state.auth.token })
    },
    async getClientBySearch () {
      this.loadingDataTable = true
      await this.$store.dispatch('client/clearServicesFromDatatable')
      const search = this.search.trim()
      this.setSearchText()
      if (!this.fuzzy && !this.newclient) {
        await this.$store.dispatch('client/getServicesFromDatabaseBySearch', { search, city: this.$route.query.city, clienttype: this.$route.query.clienttype, token: this.$store.state.auth.token, page: this.page })
        this.loadingDataTable = false
        this.result = `No se han encontrado resultados de ${search} en ${this.$route.query.city}`
      } else if (!this.fuzzy && this.newclient) {
        await this.$store.dispatch('client/getClientsFromDatabaseBySearch', { search, city: this.$route.query.city, clienttype: this.$route.query.clienttype, token: this.$store.state.auth.token })
        this.loadingDataTable = false
        this.result = `No se han encontrado resultados de ${search} en ${this.$route.query.city}`
      } else if (this.fuzzy && !this.newclient) {
        await this.$store.dispatch('client/getServicesFromDatabaseByFuzzySearch', { search, city: this.$route.query.city, clienttype: this.$route.query.clienttype, token: this.$store.state.auth.token })
        this.loadingDataTable = false
        this.result = `No se han encontrado resultados de ${search} en ${this.$route.query.city}`
      }
    },
    async resetsearchfn () {
      await this.$store.dispatch('client/clearClientsFromDatatable')
      this.loadingDataTable = false
    },
    setSearchText () {
      this.result = 'Buscando...'
    },
    clientCount () {
      return parseInt(localStorage.getItem('clientCount'))
    },
    createClientDialog (value) {
      this.createDialog = false
    },
    createClientSnack (value) {
      this.$toast.success('Cliente creado con exito', { duration: 4000, position: 'bottom-center' })
    },
    formatCurrency (client) {
      if (client.balance === null) { return '0' }
      return client.balance.toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })
    }
  }
}
</script>

<style>
.done {
  text-decoration: line-through;
}
.offline-text {
  font-weight: bold;
  font-size:1rem;
}
.online-text {
  font-weight: bold;
  font-size:1rem;
}
</style>
