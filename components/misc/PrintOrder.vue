<template>
  <v-tooltip top>
    <!-- eslint-disable -->
    <template v-slot:activator="{ on, attrs }"> 
      <v-btn
        v-bind="attrs"
        dark
        icon
        rounded
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
      const services = []
      if (this.$route.query.clienttype === 'INTERNET') {
        this.tickets.map((ticket) => {
          services.push({
            id: ticket.service.id,
            name: ticket.service.normalized_client.name,
            address: ticket.service.service_addresses,
            addresses: ticket.service.service_addresses,
            phone: ticket.service.normalized_client.phone,
            plan: ticket.service.plan,
            technology: ticket.service.technology,
            stratum: ticket.service.stratum,
            tickettype: ticket.tickettype.name,
            createdAt: ticket.createdAt
          })
        })
      } else {
        this.tickets.map((ticket) => {
          services.push({
            id: ticket.service.id,
            name: ticket.service.normalized_client.name,
            address: ticket.service.service_addresses,
            addresses: ticket.service.service_addresses,
            phone: ticket.service.normalized_client.phone,
            stratum: ticket.service.stratum,
            tickettype: ticket.tickettype.name,
            createdAt: ticket.createdAt
          })
        })
      }
      if (this.$route.query.clienttype === 'INTERNET') {
        localStorage.removeItem('clientsInfo')
        localStorage.setItem('clientsInfo', JSON.stringify(services))
        const routeData = this.$router.resolve({ name: 'format' })
        window.open(routeData.href, '_blank')
      } else {
        localStorage.removeItem('clientsInfo')
        localStorage.setItem('clientsInfo', JSON.stringify(services))
        const routeData = this.$router.resolve({ name: 'tvformat' })
        window.open(routeData.href, '_blank')
      }
    }
  }
}
</script>
