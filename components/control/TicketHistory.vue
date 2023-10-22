<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          icon
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </template>
      <span>Historial de Tickets</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      width="1200"
    >
      <v-card
        :loading="loading"
        class="rounded-xl"
      >
        <v-card-title>
          <v-icon class="mr-2">
            mdi-history
          </v-icon>
          Historial de Tickets
        </v-card-title>
        <div v-if="!loading">
          <v-card-text>
            <client-only>
              <v-data-table
                :headers="headers"
                :items="tickets"
                :items-per-page="itemsPerPage"
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
              </v-data-table>
            </client-only>
            <div v-if="pageCount > 1" class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount" />
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
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
    itemsPerPage: 30,
    tickets: [],
    headers: [
      { text: 'Estado', sortable: true, value: 'active' },
      { text: 'Cliente', sortable: true, value: 'service.normalized_client.name' },
      { text: 'Tipo', sortable: true, value: 'tickettype.name' },
      { text: 'Operador', sortable: false, value: 'assignated.username' },
      { text: 'Detalles', sortable: true, value: 'details' },
      { text: 'Creado', sortable: true, value: 'createdAt' },
      { text: 'Acciones', sortable: true, value: 'actions' }
    ]
  }),
  methods: {
    initComponent () {
      this.modal = true
      this.loading = false
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          service: {
            id: {
              $eq: this.service.id
            }
          },
          clienttype: {
            name: this.service.name
          }
        },
        populate: [
          'service',
          'service.normalized_client',
          'tickettype',
          'assignated'
        ]
      },
      {
        encodeValuesOnly: true
      })
      fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then(({ data: tickets }) => {
          this.tickets = tickets
        })
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
    getState (state) {
      if (state) {
        return 'Abierto'
      } else {
        return 'Cerrado'
      }
    }
  }
}
</script>

<style>

</style>
