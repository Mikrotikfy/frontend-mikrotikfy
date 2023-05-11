<template>
  <v-btn
    class="my-2 mr-1"
    color="white black--text"
    dark
    small
    rounded
    @click="printTickets()"
  >
    <v-icon>mdi-printer</v-icon>
  </v-btn>
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
      const clients = []
      if (this.$route.query.clienttype === 'INTERNET') {
        this.tickets.map((ticket) => {
          clients.push({
            tickettype: ticket.tickettype,
            details: ticket.details,
            code: ticket.client.code,
            name: ticket.client.name,
            addresses: ticket.client.addresses,
            phone: ticket.client.phone,
            id: ticket.client.id
          })
        })
      } else {
        this.tickets.map((ticket) => {
          clients.push({
            tickettype: ticket.tickettype,
            details: ticket.details,
            code: ticket.client.code,
            name: ticket.client.name,
            addresses: ticket.client.addresses,
            phone: ticket.client.phone,
            id: ticket.client.id
          })
        })
      }
      if (this.$route.query.clienttype === 'INTERNET') {
        localStorage.removeItem('ticketListForPrint')
        localStorage.setItem('ticketListForPrint', JSON.stringify(clients))
        const routeData = this.$router.resolve({ name: 'ticketformat', query: { clienttype: this.$route.query.clienttype } })
        window.open(routeData.href, '_blank')
      } else {
        localStorage.removeItem('ticketListForPrint')
        localStorage.setItem('ticketListForPrint', JSON.stringify(clients))
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
