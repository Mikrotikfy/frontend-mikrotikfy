<template>
  <v-data-table
    v-if="headers"
    :headers="headers"
    :items.sync="clients"
    :items-per-page.sync="itemsPerPage"
    :page.sync="page"
    :options.sync="options"
    :loading="loadingDataTable"
    no-data-text="Realiza una busqueda para iniciar..."
    loading-text="Cargando información de clientes..."
    dense
    hide-default-footer
    mobile-breakpoint="100"
    @page-count="pageCount = $event"
    @click:row="showBillingInfo"
  />
</template>
<script>
export default {
  data () {
    return {
      itemsPerPage: 10,
      page: 1,
      pageCount: 0,
      options: {},
      loadingDataTable: false,
      selected: []
    }
  },
  computed: {
    clients () {
      return this.$store.state.billing.clients
    },
    headers () {
      return this.$store.state.billing.headers
    },
    search () {
      return this.$route.params.search
    }
  },
  watch: {
    '$store.state.billing.showArchive' () {
      this.showBillingInfo(this.selected)
    }
  },
  mounted () {
    this.loadingDataTable = true
    this.page = 1
    this.getHeadersByClientType()
    this.getClientsBySearch()
    this.loadingDataTable = false
  },
  methods: {
    testForSingleClient () {
      if (this.$store.state.billing.clients.length === 1) {
        this.showBillingInfo(this.$store.state.billing.clients[0])
      } else {
        this.$store.commit('billing/setBillingInfo', {})
      }
    },
    getHeadersByClientType () {
      this.loadingDataTable = true
      this.$store.dispatch('billing/getHeadersByClientType', { clienttype: this.$route.query.clienttype }).then(() => {
        this.loadingDataTable = false
      })
    },
    async getClientsBySearch () {
      if (this.search) {
        await this.$store.dispatch('billing/getClientsBySearch', {
          search: this.search,
          city: this.$route.query.city,
          clienttype: this.$route.query.clienttype,
          token: this.$store.state.auth.token
        })
        this.testForSingleClient()
      }
    },
    showBillingInfo (item) {
      this.selected = item
      this.$store.dispatch('billing/getBillingInfoByClientId', {
        client: item,
        showArchive: this.$store.state.billing.showArchive,
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
