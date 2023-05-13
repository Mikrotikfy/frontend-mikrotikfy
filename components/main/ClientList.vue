<template>
  <v-container fluid>
    <v-row v-if="clients.length < 1 && $route.params.search" class="justify-center">
      <v-card class="ma-4 rounded-xl" :loading="loadingDataTable">
        <v-card-text class="ma-0 text-center">
          {{ result }}
        </v-card-text>
      </v-card>
    </v-row>
    <v-row v-if="clients.length > 0" class="mt-0">
      <v-col class="pt-0">
        <v-card class="elevation-0 rounded-xl">
          <v-card-text>
            <client-only>
              <v-data-table
                :headers="getHeadersByClienttype"
                :items="clients"
                :server-items-length="clientCount()"
                :items-per-page.sync="itemsPerPage"
                :page.sync="page"
                :options.sync="options"
                :loading="loadingDataTable"
                no-data-text="No hay resultados a la busqueda..."
                loading-text="Cargando información de clientes..."
                hide-default-footer
                mobile-breakpoint="100"
                @page-count="pageCount = $event"
              >
                <template v-slot:[`item.active`]="props">
                  <MainClientControl :client="props.item" :index="clients.map(function(x) {return x.id; }).indexOf(props.item.id)" />
                </template>
                <template v-slot:[`item.code`]="{ item }">
                  <span v-if="clienttype.name === 'INTERNET'" :class="item.status === 'green' ? 'online-text' : 'offline-text'">
                    {{ item.code }}
                  </span>
                  <span v-else :class="item.active ? 'online-text' : 'offline-text'">
                    {{ item.code }}
                  </span>
                </template>
                <template v-slot:[`item.dni`]="{ item, index }">
                  {{ item.dni }}
                  <v-chip
                    x-small
                    :color="item.corporate === null ? 'grey darken-3' : item.corporate === false ? 'blue darken-3' : 'green darken-4'"
                    @click="toggleDniType(item, index)"
                  >
                    {{ item.corporate === null ? 'No definido' : item.corporate === false ? 'Plan Hogar' : 'Corporativo' }}
                  </v-chip>
                </template>
                <template v-slot:[`item.address`]="{ item }">
                  {{ processAddresses(item) }}
                </template>
                <template v-slot:[`item.neighborhood.name`]="{ item }">
                  {{ processAddressesNeighborhood(item) }}
                </template>
                <template v-slot:[`item.technology.name`]="{ item }">
                  <strong>
                    {{ item.technology ? item.technology.name : 'No Reg.' }}
                  </strong>
                </template>
                <template v-slot:[`item.update_password`]="{ item, index }">
                  <v-checkbox
                    v-if="clienttype.name === 'INTERNET'"
                    :input-value="item.update_password"
                    :disabled="!item.active || item.indebt"
                    hide-details
                    class="mt-0"
                    @click="updatePassword(item, item.update_password, index)"
                  />
                </template>
                <template v-slot:[`item.actions`]="{ item, index }">
                  <div style="white-space:nowrap">
                    <CreateTicket
                      :client="item"
                      :assignated="$store.state.auth.id"
                    />
                    <MainClientStatus
                      v-if="clienttype.name === 'INTERNET'"
                      :name="item.name"
                      :clientid="item.id"
                      :code="item.code"
                      :item="item"
                      :index="clients.indexOf(item)"
                    />
                    <ControlCenter
                      :client="item"
                      :index="index"
                    />
                    <BillingAuxBillingList
                      :client="item"
                      :index="index"
                    />
                  </div>
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
  props: {
    search: {
      type: String,
      default: ''
    },
    resetsearch: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      createDialog: false,
      isRx: true,
      itemsPerPage: 15,
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
      result: ''
    }
  },
  computed: {
    clients () {
      return this.$store.state.client.clients
    },
    headers () {
      return this.$store.state.client.headers
    },
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.name == this.$route.query.city) : ''
    },
    plans () {
      return this.$store.state.plans
    },
    neighborhoods () {
      return this.$store.state.neighborhoods
    },
    technologies () {
      return this.$store.state.technologies
    },
    activeClientsList () {
      return this.$store.state.activeClientsList
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    },
    clienttype () {
      return this.$store.state.clienttypes ? this.$store.state.clienttypes.find(type => type.name === this.$route.query.clienttype) : ''
    },
    getHeadersByClienttype () {
      return this.$route.query.clienttype === 'INTERNET' ? this.$store.state.isDesktop ? this.$isAdmin() ? [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Cedula', value: 'dni', sortable: false },
        { text: 'Direccion', sortable: false, value: 'address' },
        { text: 'Barrio', value: 'neighborhood.name', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Tarifa', value: 'active', sortable: false },
        { text: 'Tecnologia', value: 'technology.name', sortable: false },
        { text: 'Clave', value: 'update_password', sortable: false },
        { text: 'Acciones', value: 'actions', sortable: false }
      ] : [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Cedula', value: 'dni', sortable: false },
        { text: 'Direccion', sortable: false, value: 'address' },
        { text: 'Barrio', value: 'neighborhood.name', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Tarifa', value: 'active', sortable: false },
        { text: 'Tecnologia', value: 'technology.name', sortable: false },
        { text: 'Acciones', value: 'actions', sortable: false }
      ] : [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Direccion', sortable: false, value: 'address' },
        { text: 'Barrio', value: 'neighborhood.name', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Tarifa', value: 'active', sortable: false },
        { text: 'Acciones', value: 'actions', sortable: false }
      ] : this.$store.state.isDesktop ? [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Cedula', value: 'dni', sortable: false },
        { text: 'Direccion', sortable: false, value: 'address' },
        { text: 'Barrio', value: 'neighborhood.name', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Estado', sortable: false, value: 'active' },
        { text: 'Televisores', sortable: true, value: 'tvspec.tvs' },
        { text: 'Altos', sortable: true, value: 'tvspec.high' },
        { text: 'Bajos', sortable: true, value: 'tvspec.down' },
        { text: 'Calidad', sortable: true, value: 'tvspec.tvspectype.name' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ] : [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Cedula', value: 'dni', sortable: false },
        { text: 'Direccion', sortable: false, value: 'address' },
        { text: 'Barrio', value: 'neighborhood.name', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Estado', sortable: false, value: 'active' },
        { text: 'Acciones', value: 'actions', sortable: false }
      ]
    }
  },
  watch: {
    $route () {
      this.getClientBySearch()
    },
    'pagination.page': {
      handler () {
        this.getClientBySearch()
      },
      deep: false
    }
  },
  mounted () {
    if (this.search) {
      this.searchClientInput = this.search
      this.getClientBySearch()
    } else {
      this.resetsearchfn()
    }
    document.onkeydown = function (e) {
      if (e.key === 'o' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()

        this.redirectToBilling()
      }
    }.bind(this)
  },
  methods: {
    toggleDniType (client, index) {
      const dniType = !client.corporate
      this.$store.dispatch('client/updateDniType', { client, corporate: dniType, index, token: this.$store.state.auth.token })
    },
    updatePassword (client, updatePasswordStatus, index) {
      const updatePassword = !updatePasswordStatus
      this.$store.dispatch('client/updatePassword', { client, updatePassword, index, token: this.$store.state.auth.token })
    },
    redirectToBilling () {
      this.$router.push({ path: `/billing/${this.$route.params.search}`, query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype } })
    },
    async getClientBySearch () {
      this.loadingDataTable = true
      await this.$store.dispatch('client/clearClientsFromDatatable')
      const search = this.searchClientInput.trim()
      this.setSearchText()
      if (search) {
        await this.$store.dispatch('client/getUsersFromDatabaseBySearch', { search, city: this.$route.query.city, clienttype: this.$route.query.clienttype, token: this.$store.state.auth.token, pagination: this.pagination })
        this.pagination = { ...this.$store.state.client.pagination }
        this.loadingDataTable = false
        this.result = 'No se han encontrado resultados de' + ' ' + search
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
    processAddresses (client) {
      if (!client) { return 'Sin Direccion' }
      const address = client?.address
      const addresses = client?.addresses
      if (!address && !addresses) { return 'Sin Dirección' }
      if (address && !addresses) { return client.address }
      if (address && addresses.length > 0) { return addresses.at(-1).address }
      if (!address && addresses.length > 0) { return addresses.at(-1).address }
    },
    processAddressesNeighborhood (client) {
      if (!client) { return 'Sin Barrio' }
      const addresses = client.addresses3
      const neighborhood = client.neighborhood
      if (!neighborhood && !addresses) { return 'Sin Barrio' }
      if (neighborhood && !addresses) { return neighborhood.name }
      if (neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
      if (!neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (!neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
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
