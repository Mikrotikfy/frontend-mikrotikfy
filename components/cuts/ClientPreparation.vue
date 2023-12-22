<template>
  <div>
    <v-card>
      <v-card-text v-if="!prepare" class="justify-center d-flex">
        <v-btn
          color="primary"
          large
          @click="prepareServices"
        >
          <v-icon>mdi-magnify</v-icon>
          <span>Preparar Servicios</span>
        </v-btn>
      </v-card-text>
      <v-card-text v-else>
        <v-data-table
          :headers="headers"
          :items="services ? services : servicesByPlan"
          :loading="loading"
          :item-class="getcolor"
        >
          <template v-slot:[`item.address`]="{ item }">
            <span>
              {{ item.address }}
            </span>
          </template>
          <template v-slot:[`item.neighborhood`]="{ item }">
            <span>
              {{ item.neighborhood }}
            </span>
          </template>
        </v-data-table>
      </v-card-text>
    </v-card>
    <v-btn
      v-if="(services.length > 0 || servicesByPlan.length > 0) && !loading && validServices.length > 0"
      color="primary"
      class="mt-5"
      @click="process"
    >
      Continuar
    </v-btn>
    <v-btn
      v-if="(services.length > 0 || servicesByPlan.length > 0) && !loading"
      class="mt-5"
      @click="$store.commit('cuts/e1', '1')"
    >
      Cancelar
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
        { text: 'Nombre', value: 'normalized_client.name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Barrio', value: 'neighborhood' },
        { text: 'Telefono', value: 'normalized_client.phone' },
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
    validServices () {
      return this.$store.state.cuts.validServices
    },
    applyOffer () {
      return this.$store.state.cuts.applyOffer
    },
    offer () {
      return this.$store.state.cuts.offer
    },
    services () {
      return this.$store.state.cuts.services
    },
    servicesByPlan () {
      return this.$store.state.cuts.servicesByPlan
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
    async prepareServices () {
      if (!this.ready) {
        this.$toast.error('No hay servicios para preparar')
        return
      }
      if (this.applyOffer && !this.offer) {
        this.$toast.error('No has seleccionado la oferta para continuar')
        return
      }
      this.$store.commit('cuts/prepare', true)
      this.$store.commit('cuts/reset')
      this.$store.commit('cuts/loading', true)

      await this.validateServices()

      this.$store.commit('cuts/loading', false)
    },
    async validateServices () {
      for (let i = 0; i < this.ready.length; i++) {
        await this.$store.dispatch('cuts/prepareServices', {
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
