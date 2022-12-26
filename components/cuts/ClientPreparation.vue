<template>
  <div>
    <v-card>
      <v-card-text v-if="!prepare" class="justify-center d-flex">
        <v-btn
          color="primary"
          large
          @click="prepareClients"
        >
          <v-icon>mdi-magnify</v-icon>
          <span>Preparar Clientes</span>
        </v-btn>
      </v-card-text>
      <v-card-text v-else>
        <v-data-table
          :headers="headers"
          :items="clients ? clients : clientsByPlan"
          :loading="loading"
          :item-class="getcolor"
        />
      </v-card-text>
    </v-card>
    <v-btn
      v-if="(clients.length > 0 || clientsByPlan.length > 0) && !loading"
      color="primary"
      class="mt-5"
      @click="process"
    >
      Continuar
    </v-btn>
  </div>
</template>
<script>
export default {
  props: {
    e1: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      headers: [
        { text: 'Codigo', value: 'code' },
        { text: 'Nombre', value: 'name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Barrio', value: 'neighborhood.name' },
        { text: 'Telefono', value: 'phone' },
        { text: 'Plan', value: 'plan.name' }
      ]
    }
  },
  computed: {
    prepare () {
      return this.$store.state.cuts.prepare
    },
    ready () {
      return this.$store.state.cuts.ready
    },
    applyOffer () {
      return this.$store.state.cuts.applyOffer
    },
    offer () {
      return this.$store.state.cuts.offer
    },
    clients () {
      return this.$store.state.cuts.clients
    },
    clientsByPlan () {
      return this.$store.state.cuts.clientsByPlan
    },
    loading () {
      return this.$store.state.cuts.loading
    }
  },
  watch: {
    e1 (oldVal, newVal) {
      if (newVal === '1') {
        this.$store.commit('cuts/reset')
        this.$store.commit('cuts/reseterror')
        this.$store.commit('cuts/resetcuts')
        this.$store.commit('cuts/resetvalid')
        this.$store.commit('cuts/prepare', false)
      }
    },
    $route () {
      this.$store.commit('cuts/reset')
      this.$store.commit('cuts/reseterror')
      this.$store.commit('cuts/resetcuts')
      this.$store.commit('cuts/resetvalid')
      this.$store.commit('cuts/prepare', false)
    }
  },
  methods: {
    process () {
      this.$store.commit('cuts/e1', '4')
    },
    async prepareClients () {
      if (!this.ready) {
        this.$toast.error('No hay clientes para preparar')
        return
      }
      if (this.applyOffer && !this.offer) {
        this.$toast.error('No has seleccionado la oferta para continuar')
        return
      }
      this.$store.commit('cuts/prepare', true)
      this.$store.commit('cuts/reset')
      this.$store.commit('cuts/loading', true)

      await this.validateClients()

      this.$store.commit('cuts/loading', false)
    },
    async validateClients () {
      for (let i = 0; i < this.ready.length; i++) {
        await this.$store.dispatch('cuts/prepareClients', {
          city: this.$route.query.city,
          token: this.$store.state.auth.token,
          ready: this.ready[i]
        })
      }
    },
    getcolor (item) {
      if (item.valid) {
        return 'success--text'
      } else {
        return 'error--text'
      }
    }
  }
}
</script>
<style>
.ready-list {
  background-color:red;
}
</style>
