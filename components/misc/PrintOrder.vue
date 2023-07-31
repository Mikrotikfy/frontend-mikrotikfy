<template>
  <v-tooltip top>
    <!-- eslint-disable -->
    <template v-slot:activator="{ on, attrs }"> 
      <v-btn
        v-bind="attrs"
        class="my-2 mr-1"
        color="white black--text"
        dark
        rounded
        small
        v-on="on"
        @click="printOrder()"
      >
          <v-icon>
            mdi-file-sign
          </v-icon>
        </v-btn>
      </template>
      <span>Imprimir Orden de Servicio</span>
    </v-tooltip>
</template>
<script>
export default {
  props: {
    tickets: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    printOrder () {
      if (this.tickets.length === 0) {
        this.$toast.error('No hay clientes seleccionados', { duration: 3000 })
        return
      }
      const clients = []
      if (this.$route.query.clienttype === 'INTERNET') {
        this.tickets.map((ticket) => {
          clients.push({
            id: ticket.client.id,
            name: ticket.client.name,
            address: ticket.client.address,
            addresses: ticket.client.addresses,
            phone: ticket.client.phone,
            plan: ticket.client.plan,
            technology: ticket.client.technology,
            stratum: ticket.client.stratum,
            tickettype: ticket.tickettype.name,
            createdAt: ticket.createdAt
          })
        })
      } else {
        this.tickets.map((ticket) => {
          clients.push({
            id: ticket.client.id,
            name: ticket.client.name,
            address: ticket.client.address,
            addresses: ticket.client.addresses,
            phone: ticket.client.phone,
            stratum: ticket.client.stratum,
            tickettype: ticket.tickettype.name,
            createdAt: ticket.createdAt
          })
        })
      }
      if (this.$route.query.clienttype === 'INTERNET') {
        localStorage.removeItem('clientsInfo')
        localStorage.setItem('clientsInfo', JSON.stringify(clients))
        const routeData = this.$router.resolve({ name: 'format' })
        window.open(routeData.href, '_blank')
      } else {
        localStorage.removeItem('clientsInfo')
        localStorage.setItem('clientsInfo', JSON.stringify(clients))
        const routeData = this.$router.resolve({ name: 'tvformat' })
        window.open(routeData.href, '_blank')
      }
    }
  }
}
</script>
