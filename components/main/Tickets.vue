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
          <v-card-text class="py-4">
            <v-row>
              <v-tooltip top>
                <!-- eslint-disable -->
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    class="mt-4 ml-4 mr-4"
                    color="white black--text"
                    dark
                    rounded
                    :disabled="initialLoading"
                    :loading="initialLoading"
                    v-on="on"
                    @click="initIntervalAndGetTickets()"
                  >
                  <v-icon>mdi-reload</v-icon>
                  </v-btn>
                </template>
              <span>Refrescar Tickets</span>
            </v-tooltip>
            <MiscPrintTicket
              v-if="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && (!showClosedValue && !showClosedValue) && $store.state.isDesktop  ? true : false"
              :tickets="selected"
            />
            <v-checkbox
              v-model="showClosedValue"
              class="mr-4"
              label="Mostrar cerrados"
              @change="initIntervalAndGetTickets()"
            />
            <v-checkbox
              v-model="showRetired"
              class="mr-4"
              label="Mostrar retiros"
              @change="initIntervalAndGetTickets()"
            />
            <h3 v-if="!showClosedValue" class="align-self-center">
              {{ ticketList.length }}
              {{ ticketList.length === 1 ? 'Ticket activo' : 'Tickets activos' }}
            </h3>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="mt-0 pt-0">
      <v-col>
        <v-card
          fluid
          class="rounded-xl"
        >
        <v-card-text>
          <client-only>
            <v-data-table
              v-model="selected"
              :show-select="($store.state.auth.role.name === 'superadmin' || $store.state.auth.role.name === 'admin' || $store.state.auth.role.name === 'biller') && $store.state.isDesktop ? true : false"
              :key="key"
              :headers="headers"
              :items="ticketList"
              :search="search"
              :items-per-page="itemsPerPage"
              :page.sync="page"
              :loading="initialLoading"
              :expanded.sync="expanded"
              sort-by="createdAt"
              calculate-widths
              sort-desc
              dense
              no-data-text="No hay Tickets abiertos aún..."
              loading-text="Cargando información de tickets..."
              hide-default-footer
              mobile-breakpoint="100"
              @page-count="pageCount = $event"
              @click:row="showTicketInfo({ item: $event, index: ticketList.indexOf($event) })"
            >
              <template v-slot:[`item.active`]="props">
                <v-chip small :color="getColor(props.item.active, props.item.answered, props.item.escalated, props.item.escalatedoffice)" class="white--text">
                  {{ getState(props.item.active, props.item.answered, props.item.escalated, props.item.escalatedoffice) }}
                </v-chip>
              </template>
              <template v-slot:[`item.tickettype.name`]="props">
                <v-edit-dialog
                  v-if="$isAdmin()"
                  ref="dialog"
                  large
                  cancel-text="Cancelar"
                  save-text="Guardar"
                  @save="saveTickettypeFromModal(props.item.id, props.item.tickettype.id, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
                >
                  <v-chip small :color="getTicketTypeColor(props.item.tickettype.name)" class="white--text">
                    {{ props.item.tickettype.name }}
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
                      dense
                      @change="updateTickettypeFromModal(props.item.id, $event, ticketList.map(function(x) {return x.id; }).indexOf(props.item.id))"
                    />
                  </template>
                </v-edit-dialog>
                <v-chip v-else small :color="getTicketTypeColor(props.item.tickettype.name)" class="white--text">
                  {{ props.item.tickettype.name }}
                </v-chip>
              </template>
              <template v-if="!$store.state.isDesktop" v-slot:expanded-item="{ headers, item }">
                <td :colspan="headers.length">
                  <span class="grey--text">Avance:</span> {{ item.details ? item.details : 'no hay' }}
                </td>
              </template>
              <template v-slot:[`item.channel`]="{ item }">
                <v-tooltip v-if="item.tickettype.requireverification" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-bind="attrs"
                      v-on="on"
                      small
                      :color="getChannelColor(item.tickettype, item.reboot, item.network, item.on)"
                      class="white--text">
                    {{ item.channel ? getChannelName(item.channel) : 'No reg.' }}
                  </v-chip>
                  </template>
                  <span>
                    <ul>
                      <li :class="item.reboot ? 'green darken-4 px-2 rounded-xl mb-2' : 'red darken-4 px-2 rounded-xl mb-2'">Se reinicio el Router/ONU? {{ item.reboot ? 'SI': 'NO' }}</li>
                      <li :class="item.network ? 'green darken-4 px-2 rounded-xl mb-2' : 'red darken-4 px-2 rounded-xl mb-2'">Se verifico conexion a la red WiFi? {{ item.network ? 'SI': 'NO' }}</li>
                      <li :class="item.on ? 'green darken-4 px-2 rounded-xl mb-2' : 'red darken-4 px-2 rounded-xl mb-2'">El equipo esta encendido? {{ item.on ? 'SI': 'NO' }}</li>
                    </ul>
                  </span>
              </v-tooltip>
              <v-chip
                  v-else
                  small
                  :color="getChannelColor(item.tickettype, item.reboot, item.network, item.on)"
                  class="white--text">
                {{ item.channel ? getChannelName(item.channel) : 'No Aplica' }}
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
                      class="text-truncate" style="width:200px;"
                    >
                      {{ item.details }}
                    </div>
                  </template>
                  <span>{{ item.details }}</span>
              </v-tooltip>
              </template>
              <template v-slot:[`item.client.name`]="{ item }">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                      class="text-truncate" style="max-width:150px;"
                    >
                      {{ showOnlyNameAndSecondName(item.client.name) }}
                    </div>
                  </template>
                  <span>{{ item.client.name }}</span>
              </v-tooltip>
              </template>
              <template v-slot:[`item.client.address`]="{ item }">
                  <v-tooltip
                    bottom
                  >
                  <template v-slot:activator="{ on, attrs }">
                    <div
                      v-bind="attrs"
                      v-on="on"
                      class="text-truncate" style="max-width:150px;"
                      @click="copyToClipboard('Direccion', item.client.addresses.length > 0 ? item.client.addresses.at(-1).address : item.client.address)"
                    >
                      {{ item.client.addresses.length > 0 ? item.client.addresses.at(-1).address : item.client.address }}
                    </div>
                  </template>
                  <span>{{ item.client.addresses.length > 0 ? item.client.addresses.at(-1).address : item.client.address }}</span>
              </v-tooltip>
              </template>
              <template v-slot:[`item.client.neighborhood.name`]="{ item }">
                  <strong>{{ item.client.addresses.length > 0 ? item.client.addresses.at(-1).neighborhood.name : item.client.neighborhood.name }}</strong>
              </template>
              <template v-slot:[`item.client.code`]="props">
                <nuxt-link :to="`/clients/${props.item.client.code}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`">{{props.item.client.code}}</nuxt-link>
              </template>
              <template v-slot:[`item.assignated.username`]="{ item }">
                <strong style="max-width:60px;"> {{ ucfirst(item.assignated.username) }}</strong>
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
                <span class="text-caption">
                  {{ getDate(item.createdAt) }}
                </span>
                <span class="text-caption text--secondary">
                  {{ getHour(item.createdAt) }}
                </span>
              </template>
            </v-data-table>
          </client-only>
          </v-card-text>
        </v-card>
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
          Información de Ticket
          <v-spacer />
          <v-btn icon @click="infoModal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text
          style="height: calc(100vh - 69px);"
          class="d-flex flex-column justify-space-between"
        >
          <div>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData.tickettype ? editModalData.tickettype.name : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">Reporto por: {{ editModalData.channel ? getChannelName(editModalData.channel) : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData.client ? editModalData.client.code : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData.client ? editModalData.client.name : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData.client ? editModalData.client.addresses.length > 0 ? editModalData.client.addresses.at(-1).address : editModalData.client.address : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData.client ? editModalData.client.addresses.length > 0 ? editModalData.client.addresses.at(-1).neighborhood.name : editModalData.client.neighborhood.name : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData.client ? editModalData.client.phone : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData.client ? editModalData.client.technology ? editModalData.client.technology.name : 'No Reg.' : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData ? editModalData.details : '' }}</p>
            <p class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">{{ editModalData.assignated ? ucfirst(editModalData.assignated.username) : '' }}</p>
            <span class="pb-0 mb-0 text-h6 font-weigth-bold mb-2">
              {{ getDate(editModalData ? editModalData.createdAt : '') }}
            </span>
            <span class="pb-0 mb-0 text-h6 font-weigth-bold mb-2 text--secondary">
              {{ getHour(editModalData ? editModalData.createdAt : '') }}
            </span>
          </div>
          <div v-if="editModalData.client !== undefined" style="
            display:grid;
            grid-template-rows: 1fr 1fr 1fr 1fr;
            row-gap: 10px;
          ">
            <CreateTicketAdvancev2
              :ticket="editModalData"
              :ticketindex="editModalData.index"
              :block="true"
              @updateTicketStatus="updateTicketStatus($event)"
            />
            <ClientStatus
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
            <TvServiceStepper
              v-if="clienttype === 'TELEVISION'"
              :clientid="editModalData.client.id"
              :block="true"
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
      interval: null
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.id == this.$route.query.city) : ''
    },
    ticketList () {
      return this.$store.state.ticket.tickets
    },
    headers () {
      return this.$store.state.ticket.headers
    },
    clienttype () {
      return this.$route.query.clienttype
    },
    tickettypes () {
      return this.$store.state.ticket.tickettypes
    }
  },
  watch: {
    $route () {
      this.refreshTickets()
      this.getTickettypes()
    }
  },
  mounted () {
    this.getResolution()
    this.getTickettypes()
    this.initIntervalAndGetTickets()
  },
  destroyed () {
    this.removeOldIntervalIfExists()
  },
  methods: {
    initIntervalAndGetTickets () {
      this.removeOldIntervalIfExists()
      this.setGetTicketsInterval()
      this.refreshTickets()
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
    testPlanDx (client) {
      return client.debtmovements.at(-1)?.isindebt || client.debtmovements?.at(-1)?.isretired
    },
    updateTickettypeFromModal (id, tickettype, index) {
      this.$store.commit('ticket/updateTickettype', { id, tickettype, index })
    },
    saveTickettypeFromModal (ticketid, tickettypeid, index) {
      this.$store.dispatch('ticket/saveTickettype', { ticketid, tickettypeid, index, token: this.$store.state.auth.token })
    },
    getTickettypes () {
      this.$store.dispatch('ticket/getTickettypes', {
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        token: this.$store.state.auth.token
      })
    },
    async refreshTickets () {
      this.initialLoading = true
      await this.$store.dispatch('ticket/getTicketsFromDatabase', { city: this.$route.query.city, clienttype: this.clienttype, token: this.$store.state.auth.token, active: this.showClosedValue, retired: this.showRetired })
      this.expanded = this.ticketList
      this.initialLoading = false
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
      if (nameArray.length > 2) {
        return nameArray[0] + ' ' + nameArray[2]
      } else {
        return name
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
      if (tickettype === 'SIN SERVICIO') {
        return 'red'
      } else if (tickettype === 'SERVICIO LENTO') {
        return 'orange darken-2'
      } else if (tickettype === 'INTERMITENCIA') {
        return 'orange darken-4'
      } else if (tickettype === 'CONEXION NUEVA') {
        return 'green darken-2'
      } else {
        return 'primary'
      }
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
        return 'Abierto'
      } else if (answered && state && !escalated && !escalatedoffice) {
        return 'Respondido'
      } else if (answered && state && escalated) {
        return 'Escalado a Tecnico'
      } else if (answered && state && !escalated && escalatedoffice) {
        return 'Escalado a Oficina'
      } else {
        return 'Cerrado'
      }
    },
    getChannelColor (tickettype, reboot, network, on) {
      if (!tickettype.requireverification) {
        return 'grey darken-4'
      }
      if (reboot && network && on) {
        return 'green darken-4'
      } else {
        return 'red darken-4'
      }
    },
    getChannelName (channel) {
      if (channel === 'phone') {
        return 'Telefonico'
      } else if (channel === 'office') {
        return 'Oficina'
      } else if (channel === 'whatsapp') {
        return 'Whatsapp'
      } else if (channel === 'email') {
        return 'Email'
      } else {
        return 'Email'
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

<style scoped>
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
}
</style>
