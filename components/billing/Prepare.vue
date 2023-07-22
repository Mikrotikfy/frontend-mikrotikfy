<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="activeClients"
      :items-per-page="itemsPerPage"
      :page.sync="page"
      class="elevation-0"
      hide-default-footer
      :loading="loading"
      :caption="`Clientes activos en ${$route.query.city} a la fecha: ${activeClients.length}`"
      @page-count="pageCount = $event"
    />
    <v-pagination v-model="page" :length="pageCount" />
    <v-btn
      :disabled="!activeClients.length > 0"
      color="primary"
      class="mt-2"
      @click="nextE1"
    >
      Continuar
    </v-btn>
  </div>
</template>
<script>
export default {
  data () {
    return {
      codes: [],
      clients: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      loading: false,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Saldo', value: 'balance', sortable: false }
      ]
    }
  },
  computed: {
    activeClients () {
      return this.$store.state.billing.activeClients
    },
    readyForSend () {
      return this.$store.state.notification.readyForSend
    }
  },
  methods: {
    nextE1 () {
      this.$store.commit('billing/e1', { e1: 2 })
    }
  }
}
</script>
