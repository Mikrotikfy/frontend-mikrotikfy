<template>
  <div>
    <v-tooltip top>
      <!-- eslint-disable -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="mx-2"
          color="white black--text"
          dark
          rounded
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-printer</v-icon>
          </v-btn>
        </template>
      <span>Imprimir Lista</span>
    </v-tooltip>
  </div>
</template>
<script>
export default {
  props: {
    clients: {
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
    async initComponent () {
      await this.getTechnicians()
      if (this.clients.length > 0) {
        const clients = []
        if (this.$route.query.clienttype === 'INTERNET') {
          this.clients.map((client) => {
            clients.push({
              id: client.id,
              name: client.name,
              address: client.address,
              addresses: client.addresses,
              phone: client.phone,
              plan: client.plan,
              technology: client.technology,
              stratum: client.stratum
            })
          })
        } else {
          this.clients.map((client) => {
            clients.push({
              id: client.id,
              name: client.name,
              address: client.address,
              addresses: client.addresses,
              phone: client.phone
            })
          })
        }
        const routeData = this.$router.resolve({ name: 'dxformat', query: { clientsInfo: JSON.stringify(clients), clienttype: this.$route.query.clienttype } })
        window.open(routeData.href, '_blank')
      } else {
        this.$toast.error('Selecciona los clientes antes de imprimir', { position: 'bottom-center' })
      }
    },
    async getTechnicians () {
      this.technicians = await this.$store.dispatch('operator/getOperatorList', {
        token: this.$store.state.auth.token
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
      return humanDateFormat
    },
    getDateLog (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
<style scoped>
@media print {
  .no-printme {
    display: none !important;
  }
  .printme {
    display: block !important;
  }
}
.parent {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 3fr 2fr 2fr 2fr 4fr;
  grid-gap: 0px;
}
.parent > span {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: .6rem;
  padding: 0 0;
  border: 1px solid grey;
}
</style>
