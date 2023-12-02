<template>
  <div v-if="tickets.length > 0">
    <v-card>
      <v-card-title>
        <v-btn
          icon
          @click="$router.go(-1)"
        >
          <v-icon>mdi-arrow-left</v-icon>
        </v-btn>
        <h3 class="text-h5">
          Historial de tickets
        </h3>
      </v-card-title>
      <v-card-text
        v-for="ticket in tickets"
        :key="ticket.id"
      >
        <v-card>
          <v-row class="pl-2">
            <v-col cols="auto">
              <v-chip :class="ticket.active ? 'blue darken-4' : 'green darken-4 white--text'">
                {{ ticket.active ? 'Abierto' : 'Resuelto' }}
              </v-chip>
            </v-col>
            <v-col cols="auto">
              {{ ticket.service.client_name }}
            </v-col>
            <v-col cols="auto">
              {{ ticket.tickettype ? ticket.tickettype.name : 'No def.' }}
            </v-col>
            <v-col cols="auto">
              {{ ticket.details }}
            </v-col>
          </v-row>
          <v-row
            v-for="(detail, index) in ticket.ticketdetails"
            :key="detail.id"
            class="pl-10"
          >
            <v-col cols="auto">
              {{ index + 1 }}
            </v-col>
            <v-col cols="auto">
              {{ detail.details }}
            </v-col>
            <v-col cols="auto">
              {{ getDate(detail.createdAt) }}
            </v-col>
          </v-row>
        </v-card>
      </v-card-text>
    </v-card>|
  </div>
</template>
<script>
export default {
  name: 'TicketHistoryJournal',
  data () {
    return {
      tickets: [],
      loading: false
    }
  },
  computed: {
    service () {
      return this.$route.query.service
    }
  },
  mounted () {
    this.getTicketHistoryByServiceId()
    this.$vuetify.theme.dark = false
  },
  methods: {
    async getTicketHistoryByServiceId () {
      this.loading = true
      if (!this.service) {
        this.$toast.error('No se ha especificado un servicio')
        this.loading = false
        return
      }
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          service: this.service
        },
        populate: ['service', 'ticketdetails', 'tickettype', 'assignated'],
        sort: ['createdAt:desc'],
        pagination: {
          pageSize: 1000
        }
      },
      {
        encodeValuesOnly: true
      })
      try {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: tickets }) => {
            this.tickets = tickets
            this.loading = false
          })
      } catch (error) {
        this.loading = false
        this.$toast.error(`Error al obtener tickets: ${error}`)
      }
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
