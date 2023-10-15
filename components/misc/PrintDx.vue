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
    services: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      modal: false,
      technician: null
    }
  },
  computed: {
    technicians () {
      return this.$store.state.operator.operators
    }
  },
  methods: {
    async initComponent () {
      await this.getTechnicians()
      if (this.services.length > 0) {
        const services = []
        if (this.$route.query.clienttype === 'INTERNET') {
          this.services.map((service) => {
            services.push({
              id: service.id,
              code: service.code,
              name: service.normalized_client.name,
              address: service.service_addresses.at(-1).address,
              neighborhood: service.service_addresses.at(-1).neighborhood.name,
              phone: service.normalized_client.phone,
              plan: service.plan,
              technology: service.technology,
              stratum: service.stratum
            })
          })
        } else {
          this.services.map((service) => {
            services.push({
              id: service.id,
              code: service.code,
              name: service.normalized_client.name,
              address: service.service_addresses.at(-1).address,
              neighborhood: service.service_addresses.at(-1).neighborhood.name,
              phone: service.normalized_client.phone
            })
          })
        }
        localStorage.removeItem('servicesDx')
        localStorage.setItem('servicesDx', JSON.stringify(services))
        localStorage.removeItem('servicesDxClienttype')
        localStorage.setItem('servicesDxClienttype', JSON.stringify(this.$route.query.clienttype))
        const routeData = this.$router.resolve({ name: 'dxformat' })
        window.open(routeData.href, '_blank')
      } else {
        this.$toast.error('Selecciona los servicios antes de imprimir', { position: 'bottom-center' })
      }
    },
    async getTechnicians () {
      await this.$store.dispatch('operator/getOperatorList', {
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
