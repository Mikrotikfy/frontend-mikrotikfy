<template>
  <v-container fluid class="no-printme">
    <v-row>
      <v-col
        cols="12"
      >
        <v-card
          fluid
          class="rounded-xl"
        >
          <v-card-text
            class="pa-1"
          >
            <v-slide-group>
              <v-slide-item
                v-slot="{ active, toggle }"
              >
                <v-btn
                  class="my-2 ml-2 mr-1"
                  color="white black--text"
                  :input-value="active"
                  dark
                  rounded
                  small
                  :disabled="initialLoading"
                  :loading="initialLoading"
                  @click="initIntervalAndGetTickets(), toggle"
                >
                  <v-icon>mdi-reload</v-icon>
                </v-btn>
              </v-slide-item>
              <v-slide-item
                v-slot="{ active, toggle }"
              >
                <MiscPrintTicket
                  v-if="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && (!showClosedValue && !showClosedValue) && $store.state.isDesktop"
                  :tickets="selected"
                  :input-value="active"
                  @click="toggle"
                />
              </v-slide-item>
              <v-slide-item
                v-slot="{ active, toggle }"
              >
                <MiscPrintOrder
                  v-if="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && (!showClosedValue && !showClosedValue) && $store.state.isDesktop"
                  :tickets="selected"
                  :input-value="active"
                  @click="toggle"
                />
              </v-slide-item>
              <v-slide-item
                v-slot="{ active, toggle }"
              >
                <v-menu offset-y>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      color="white black--text"
                      dark
                      small
                      class="my-2 mr-1 rounded-xl"
                      v-bind="attrs"
                      :input-value="active"
                      v-on="on"
                      @click="toggle"
                    >
                      <v-icon class="black--text">
                        mdi-list-status
                      </v-icon>
                      {{ $store.state.isDesktop ? 'Filtros' : '' }}
                    </v-btn>
                  </template>
                  <v-list>
                    <v-list-item>
                      <v-checkbox
                        v-model="showClosedValue"
                        class="mr-4"
                        label="Mostrar cerrados"
                        @change="initIntervalAndGetTickets()"
                      />
                    </v-list-item>
                    <v-list-item>
                      <v-checkbox
                        v-model="showRetired"
                        class="mr-4"
                        label="Mostrar retiros"
                        @change="initIntervalAndGetTickets()"
                      />
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-slide-item>
              <v-slide-item
                v-for="type in types"
                :key="type"
              >
                <v-btn
                  class="black--text rounded-xl mr-1 my-2"
                  :class="type === $route.query.view ? 'primary white--text' : 'grey'"
                  small
                  @click="changeView(type)"
                >
                  {{ calculateQuantity(type) }} {{ type }}
                </v-btn>
              </v-slide-item>
            </v-slide-group>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-0 pt-0">
      <v-col>
        <client-only>
          <v-data-table
            :key="key"
            v-model="selected"
            :show-select="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && $store.state.isDesktop ? true : false"
            :headers="getHeadersByClienttype"
            :items="ticketList"
            :item-class="rowStyles"
            :search="search"
            :items-per-page="itemsPerPage"
            :page.sync="page"
            :loading="initialLoading"
            :class="$store.state.isDesktop ? 'rounded-xl' : 'transparent'"
            :style="$route.query.clienttype === 'INTERNET' ? 'border-top: 2px solid cyan;' : 'border-top: 2px solid yellow;'"
            sort-by="createdAt"
            calculate-widths
            sort-desc
            no-data-text="No hay Tickets abiertos aún..."
            loading-text="Cargando información de tickets..."
            hide-default-footer
            mobile-breakpoint="100"
            @page-count="pageCount = $event"
            @click:row="showTicketInfo({ item: $event, index: ticketList.indexOf($event) })"
          >
            <template v-slot:[`item.active`]="props">
              <v-chip small :color="getColor(props.item.active, props.item.answered, props.item.escalated, props.item.escalatedoffice)" class="white--text">
                <h5>
                  {{ getState(props.item.active, props.item.answered, props.item.escalated, props.item.escalatedoffice) }}
                </h5>
              </v-chip>
            </template>
            <template v-slot:[`item.tickettype.name`]="props">
              <v-edit-dialog
                v-if="$isAdmin() || $isBiller()"
                ref="dialog"
                large
                cancel-text="Cancelar"
                save-text="Guardar"
                class="w-100"
                @save="saveTickettypeFromModal(props.item.id, props.item.tickettype.id, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
              >
                <v-chip
                  small
                  :color="getTicketTypeColor(props.item.tickettype.name)"
                  style="width: 100%;justify-content:center;"
                >
                  <h5>
                    {{ props.item.tickettype.name }}
                  </h5>
                </v-chip>
                <template v-slot:input>
                  <v-select
                    :value="props.item.tickettype"
                    item-text="name"
                    item-value="id"
                    :items="tickettypes"
                    return-object
                    single-line
                    label="Establecer tipo"
                    outlined
                    dense
                    @change="updateTickettypeFromModal(props.item.id, $event, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
                  />
                </template>
              </v-edit-dialog>
              <v-chip v-else small :color="getTicketTypeColor(props.item.tickettype.name)" class="white--text">
                <h5>
                  {{ props.item.tickettype.name }}
                </h5>
              </v-chip>
            </template>
            <template v-slot:[`item.technician`]="props">
              <v-edit-dialog
                v-if="$isAdmin() || $isBiller()"
                ref="dialog"
                large
                cancel-text="Cancelar"
                save-text="Guardar"
                @save="saveAssignatedFromModal(props.item, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
              >
                <v-chip
                  small
                  :color="props.item.technician ? 'primary' : $vuetify.theme.dark ? 'grey darken-3' : ''"
                >
                  <h5>
                    {{ props.item.technician ? ucfirst(props.item.technician.username) : 'No Asignado' }}
                  </h5>
                </v-chip>
                <template v-slot:input>
                  <v-autocomplete
                    v-model="currentTechnician"
                    :value="props.item.technician"
                    item-text="username"
                    item-value="id"
                    :items="technicians"
                    return-object
                    single-line
                    outlined
                    label="Asignar a Tecnico"
                    dense
                    @change="updateAssignatedFromModal(props.item.id, $event, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
                  />
                </template>
              </v-edit-dialog>
              <v-chip v-else small :color="props.item.technician ? 'primary' : 'grey darken-3'">
                <h5>
                  {{ props.item.technician ? ucfirst(props.item.technician.username) : 'No Asignado' }}
                </h5>
              </v-chip>
            </template>
            <template v-if="clienttype === 'INTERNET'" v-slot:[`item.client.name`]="props">
              <span v-if="testPlanDx(props.item.client)" class="red--text">EN MORA O RETIRADO <span class="text-decoration-line-through">{{props.item.client.name}}</span></span>
              <span v-else>{{props.item.client.name}}</span>
            </template>
            <template v-slot:[`item.details`]="{ item }">
              <v-tooltip bottom max-width="400">
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    v-on="on"
                    :class="$store.state.isDesktop ? 'text-truncate' : ''"
                    :style="$store.state.isDesktop ? 'width:100px;' : ''"
                  >
                    {{ item.details }}
                  </div>
                </template>
                <span>{{ item.details }}</span>
            </v-tooltip>
            </template>
            <template v-slot:[`item.client.address`]="{ item }">
              <v-tooltip
                bottom
              >
                <template v-slot:activator="{ on, attrs }">
                  <div
                    v-bind="attrs"
                    style="max-width:180px;"
                    class="text-truncate"
                    v-on="on"
                  >
                    {{ processAddresses(item) }}
                  </div>
                </template>
                <span>{{ processAddresses(item) }}</span>
              </v-tooltip>
            </template>
            <template v-slot:[`item.client.neighborhood.name`]="{ item }">
              <strong>{{ processAddressesNeighborhood(item) }}</strong>
            </template>
            <template v-slot:[`item.client.code`]="props">
              <nuxt-link :to="`/clients/${props.item.client.code}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`" class="blue--text">
                <strong>
                  <h3>
                    {{ props.item.client.code }}
                  </h3>
                </strong>
              </nuxt-link>
            </template>
            <template v-slot:[`item.assignated.username`]="{ item }">
              <strong style="max-width:50px;"> {{ ucfirst(item.assignated.username) }}</strong>
            </template>
            <template v-slot:[`item.client.technology.name`]="props">
              {{ props.item.client.technology !== null ? props.item.client.technology.name : 'No reg.' }}
            </template>
            <template v-if="$store.state.isDesktop" v-slot:[`item.actions`]="{ item, index }">
              <div class="d-flex">
                <CreateTicketAdvancev2
                  :ticket="item"
                  :ticketindex="index"
                  @updateTicketStatus="updateTicketStatus($event)"
                />
                <ClientStatus
                  v-if="clienttype === 'INTERNET'"
                  :name="item.client.name"
                  :clientid="item.client.id"
                  :code="item.client.code"
                  :role="$store.state.auth.allowed_components"
                />
                <TicketHistory
                  :clientid="item.client.id"
                  :name="item.client.name"
                />
                <TicketAdvanceHistory
                  :ticketid="item.id"
                  :name="item.client.name"
                />
              </div>
            </template>
            <template v-slot:[`item.createdAt`]="{ item }">
              <div style="display:flex!important;flex-direction:column;">
                <span class="text-caption" style="white-space:nowrap;">
                  {{ getDate(item.createdAt) }}
                </span>
                <span style="line-height:1rem;" class="text-caption text--secondary">
                  {{ getHour(item.createdAt) }}
                </span>
              </div>
            </template>
          </v-data-table>
        </client-only>
      </v-col>
    </v-row>
    <v-row v-if="pageCount > 1">
      <v-col>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount" />
        </div>
      </v-col>
    </v-row>
    <v-dialog
      v-if="!$store.state.isDesktop"
      v-model="infoModal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
      <v-card>
        <v-card-title>
          Información de Ticket {{ editModalData.id }}
          <v-spacer />
          <v-btn icon @click="infoModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text
          class="d-flex flex-column justify-space-between px-2"
          style="height:calc(100vh - 128px);"
        >
          <div style="flex: 1;">
            <div class="elevation-5 rounded-xl py-2 px-4 grey darken-3">
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Tipo Ticket: </strong>{{ editModalData.tickettype ? editModalData.tickettype.name : '' }}
              </p>
              <nuxt-link :to="`/clients/${editModalData.client ? editModalData.client.code : ''}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`" class="blue--text">
                <strong>
                  <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1"><strong>Código: </strong>{{ editModalData.client ? editModalData.client.code : '' }}</p>
                </strong>
              </nuxt-link>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Cliente: </strong>{{ editModalData.client ? editModalData.client.name : '' }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Direccion: </strong>{{ processAddresses(editModalData) }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Barrio: </strong>{{ processAddressesNeighborhood(editModalData) }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Celular: </strong><a :href="`tel:${editModalData.client ? editModalData.client.phone : ''}`"><strong>{{ editModalData.client ? editModalData.client.phone : '' }}</strong></a>
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Tecnología: </strong>{{ editModalData.client ? editModalData.client.technology ? editModalData.client.technology.name : 'No Reg.' : '' }}
              </p>
              <p v-if="$route.query.clienttype === 'INTERNET'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Potencia Óptica: </strong>{{ editModalData.client ? editModalData.client.opticalpower ? editModalData.client.opticalpower : 'No reg.' : '' }} dBm
              </p>
              <p v-if="$route.query.clienttype === 'TELEVISION'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                TV: {{ editModalData.client ? editModalData.client.tvspec ? editModalData.client.tvspec.tvs : 'No reg.' : '' }}
              </p>
              <p v-if="$route.query.clienttype === 'TELEVISION'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                Altos: {{ editModalData.client ? editModalData.client.tvspec ? editModalData.client.tvspec.high : '' : '' }}
              </p>
              <p v-if="$route.query.clienttype === 'TELEVISION'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                Bajos: {{ editModalData.client ? editModalData.client.tvspec ? editModalData.client.tvspec.down : '' : '' }}
              </p>
              <p v-if="$route.query.clienttype === 'TELEVISION'" class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                Calidad: {{ editModalData.client ? editModalData.client.tvspec ? editModalData.client.tvspec.tvspectype.name : '' : '' }}
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Avance: </strong><code>{{ editModalData ? editModalData.details : '' }}</code>
              </p>
              <p class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                <strong>Creado por: </strong>{{ editModalData.assignated ? ucfirst(editModalData.assignated.username) : '' }}
              </p>
              <span class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                {{ getDate(editModalData ? editModalData.createdAt : '') }}
              </span>
              <span class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1 text--secondary">
                {{ getHour(editModalData ? editModalData.createdAt : '') }}
              </span>
              <v-expansion-panels v-if="editModalData.signed">
                <v-expansion-panel>
                  <v-expansion-panel-header>
                    Firma del Cliente
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <div class="white">
                      {{ `${$config.CDN_STRAPI_ENDPOINT}${editModalData.signature}` }}
                      <v-img
                        :src="`${$config.CDN_STRAPI_ENDPOINT}${editModalData.signature}`"
                        aspect-ratio="1"
                        contain
                        style="transform: rotateZ(-90deg);"
                        :width="clientWidth - 200"
                      />
                    </div>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
              <p v-else class="pb-0 mb-0 text-subtitle-1 font-weigth-bold mb-1">
                Ticket no firmado por usuario aun...
              </p>
            </div>
          </div>
          <div
            v-if="editModalData.client !== undefined"
            style="
              display:grid;
              grid-template-rows: 1fr 1fr 1fr 1fr;
              row-gap: 10px;
            "
          >
            <CreateTicketAdvancev2
              :ticket="editModalData"
              :ticketindex="editModalData.editindex"
              :block="true"
              @updateTicketStatus="updateTicketStatus($event)"
            />
            <ClientStatus
              v-if="clienttype === 'INTERNET'"
              :block="true"
              :name="editModalData.client.name"
              :clientid="editModalData.client.id"
              :code="editModalData.client.code"
              :role="this.$store.state.auth.allowed_components"
            />
            <TicketAdvanceHistory
              :block="true"
              :ticketid="editModalData.id"
              :name="editModalData.client.name"
            />
            <TicketHistory
              :clientid="editModalData.client.id"
              :name="editModalData.client.name"
              :block="true"
            />
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import TicketAdvanceHistory from '../misc/TicketAdvanceHistory'
import TicketHistory from '../misc/TicketHistory'
import ClientStatus from '../main/ClientStatus'
export default {
  name: 'Tickets',
  components: {
    TicketAdvanceHistory,
    TicketHistory,
    ClientStatus
  },
  data () {
    return {
      key: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      search: '',
      alertBox: false,
      dialog: false,
      dialogEdit: false,
      initialLoading: false,
      showClosedValue: false,
      showRetired: false,
      refreshLoading: false,
      isDesktop: false,
      editModalData: {},
      infoModal: false,
      expanded: [],
      singleExpand: true,
      selected: [],
      interval: null,
      currentTechnician: null,
      types: ['RV', 'CX', 'TR', 'DX']
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.id == this.$route.query.city) : ''
    },
    tickets () {
      return this.$store.state.ticket.tickets.filter(t => t.client !== null)
    },
    ticketList () {
      return this.$store.state.ticket.ticketList.filter(t => t.client !== null)
    },
    headers () {
      return this.$store.state.ticket.headers
    },
    clienttype () {
      return this.$route.query.clienttype
    },
    tickettypes () {
      return this.$store.state.ticket.tickettypes
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    },
    technicians () {
      return this.$store.state.operator.operators
    },
    clientWidth () {
      return this.$store.state.clientWidth
    },
    getHeadersByClienttype () {
      return this.$route.query.clienttype === 'INTERNET' ? this.$store.state.isDesktop ? [
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name', width: 80 },
        { text: 'Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Observaciones', sortable: false, value: 'details', width: 100 },
        { text: 'Barrio', sortable: false, value: 'client.neighborhood.name', width: 150 },
        { text: 'Dirección', sortable: false, value: 'client.address', width: 180 },
        { text: 'Código', sortable: false, value: 'client.code', width: 50 },
        { text: 'Cliente', sortable: false, value: 'client.name', width: 200 },
        { text: 'Celular', sortable: false, value: 'client.phone', width: 80 },
        { text: 'Tec.', sortable: false, value: 'client.technology.name', width: 50 },
        { text: 'Por', sortable: false, value: 'assignated.username', width: 40 },
        { text: 'Creación', sortable: false, value: 'createdAt', width: 100 },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ] : [
        { text: 'Estado', sortable: false, value: 'active', width: '5%', hide: 'd-none d-lg-table-cell' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name', width: 100 },
        { text: 'Técnico Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Barrio', sortable: false, value: 'client.neighborhood.name', width: 150 },
        { text: 'Dirección', sortable: false, value: 'client.address', width: 180 },
        { text: 'Cliente', sortable: false, value: 'client.name', width: 150 },
        { text: 'Avance', sortable: false, value: 'details', width: 300 }
      ] : this.$store.state.isDesktop ? [
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name' },
        { text: 'Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Observaciones', sortable: false, value: 'details', width: 100 },
        { text: 'Barrio', sortable: false, value: 'client.neighborhood.name', width: 150 },
        { text: 'Dirección', sortable: false, value: 'client.address', width: 150 },
        { text: 'Codigo', sortable: false, value: 'client.code', width: 60 },
        { text: 'Cliente', sortable: false, value: 'client.name' },
        { text: 'Celular', sortable: false, value: 'client.phone' },
        { text: 'Por', sortable: false, value: 'assignated.username' },
        { text: 'Creado el', sortable: false, value: 'createdAt' },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ] : [
        { text: 'Estado', sortable: false, value: 'active', width: '5%' },
        { text: 'Tipo', sortable: false, value: 'tickettype.name' },
        { text: 'Técnico Asignado', sortable: false, value: 'technician', width: 60 },
        { text: 'Barrio', sortable: false, value: 'client.neighborhood.name' },
        { text: 'Dirección', sortable: false, value: 'client.address', width: 180 },
        { text: 'Cliente', sortable: false, value: 'client.name' },
        { text: 'Avance', sortable: false, value: 'details', width: 300 }
      ]
    }
  },
  watch: {
    $route () {
      this.initIntervalAndGetTickets()
      this.getTickettypes()
    }
  },
  mounted () {
    this.getResolution()
    this.getTickettypes()
    this.getTvSpecTypes()
    this.getTechnicians()
    this.initIntervalAndGetTickets()
  },
  destroyed () {
    this.removeOldIntervalIfExists()
  },
  methods: {
    async initIntervalAndGetTickets () {
      this.removeOldIntervalIfExists()
      this.setGetTicketsInterval()
      this.resetSelected()
      await this.refreshTickets()
      this.setView()
    },
    removeOldIntervalIfExists () {
      if (this.interval) {
        clearInterval(this.interval)
      }
    },
    setGetTicketsInterval () {
      this.interval = setInterval(() => {
        this.refreshTickets()
      }, 60000)
    },
    async refreshTickets () {
      this.initialLoading = true
      await this.$store.dispatch('ticket/getTicketsFromDatabase', { city: this.$route.query.city, clienttype: this.clienttype, token: this.$store.state.auth.token, active: this.showClosedValue, retired: this.showRetired })
      this.initialLoading = false
    },
    setView () {
      const view = window.localStorage.getItem('view') || 'RV'
      if (view) {
        this.view = view
        this.$store.commit('ticket/changeView', view)
      }
    },
    changeView (view) {
      window.localStorage.setItem('view', view)
      this.$router.push({ query: { city: this.$route.query.city, clienttype: this.$route.query.clienttype, view } })
      this.$store.commit('ticket/changeView', view)
    },
    calculateQuantity (type) {
      switch (type) {
        case 'RV':
          return this.tickets.filter(ticket => ticket.tickettype.name !== 'CONEXION NUEVA' && ticket.tickettype.name !== 'TRASLADO' && ticket.tickettype.name !== 'RETIRO').length
        case 'TR':
          return this.tickets.filter(ticket => ticket.tickettype.name === 'TRASLADO').length
        case 'CX':
          return this.tickets.filter(ticket => ticket.tickettype.name === 'CONEXION NUEVA').length
        case 'DX':
          return this.tickets.filter(ticket => ticket.tickettype.name === 'RETIRO').length
        default:
          return 0
      }
    },
    testPlanDx (client) {
      return client.indebt || !client.active
    },
    updateTickettypeFromModal (id, tickettype, index) {
      this.$store.commit('ticket/updateTickettype', { id, tickettype, index })
    },
    saveTickettypeFromModal (ticketid, tickettypeid, index) {
      this.$store.dispatch('ticket/saveTickettype', { ticketid, tickettypeid, index, token: this.$store.state.auth.token })
    },
    updateAssignatedFromModal (id, technician, index) {
      if (this.currentTechnician.telegramchatid) {
        this.$store.commit('ticket/updateAssignated', { id, technician, index })
      }
    },
    saveAssignatedFromModal (ticket, index) {
      if (this.currentTechnician.telegramchatid && this.currentTechnician.phone) {
        this.$store.dispatch('ticket/saveAssignated', {
          ticketid: ticket.id,
          technicianid: this.currentTechnician,
          index,
          token: this.$store.state.auth.token
        })
        // this.$simpleTelegramSendToChat({
        //   client: ticket.client,
        //   tickettype: ticket.tickettype.name,
        //   details: ticket.details,
        //   neighborhood: ticket.client.neighborhood,
        //   operator: this.$store.state.auth.username,
        //   user: this.currentTechnician,
        //   telegramBots: this.telegramBots
        // })
        // this.$simpleWhatsappSendToChat({
        //   tickettype: ticket.tickettype.name,
        //   client: ticket.client,
        //   user: this.currentTechnician,
        //   token: this.$config.META_TOKEN
        // })
        this.currentTechnician = {}
      } else {
        this.$toast.error('El técnico no tiene un chat de telegram asociado o un numero de telefono de whatsapp valido', { duration: 5000 })
      }
    },
    getTickettypes () {
      this.$store.dispatch('ticket/getTickettypes', {
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        token: this.$store.state.auth.token
      })
    },
    getTvSpecTypes () {
      this.$store.dispatch('tv/getTvSpecTypes', { token: this.$store.state.auth.token })
    },
    async getTechnicians () {
      await this.$store.dispatch('operator/getOperatorList', {
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        token: this.$store.state.auth.token
      })
    },
    resetSelected () {
      this.selected = []
    },
    updateTicketStatus ({ editindex, closeTicket }) {
      this.$store.commit('ticket/updateTicketStatus', { editindex, closeTicket })
      this.refreshTickets()
      this.infoModal = false
    },
    copyToClipboard (component, text) {
      navigator.clipboard.writeText(text)
      this.$toast.info(`${component} Copiado al portapapeles!`, { duration: 2000 })
    },
    showOnlyNameAndSecondName (name) {
      const nameArray = name.split(' ')
      if (nameArray.length > 3) {
        return nameArray[0] + ' ' + nameArray[2] + ' ' + nameArray[3]
      } else {
        return name
      }
    },
    rowStyles (item) {
      if (this.$vuetify.theme.dark) {
        return ['mb-4', 'rounded-xl', 'grey darken-4']
      } else {
        return ['mb-4', 'rounded-xl']
      }
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
      return humanDateFormat
    },
    getHour (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    },
    getTicketTypeColor (tickettype) {
      if (tickettype === 'SIN SERVICIO' || tickettype === 'SIN SEÑAL') {
        return 'red white--text'
      } else if (tickettype === 'SERVICIO LENTO' || tickettype === 'SEÑAL LLUVIOSA' || tickettype === 'TV DESPROGRAMADO') {
        return 'orange darken-2'
      } else if (tickettype === 'INTERMITENCIA') {
        return 'orange darken-4'
      } else if (tickettype === 'CONEXION NUEVA') {
        return 'green darken-2'
      } else {
        return 'primary'
      }
    },
    processAddresses ({ client }) {
      if (!client) { return 'Sin Direccion' }
      const address = client?.address
      const addresses = client?.addresses
      if (!address && !addresses) { return 'Sin Dirección' }
      if (address && !addresses) { return client.address }
      if (address && addresses.length > 0) { return addresses.at(-1).address }
      if (!address && addresses.length > 0) { return addresses.at(-1).address }
    },
    processAddressesNeighborhood ({ client }) {
      if (!client) { return 'Sin Barrio' }
      const addresses = client.addresses3
      const neighborhood = client.neighborhood
      if (!neighborhood && !addresses) { return 'Sin Barrio' }
      if (neighborhood && !addresses) { return neighborhood.name }
      if (neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
      if (!neighborhood && addresses.length > 0 && addresses.at(-1).neighborhood) { return addresses.at(-1).neighborhood.name }
      if (!neighborhood && addresses.length > 0 && !addresses.at(-1).neighborhood) { return 'Sin barrio' }
    },
    getColor (state, answered, escalated, escalatedoffice) {
      if (state && !answered) {
        return 'blue darken-4'
      } else if (answered && state && !escalated && !escalatedoffice) {
        return 'orange darken-4'
      } else if (answered && state && escalated) {
        return 'purple darken-4'
      } else if (answered && state && !escalated && escalatedoffice) {
        return 'green darken-4'
      } else {
        return 'red'
      }
    },
    getState (state, answered, escalated, escalatedoffice) {
      if (state && !answered) {
        return 'ABIERTO'
      } else if (answered && state && !escalated && !escalatedoffice) {
        return 'RESPOND.'
      } else if (answered && state && escalated) {
        return 'ESCALADO'
      } else if (answered && state && !escalated && escalatedoffice) {
        return 'OFICINA'
      } else {
        return 'CERRADO'
      }
    },
    getResolution () {
      const res = window.innerWidth
      if (res > 800) {
        const clientRes = true
        this.isDesktop = clientRes
      } else {
        const clientRes = false
        this.isDesktop = clientRes
      }
    },
    showTicketInfo (event) {
      event.item.editindex = event.index
      Object.assign(this.editModalData, event.item)
      this.infoModal = true
    },
    comprobeCity () {
      const recordedCity = localStorage.getItem('currentCity')
      const currentCity = this.$route.query.city
      if (currentCity !== recordedCity) {
        this.$store.dispatch('refreshTickets', { city: currentCity, limit: 50 })
      }
    },
    ucfirst (string) {
      return string.charAt(0).toUpperCase() + string.slice(1)
    }
  }
}
</script>

<style>
  .v-data-table > .v-data-table__wrapper > table > tfoot > tr > td {
    font-size: 12px;
  }
  a {
    text-decoration: none;
  }
  @media print {
  .no-printme {
    display: none !important;
  }
  .printme {
    display: block;
  }
  .ticket-row {
    background-color: red;
  }
}
.theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > td:last-child, .theme--dark.v-data-table > .v-data-table__wrapper > table > tbody > tr:not(:last-child) > th:last-child {
    border-bottom: none !important;
}
.v-small-dialog__activator__content {
  width: 100% !important;;
}
</style>
