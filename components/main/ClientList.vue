<template>
  <v-container fluid>
    <v-row v-if="clients.length < 1 && $route.params.search" class="justify-center">
      <v-card :loading="loadingDataTable">
        <v-card-title>
          {{ result }}
        </v-card-title>
      </v-card>
    </v-row>
    <v-row v-if="clients.length > 0" class="mt-0">
      <v-col class="pt-0">
        <v-card class="elevation-0 rounded-xl">
          <v-card-text>
            <client-only>
              <v-data-table
                v-if="headers"
                :headers="headers"
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
                <template v-if="clienttype.name === 'INTERNET'" v-slot:[`item.plan.name`]="props">
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
                <template v-slot:[`item.address`]="{ item }">
                  {{ item.addresses.length > 0 ? item.addresses.at(-1).address : item.address }}
                </template>
                <template v-slot:[`item.neighborhood.name`]="{ item }">
                  {{ item.addresses.length > 0 ? item.addresses.at(-1).neighborhood.name : item.neighborhood.name }}
                </template>
                <template v-slot:[`item.technology.name`]="{ item }">
                  <strong>
                    {{ item.technology ? item.technology.name : 'No Reg.' }}
                  </strong>
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
    redirectToBilling () {
      this.$router.push({ path: `/billing/${this.$route.params.search}`, query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype } })
    },
    async getClientBySearch () {
      this.loadingDataTable = true
      await this.$store.dispatch('client/clearClientsFromDatatable')
      await this.getHeadersByClientType()
      const search = this.searchClientInput.trim()
      const city = this.$route.query.city
      const clienttype = this.$route.query.clienttype
      this.result = 'Buscando...'
      if (search) {
        await this.$store.dispatch('client/getUsersFromDatabaseBySearch', { search, city, clienttype, token: this.$store.state.auth.token, pagination: this.pagination })
        this.pagination = { ...this.$store.state.client.pagination }
        this.loadingDataTable = false
        this.result = 'No se han encontrado resultados de' + ' ' + search
      }
    },
    async resetsearchfn () {
      await this.$store.dispatch('client/clearClientsFromDatatable')
      this.loadingDataTable = false
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
    async getHeadersByClientType () {
      const city = this.$route.query.city
      const clienttype = this.$route.query.clienttype
      await this.$store.dispatch('client/getHeadersByClientType', { city, clienttype, token: this.$store.state.auth.token })
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
