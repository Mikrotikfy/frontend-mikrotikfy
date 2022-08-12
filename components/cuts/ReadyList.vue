<template>
  <v-card>
    <v-card-text v-if="!prepare" class="justify-center d-flex">
      <v-btn
        color="primary"
        large
        @click="prepareClients"
      >
        <v-icon>mdi-magnify</v-icon>
        <span>Preparar Cortes</span>
      </v-btn>
    </v-card-text>
    <v-card-text v-else>
      <v-data-table
        :headers="headers"
        :items="clients"
        :loading="loading"
        :item-class="getcolor"
      />
    </v-card-text>
  </v-card>
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
      prepare: false,
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
    ready () {
      return this.$store.state.cuts.ready
    },
    clients () {
      return this.$store.state.cuts.clients
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
        this.prepare = false
      }
    },
    $route () {
      this.$store.commit('cuts/reset')
      this.$store.commit('cuts/reseterror')
      this.$store.commit('cuts/resetcuts')
      this.$store.commit('cuts/resetvalid')
      this.prepare = false
    }
  },
  methods: {
    async prepareClients () {
      this.prepare = true
      this.$store.commit('cuts/reset')
      this.$store.commit('cuts/loading', true)
      if (!this.ready) {
        this.$toast.error('No hay clientes para preparar')
        return
      }
      for (let i = 0; i < this.ready.length; i++) {
        await this.$store.dispatch('cuts/prepareClients', {
          city: this.$route.query.city,
          token: this.$store.state.auth.token,
          ready: this.ready[i]
        })
      }
      this.$store.commit('cuts/loading', false)
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
