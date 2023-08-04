<template>
  <div>
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
      caption="Clientes"
      dense
      hide-default-footer
      mobile-breakpoint="100"
      @page-count="pageCount = $event"
      @click:row="showBillingInfo"
    >
      <template v-slot:[`item.code`]="props">
        <nuxt-link :to="`/clients/${props.item.code}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`" class="blue--text">
          <strong>
            <h3>
              {{ props.item.code }}
            </h3>
          </strong>
        </nuxt-link>
      </template>
      <template v-slot:[`item.balance`]="props">
        <v-chip
          v-if="props.item && props.item.offer && props.item.offer.price"
          small
          label
          :to="`/billing/${props.item.code}?selected=${props.item.id}&city=${$route.query.city}&clienttype=${$route.query.clienttype}`"
          :color="props.item.balance >= props.item.offer.price * 2 ? 'yellow darken-4' : 'green'"
        >
          ${{ Number(props.item.balance).toLocaleString('es') }}
        </v-chip>
        <v-chip
          v-else
          small
          label
        >
          {{ 'No definido' }}
        </v-chip>
      </template>
    </v-data-table>
    <v-pagination v-model="page" :length="pageCount" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      itemsPerPage: 25,
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
    },
    showPayed () {
      return this.$store.state.billing.showPayed
    }
  },
  watch: {
    '$store.state.billing.showPayed' () {
      this.getBillingInfoByClientId()
    },
    '$store.state.billing.refresh' () {
      console.log('refreshing')
      this.getClientsBySearch()
    },
    '$route' () {
      this.$store.commit('billing/resetInvoices')
      this.getClientsBySearch()
    }
  },
  mounted () {
    this.loadingDataTable = true
    this.page = 1
    this.getHeadersByClientType()
    this.getClientsBySearch()
    this.getBillingInfoByClientId()
    this.loadingDataTable = false
  },
  methods: {
    async testForSingleClient () {
      if (this.$store.state.billing.clients.length === 1) {
        await this.showBillingInfo(this.$store.state.billing.clients[0])
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
      if (this.search || this.$route.params.search) {
        await this.$store.dispatch('billing/getClientsBySearch', {
          search: this.search,
          city: this.$route.query.city,
          clienttype: this.$route.query.clienttype,
          token: this.$store.state.auth.token
        })
        await this.testForSingleClient()
      }
    },
    async getBillingInfoByClientId (cliendId = null) {
      if (this.$store.state.billing.clients.length > 0) {
        await this.$store.dispatch('billing/getBillingInfoByClientId', {
          clientId: cliendId || this.$route.query.selected,
          showPayed: this.showPayed,
          token: this.$store.state.auth.token
        })
      }
    },
    async showBillingInfo (item) {
      if (item.id === parseInt(this.$route.query.selected)) {
        await this.getBillingInfoByClientId(item.id)
      } else {
        this.$router.push({
          path: this.$route.path,
          params: { search: this.search },
          query: { selected: item.id, clienttype: this.$route.query.clienttype, city: this.$route.query.city }
        })
      }
    }
  }
}
</script>
