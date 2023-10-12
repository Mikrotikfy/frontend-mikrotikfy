<template>
  <div>
    <v-tooltip top>
      <!-- eslint-disable -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          icon
          dark
          rounded
          v-on="on"
          @click="printTickets()"
        >
          <v-icon>mdi-printer-outline</v-icon>
          </v-btn>
        </template>
      <span>Imprimir Lista</span>
    </v-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    tickets: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      modal: false,
      technician: null,
      technicians: []
    }
  },
  methods: {
    printTickets () {
      if (this.tickets.length === 0) {
        this.$toast.error('No hay clientes seleccionados', { duration: 3000 })
        return
      }
      const services = []
      if (this.$route.query.clienttype === 'INTERNET') {
        this.tickets.map((ticket) => {
          services.push({
            tickettype: ticket.tickettype,
            details: ticket.details,
            code: ticket.service.code,
            name: ticket.service.normalized_client.name,
            addresses: ticket.service.service_addresses,
            phone: ticket.service.normalized_client.phone,
            id: ticket.service.id
          })
        })
      } else {
        this.tickets.map((ticket) => {
          services.push({
            tickettype: ticket.tickettype,
            details: ticket.details,
            code: ticket.service.code,
            name: ticket.service.normalized_client.name,
            addresses: ticket.service.addresses,
            phone: ticket.service.normalized_client.phone,
            id: ticket.service.id
          })
        })
      }
      if (this.$route.query.clienttype === 'INTERNET') {
        localStorage.removeItem('ticketListForPrint')
        localStorage.setItem('ticketListForPrint', JSON.stringify(services))
        const routeData = this.$router.resolve({ name: 'ticketformat', query: { clienttype: this.$route.query.clienttype } })
        window.open(routeData.href, '_blank')
      } else {
        localStorage.removeItem('ticketListForPrint')
        localStorage.setItem('ticketListForPrint', JSON.stringify(services))
        const routeData = this.$router.resolve({ name: 'ticketformat', query: { clienttype: this.$route.query.clienttype } })
        window.open(routeData.href, '_blank')
      }
    }
  }
}
</script>
<style scoped>
.parent {
  display: grid;
  width: 100%;
  grid-template-columns: 3fr 1fr 4fr 4fr 2fr 4fr 4fr;
  grid-gap: 0px;
}
.parent > span {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px 0;
  border: 1px solid grey;
}
</style>
