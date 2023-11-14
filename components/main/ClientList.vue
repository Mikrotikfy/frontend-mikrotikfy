<template>
  <v-container fluid>
    <v-row v-if="services.length < 1 && $route.query.search" class="justify-center">
      <v-card class="ma-4 rounded-xl" :loading="loadingDataTable">
        <v-card-text class="ma-0 text-center">
          {{ result }}
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-if="services.length > 0" class="mt-0">
      <v-col class="pt-0">
        <v-card class="elevation-0 rounded-lg">
          <v-card-text>
            <client-only>
              <v-data-table
                :headers="getHeadersByClienttype"
                :items="services"
                :items-per-page.sync="itemsPerPage"
                :loading="loadingDataTable"
                :search="filter"
                no-data-text="No hay resultados a la busqueda..."
                loading-text="Cargando información de clientes..."
                hide-default-footer
                mobile-breakpoint="100"
                @page-count="pageCount = $event"
              >
                <template v-slot:top>
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
                        :to="`/client/${item.normalized_client ? item.normalized_client.id : ''}?city=${$route.query.city}&clienttype=${$route.query.clienttype}&service=${item.id}`"
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
      itemsPerPage: 500,
      loadingDataTable: false,
      options: {},
      page: 1,
      pageCount: 0,
      pagination: {
        page: 1,
        pageSize: 500
      },
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
    fuzzySearch () {
      return this.$store.state.client.fuzzySearch
    },
    services () {
      return this.$store.state.client.services
    },
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.auth.cities ? this.$store.state.auth.cities.find(c => c.name == this.$route.query.city) : ''
    },
    getHeadersByClienttype () {
      return this.$store.state.isDesktop ? [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'client_name', sortable: false },
        { text: 'Cedula', value: 'dni', sortable: false },
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
      this.getClientBySearch()
    },
    fuzzySearch () {
      this.getClientBySearch()
    },
    '$route.query.clienttype' () {
      this.getClientBySearch()
    },
    '$route.query.city' () {
      this.getClientBySearch()
    }
    // 'pagination.page': {
    //   handler () {
    //     this.getClientBySearch()
    //   },
    //   deep: false
    // }
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
      if (!this.fuzzySearch) {
        await this.$store.dispatch('client/getServicesFromDatabaseBySearch', { search, city: this.$route.query.city, clienttype: this.$route.query.clienttype, token: this.$store.state.auth.token })
        this.loadingDataTable = false
        this.result = `No se han encontrado resultados de ${search} en ${this.$route.query.city}`
      } else {
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
