<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'white black--text'"
          class="rounded-xl"
          :large="block"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon :class="block ? 'mr-1' : ''">mdi-note-outline</v-icon>
          <span v-if="block">
            Ver Avances
          </span>
        </v-btn>
      </template>
      <span>Historial de Avances</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="1200"
      :fullscreen="!$store.state.isDesktop"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title>
          Historial de Avances {{ ticketid }}
          <v-spacer />
          <v-btn icon @click="modal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <div v-if="!loading">
          <v-card-text>
            <client-only>
              <v-data-table
                :headers="$route.query.clienttype === 'INTERNET' ? headers : headersTV"
                :page.sync="page"
                :items="ticketdetails"
                :items-per-page="itemsPerPage"
                :item-class="rowStyles"
                no-data-text="No hay avances para mostrar aun..."
                loading-text="Cargando información de tickets..."
                hide-default-footer
                sort-desc
                sort-by="createdAt"
                mobile-breakpoint="100"
                @page-count="pageCount = $event"
              >
                <template v-slot:[`item.createdAt`]="{ item }">
                  <span>{{ getDate(item.createdAt) }}</span>
                </template>
              </v-data-table>
            </client-only>
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount" />
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'TicketAdvanceHistory',
  props: {
    ticketid: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ''
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
    itemsPerPage: 5,
    ticketdetails: [],
    headers: [
      { text: 'Cliente', sortable: true, value: 'ticket.service.normalized_client.name' },
      { text: 'Tipo', sortable: true, value: 'ticket.tickettype.name' },
      { text: 'Creado por', sortable: false, value: 'operator.username' },
      { text: 'Detalles', sortable: true, value: 'details' },
      { text: 'Avance creado el', sortable: true, value: 'createdAt' }
    ],
    headersTV: [
      { text: 'Cliente', sortable: true, value: 'ticket.service.normalized_client.name' },
      { text: 'Tipo', sortable: true, value: 'ticket.tickettype.name' },
      { text: 'Creado por', sortable: false, value: 'operator.username' },
      { text: 'Detalles', sortable: true, value: 'details' },
      { text: 'Televisores', sortable: true, value: 'tvspec.tvs' },
      { text: 'Altos', sortable: true, value: 'tvspec.high' },
      { text: 'Bajos', sortable: true, value: 'tvspec.down' },
      { text: 'Calidad', sortable: true, value: 'tvspec.tvspectype.name' },
      { text: 'Avance creado el', sortable: true, value: 'createdAt' }
    ]
  }),
  methods: {
    async initComponent () {
      this.modal = true
      this.loading = false
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          ticket: {
            id: {
              $eq: this.ticketid
            }
          }
        },
        populate: [
          'ticket',
          'ticket.service',
          'ticket.service.normalized_client',
          'ticket.tickettype',
          'tvspec',
          'tvspec.tvspectype',
          'operator'
        ],
        sort: 'createdAt:DESC'
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}ticketdetails?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then((ticketdetails) => {
          this.ticketdetails = ticketdetails.data
        })
    },
    rowStyles (item) {
      return ['mb-4', 'rounded-xl', 'grey darken-4']
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>

<style>

</style>
