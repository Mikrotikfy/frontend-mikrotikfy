<template>
  <v-container fluid>
    <div v-if="clients.length < 1 && !$route.params.search && clienttype">
      <v-row class="justify-center">
        <h4>Crea un cliente</h4>
      </v-row>
      <v-row class="justify-center">
        <v-fab-transition>
          <v-btn
            color="blue darken-4 elevation-0"
            fab
            large
            dark
            @click="createDialog = true"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-row>
    </div>
    <v-row v-else-if="clients.length < 1 && $route.params.search" class="justify-center">
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
                :items.sync="clients"
                :server-items-length="clientCount()"
                :items-per-page.sync="itemsPerPage"
                :page.sync="page"
                :options.sync="options"
                :loading="loadingDataTable"
                :item-class="clienttype.name === 'INTERNET' ? itemRowBackground : ''"
                no-data-text="No hay resultados a la busqueda..."
                loading-text="Cargando información de clientes..."
                dense
                hide-default-footer
                mobile-breakpoint="100"
                @page-count="pageCount = $event"
              >
                <template v-slot:top>
                  <div class="mb-4">
                    <v-btn
                      color="blue darken-4 white--text"
                      dark
                      elevation="0"
                      rounded
                      class="mr-2"
                      @click="createDialog = true"
                    >
                      <v-icon>mdi-plus</v-icon>
                      Nuevo Cliente
                    </v-btn>
                    <v-btn
                      color="white black--text"
                      dark
                      rounded
                      class="mr-4"
                      elevation="0"
                      :disabled="refreshLoading"
                      :loading="refreshLoading"
                      @click="refreshActiveClients"
                    >
                      <v-icon>mdi-reload</v-icon>
                    </v-btn>
                    <v-spacer />
                    <!-- <v-text-field
                      :value="options.itemsPerPage"
                      label="Clientes por Pagina"
                      type="number"
                      min="5"
                      max="50"
                      width="80px"
                      hide-details
                      @input="options.itemsPerPage = parseInt($event, 10)"
                    /> -->
                  </div>
                </template>
                <template v-if="clienttype.name === 'INTERNET'" v-slot:[`item.plan.name`]="props">
                  <v-edit-dialog
                    ref="dialog"
                    :return-value.sync="props.item.plan"
                    large
                    cancel-text="Cancelar"
                    save-text="Guardar"
                    @save="savePlanFromModal(props.item.id, props.item.plan, isRx, $store.state.auth.username, props.item)"
                    @cancel="cancel()"
                  >
                    <v-chip small :class=" props.item.plan.name === 'EN MORA' || props.item.plan.name === 'RETIRADO' ? 'red darken-4' : 'white black--text'">
                      {{ props.item.plan.name }}
                    </v-chip>
                    <template v-slot:input>
                      <v-checkbox
                        v-model="isRx"
                        label="Es reconexion?"
                      />
                      <v-select
                        :value="props.item.plan"
                        item-text="name"
                        item-value="id"
                        :items="plans"
                        return-object
                        single-line
                        label="Plan"
                        dense
                        @change="updatePlanFromModal(props.item.id, $event, clients.map(function(x) {return x.id; }).indexOf(props.item.id))"
                      />
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:[`item.code`]="{ item }">
                  <span v-if="clienttype.name === 'INTERNET'" :class="item.status === 'green' ? 'online-text' : 'offline-text'">
                    {{ item.code }}
                  </span>
                  <span v-else :class="item.active ? 'online-text' : 'offline-text'">
                    {{ item.code }}
                  </span>
                </template>
                <template v-slot:[`item.technology.name`]="{ item }">
                  <v-chip small class="white black--text">
                    {{ item.technology ? item.technology.name : 'No Reg.' }}
                  </v-chip>
                </template>
                <template v-slot:[`item.newModel`]="{ item }">
                  <svg height="13" width="20">
                    <circle cx="10" cy="8" r="5" :fill="getModel(item.newModel)" />
                  </svg>
                </template>
                <template v-if="clienttype.name === 'INTERNET'" v-slot:[`item.active`]="props">
                  <div style="white-space:nowrap;display:inline-flex">
                    <v-tooltip v-if="$isAdmin()" left>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          :color="props.item.active ? 'green darken-3' : 'red darken-3'"
                          dark
                          small
                          :loading="props.item.loading"
                          v-bind="attrs"
                          text
                          v-on="on"
                          @click="updateStatus(props.item, clients.map(function(x) {return x.id; }).indexOf(props.item.id))"
                        >
                          <v-icon>mdi-{{ props.item.active ? 'check' : 'close' }} {{ props.index }}</v-icon>
                        </v-btn>
                      </template>
                      <span>Activar Cliente</span>
                    </v-tooltip>
                    <MiscActivationRequest
                      :item="props.item"
                      :index="clients.indexOf(props.item)"
                    />
                  </div>
                </template>
                <template v-else v-slot:[`item.active`]="props">
                  <v-edit-dialog
                    ref="dialog"
                    large
                    cancel-text="Cancelar"
                    save-text="Guardar"
                    @save="saveActiveFromModal(props.item.id, dxreason, props.item.active, clients.map(function(x) {return x.id; }).indexOf(props.item.id))"
                    @cancel="cancel()"
                  >
                    <v-chip
                      small
                      :color="getColor(props.item.active)"
                      class="white--text"
                    >
                      {{ getState(props.item.active) }}
                    </v-chip>
                    <template v-slot:input>
                      <v-checkbox
                        :input-value="props.item.active"
                        label="Cliente activo?"
                        @change="updateStatusFromModal($event, clients.map(function(x) {return x.id; }).indexOf(props.item.id))"
                      />
                      <v-select
                        v-if="!props.item.active"
                        :value="dxreason"
                        item-text="name"
                        item-value="id"
                        :items="dxreasons"
                        return-object
                        single-line
                        label="Establecer como"
                        dense
                      />
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:[`item.actions`]="{ item }">
                  <div style="white-space:nowrap">
                    <CreateTicket
                      :client="item"
                      :assignated="$store.state.auth.id"
                    />
                    <TicketHistory
                      :clientid="item.id"
                      :name="item.name"
                    />
                    <ClientStatus
                      v-if="clienttype.name === 'INTERNET'"
                      :name="item.name"
                      :clientid="item.id"
                      :code="item.code"
                      :item="item"
                      :index="clients.indexOf(item)"
                    />
                    <MainDevices
                      v-if="clienttype.name === 'INTERNET'"
                      :name="item.name"
                      :clientid="item.id"
                    />
                    <EditForm
                      :client="item"
                      :index="clients.indexOf(item)"
                      @updateSuccess="getClientBySearch()"
                    />
                  </div>
                </template>
              </v-data-table>
            </client-only>
            <!-- <v-row>
              <v-col cols="12" sm="8" md="10" lg="11" style="max-width:90%;margin:auto;">
                <v-pagination
                  v-model="pagination.page"
                  :length="pagination.pageCount"
                  :total-visible="6"
                />
              </v-col>
            </v-row> -->
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="createDialog" max-width="1150px" :retain-focus="false">
      <v-card>
        <v-card-title>
          <v-toolbar
            elevation="0"
          >
            <v-btn
              icon
              @click="createDialog = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title><span class="headline">Crear Cliente de {{ clienttype.name }} en {{ currentCity.name }}</span></v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-container>
            <CreateForm
              v-if="createDialog"
              :citycolor="'blue'"
              :role="$store.state.auth.rolename"
              @createClient="createClient($event)"
              @createClientDialog="createClientDialog($event)"
              @createClientSnack="createClientSnack($event)"
            />
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import EditForm from '../edit/EditForm'
import ClientStatus from '../main/ClientStatus'
import CreateTicket from '../create/CreateTicket'
import TicketHistory from '../misc/TicketHistory'
import CreateForm from '../create/CreateForm'
export default {
  name: 'ClientList',
  components: {
    CreateForm,
    EditForm,
    ClientStatus,
    CreateTicket,
    TicketHistory
  },
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
      dxreason: null,
      dxreasons: [
        {
          id: 1,
          name: 'RETIRO VOLUNTARIO'
        },
        {
          id: 2,
          name: 'DX POR MORA'
        }
      ],
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
  },
  methods: {
    itemRowBackground (item) {
      if (this.$vuetify.theme.dark) {
        if (item.status === 'red') {
          return 'offline'
        } else {
          return 'online'
        }
      }
    },
    async refreshActiveClients () {
      this.refreshLoading = true
      const city = this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
      const clienttype = this.$route.query.clienttype
      await this.$store.dispatch('refreshActiveClients', { city, clienttype, token: this.$store.state.auth.token })
      await this.getClientStatusOnMikrotik()
      this.refreshLoading = false
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
        await this.getClientStatusOnMikrotik()
        this.loadingDataTable = false
        this.result = 'No se han encontrado resultados.'
      }
    },
    async resetsearchfn () {
      await this.$store.dispatch('client/clearClientsFromDatatable')
      await this.getClientStatusOnMikrotik()
      this.loadingDataTable = false
    },
    async getClientStatusOnMikrotik () {
      if (this.$route.query.clienttype === 'INTERNET') {
        await this.$store.dispatch('client/calculateClientStatus', this.activeClientsList)
      }
    },
    async savePlanFromModal (clientId, newPlan, isRx, operator, client) {
      // set plan by callback after the update
      this.loadingDataTable = true
      await this.$store.dispatch('client/setPlanFromModal', { clientId, newPlan, isRx, operator, token: this.$store.state.auth.token })
      this.$simpleTelegramUpdatePlan({ client, operator, isRx, telegramBots: this.telegramBots })
      this.loadingDataTable = false
    },
    async saveActiveFromModal (clientid, dxreason, active, index) {
      await this.$store.dispatch('client/setActiveFromModal', { clientid, dxreason, active, index, token: this.$store.state.auth.token })
      this.dxreason = null
    },
    updatePlanFromModal (clientid, newPlan, index) {
      this.$store.dispatch('client/updateFromModal', { clientid, newPlan, index })
    },
    cancel () {
      return true
    },
    getModel (model) {
      if (model === 0) {
        return 'grey'
      } else if (model === 1) {
        if (this.$vuetify.theme.dark) {
          return 'white'
        } else {
          return 'black'
        }
      }
    },
    clientCount () {
      return parseInt(localStorage.getItem('clientCount'))
    },
    createClientDialog (value) {
      this.createDialog = false
    },
    createClientSnack (value) {
      this.$toast.success('Cliente creado con exito', { duration: 4000, position: 'top-center' })
    },
    updateStatus (client, index) {
      if (client.active === true) {
        this.$store.dispatch('client/adminDelete', { client, index, token: this.$store.state.auth.token, operator: this.$store.state.auth.username })
      } else {
        this.$store.dispatch('client/adminCreate', { client, index, token: this.$store.state.auth.token, operator: this.$store.state.auth.username })
      }
    },
    updateStatusFromModal (active, index) {
      this.$store.commit('client/setActiveFromModal', { active, index })
    },
    async getHeadersByClientType () {
      const city = this.$route.query.city
      const clienttype = this.$route.query.clienttype
      await this.$store.dispatch('client/getHeadersByClientType', { city, clienttype, token: this.$store.state.auth.token })
    },
    getColor (state) {
      if (state) {
        return 'blue'
      } else {
        return 'red'
      }
    },
    getState (state) {
      if (state) {
        return 'Activo'
      } else {
        return 'Desconectado'
      }
    }
  }
}
</script>

<style>
.done {
  text-decoration: line-through;
}
.offline {
  background-color: #291f1f;
}
.offline-text {
  color: #ff254e;
}
.online-text {
  color:#3be03b;
}
.online {
  background-color: #1f291f;
}
</style>
