<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-comment-text-multiple-outline</v-icon>
          <span v-if="block">
            Historial de Tickets
          </span>
        </v-btn>
      </template>
      <span>Historial de Tickets</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="990"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title class="headline">
          Historial de Tickets de {{ name }}
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
                    :name="props.item.client.name"
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
            <div class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount" />
            </div>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
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
    clientid: {
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
    itemsPerPage: 10,
    tickets: [],
    headers: [
      { text: 'Estado', sortable: true, value: 'active' },
      { text: 'Cliente', sortable: true, value: 'client.name' },
      { text: 'Tipo', sortable: true, value: 'tickettype.name' },
      { text: 'Operador', sortable: false, value: 'assignated.username' },
      { text: 'Detalles', sortable: true, value: 'details' },
      { text: 'Creado', sortable: true, value: 'createdAt' },
      { text: 'Acciones', sortable: true, value: 'actions' }
    ]
  }),
  methods: {
    async initComponent () {
      this.modal = true
      this.loading = false
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          client: {
            id: {
              $eq: this.clientid
            }
          },
          clienttype: {
            name: this.$route.query.clienttype
          }
        },
        populate: [
          'client',
          'tickettype',
          'assignated'
        ]
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
