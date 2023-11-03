<template>
  <span>
    <v-card
      :loading="loading"
    >
      <v-card-title>
        Historial de Tickets
      </v-card-title>
      <div v-if="!loading">
        <v-card-text>
          <client-only>
            <v-data-table
              :headers="$route.query.clienttype === 'INTERNET' ? headers : headersTV"
              :items="tickets"
              :items-per-page="itemsPerPage"
              :item-class="rowStyles"
              sort-by="createdAt"
              calculate-widths
              sort-desc
              :page.sync="page"
              no-data-text="No hay tickets para mostrar aún..."
              loading-text="Cargando información de tickets..."
              dense
              hide-default-footer
              mobile-breakpoint="100"
              @page-count="pageCount = $event"
            >
              <template v-slot:[`item.actions`]="props">
                <CreateTicketAdvancev2
                  :ticket="props.item"
                  :ticketindex="-1"
                  @refreshTickets="initComponent()"
                />
                <TicketAdvanceHistory
                  :ticketid="props.item.id"
                  :name="props.item.service.normalized_client.name"
                />
              </template>
              <template v-slot:[`item.active`]="props">
                <v-chip small :color="getColor(props.item.active)" class="white--text">
                  {{ getState(props.item.active) }}
                </v-chip>
              </template>
              <template v-slot:[`item.createdAt`]="{ item }">
                <span>
                  {{ getDate(item.createdAt) }}
                </span>
              </template>
              <template v-slot:[`item.details`]="{ item }">
                <span>
                  {{ getLastAdvance(item) }}
                </span>
              </template>
              <template v-slot:[`item.channel`]="{ item }">
                <v-tooltip v-if="item.tickettype ? item.tickettype.requireverification : false" bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      v-bind="attrs"
                      small
                      :color="getChannelColor(item.tickettype, item.reboot, item.network, item.on)"
                      class="white--text"
                      v-on="on"
                    >
                      <h5>
                        {{ item.channel ? getChannelName(item.channel) : 'No reg.' }}
                      </h5>
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
                  class="white--text"
                >
                  <h5>
                    {{ item.channel ? getChannelName(item.channel) : 'N/A' }}
                  </h5>
                </v-chip>
              </template>
            </v-data-table>
          </client-only>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount" />
          </div>
        </v-card-text>
      </div>
    </v-card>
  </span>
</template>

<script>
import TicketAdvanceHistory from '../misc/TicketAdvanceHistory'
export default {
  name: 'TicketHistory',
  components: {
    TicketAdvanceHistory
  },
  props: {
    service: {
      type: Object,
      default: () => ({})
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: false,
    loading: true,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10,
    tickets: [],
    headers: [
      { text: 'Estado', sortable: true, value: 'active' },
      { text: 'Tipo', sortable: true, value: 'tickettype.name' },
      { text: 'Operador', sortable: false, value: 'assignated.username' },
      { text: 'Detalles', sortable: true, value: 'details' },
      { text: 'Potencia Optica', sortable: true, value: 'opticalpower' },
      { text: 'Canal', sortable: false, value: 'channel', width: 60, align: ' d-none d-lg-table-cell' },
      { text: 'Creado', sortable: true, value: 'createdAt' },
      { text: 'Acciones', sortable: true, value: 'actions' }
    ],
    headersTV: [
      { text: 'Estado', sortable: true, value: 'active' },
      { text: 'Cliente', sortable: true, value: 'client.name' },
      { text: 'Tipo', sortable: true, value: 'tickettype.name' },
      { text: 'Operador', sortable: false, value: 'assignated.username' },
      { text: 'Detalles', sortable: true, value: 'details' },
      { text: 'Televisores', sortable: true, value: 'tvspec.tvs' },
      { text: 'Altos', sortable: true, value: 'tvspec.high' },
      { text: 'Bajos', sortable: true, value: 'tvspec.down' },
      { text: 'Calidad', sortable: true, value: 'tvspec.tvspectype.name' },
      { text: 'Canal', sortable: false, value: 'channel', width: 60, align: ' d-none d-lg-table-cell' },
      { text: 'Creado', sortable: true, value: 'createdAt' },
      { text: 'Acciones', sortable: true, value: 'actions' }
    ]
  }),
  mounted () {
    this.initComponent()
  },
  methods: {
    async initComponent () {
      this.modal = true
      this.loading = false
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          service: {
            id: this.service.id
          }
        },
        populate: [
          'service',
          'service.tvspec',
          'service.naps',
          'service.normalized_client',
          'tickettype',
          'ticketdetails',
          'ticketdetails.operator',
          'tvspec',
          'tvspec.tvspectype',
          'assignated'
        ],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then((tickets) => {
          this.tickets = tickets.data
        })
    },
    rowStyles (item) {
      return ['mb-4', 'rounded-xl', 'grey darken-4']
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getColor (state) {
      if (state) {
        return 'blue darken-4'
      } else {
        return 'red'
      }
    },
    getLastAdvance (ticket) {
      if (ticket.ticketdetails.length > 0) {
        return `${ticket.ticketdetails.at(-1).operator.username}: ${ticket.ticketdetails.at(-1).details}`
      } else {
        return ticket.details
      }
    },
    getState (state) {
      if (state) {
        return 'Abierto'
      } else {
        return 'Cerrado'
      }
    },
    getChannelColor (tickettype, reboot, network, on) {
      if (tickettype) {
        if (!tickettype.requireverification) {
          return 'grey darken-4'
        }
        if (reboot && network && on) {
          return 'green darken-4'
        } else {
          return 'red darken-4'
        }
      } else {
        return 'grey darken-4'
      }
    },
    getChannelName (channel) {
      if (channel === 'phone') {
        return 'TELEF.'
      } else if (channel === 'office') {
        return 'OFICINA'
      } else if (channel === 'whatsapp') {
        return 'WHASTAPP'
      } else if (channel === 'email') {
        return 'EMAIL'
      } else {
        return 'OTRO'
      }
    }
  }
}
</script>

<style>
</style>
