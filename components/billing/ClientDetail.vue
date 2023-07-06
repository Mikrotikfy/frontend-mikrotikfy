<template>
  <div v-if="invoices">
    <span ref="clientP" class="ml-2 hideMe rounded-xl px-2">
      Usuario: {{ currentClient.id }} {{ currentClient.name }}
    </span>
    <client-only>
      <v-data-table
        ref="billDataTable"
        v-model="selected"
        :headers="headers"
        :items.sync="invoices"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :options.sync="options"
        :loading="loadingDataTable"
        sort-by="id"
        sort-asc
        show-select
        no-data-text="Realiza una busqueda para iniciar..."
        loading-text="Cargando información de clientes..."
        dense
        hide-default-footer
        mobile-breakpoint="100"
        @page-count="pageCount = $event"
        @current-items="$vuetify.goTo(0)"
      >
        <template v-slot:[`item.concept`]="props">
          <v-chip
            :color="props.item.balance > 0 ? 'orange' : 'green'"
            text
            small
            label
          >
            {{ props.item.concept }}
          </v-chip>
        </template>
        <template v-slot:[`item.value`]="props">
          <strong> ${{ Number(props.item.value).toLocaleString('es') }} </strong>
        </template>
        <template v-slot:[`item.debt`]="props">
          <strong class="text-h5"> ${{ Number(props.item.balance).toLocaleString('es') }} </strong>
        </template>
        <template v-slot:[`item.details`]="props">
          <BillingDetails :billinginfo="props" />
        </template>
        <template v-slot:[`item.actions`]="props">
          <span class="d-flex justify-end" :data-index="props.index">
            <BillingPayBill
              v-if="!props.item.payed && selected.length < 2"
              :invoice="props.item"
              :index="props.index"
              :balance="props.item.balance"
              class="mr-2"
              @updateInvoiceList="updateInvoiceList(props.item)"
            />
            <BillingDepositHistory v-if="props.item.concept === 'FACTURACION'" :bill="props.item" class="mr-2" />
          </span>
        </template>
      </v-data-table>
    </client-only>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selected: [],
      itemsPerPage: 100,
      page: 1,
      pageCount: 0,
      options: {},
      loadingDataTable: false,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Concepto', value: 'concept', sortable: false },
        { text: 'Detalles', value: 'details', sortable: false },
        { text: 'Valor Inicial', value: 'value', sortable: false },
        { text: 'Saldo Pendiente', sortable: false, value: 'debt' },
        { text: 'Acciones', value: 'actions', sortable: false, class: 'text-right' }
      ]
    }
  },
  computed: {
    invoices () {
      return this.$store.state.billing.invoices
    },
    currentClient () {
      return this.$store.state.billing.currentClient
    }
  },
  watch: {
    '$store.state.billing.resetSelected': {
      handler () {
        this.selected = []
      }
    },
    selected () {
      this.$store.commit('billing/setSelected', this.selected)
    }
  },
  methods: {
    updateInvoiceList ({ client }) {
      this.$store.dispatch('billing/getBillingInfoByClientId', {
        client,
        showArchive: this.$store.state.billing.showArchive,
        token: this.$store.state.auth.token
      })
    },
    changeClient () {
      this.$refs.clientP.$el.$refs.classList.remove('hideMe')
      setTimeout(() => {
        this.$refs.clientP.classList.add('hideMe')
      }, 100)
    },
    caculateDebt (price, invoiceMovements) {
      if (invoiceMovements.length === 0) {
        return price
      } else {
        return price - invoiceMovements.reduce((total, curr) => { return total + curr.amount }, 0)
      }
    }
  },
  head () {
    return {
      title: `${this.currentClient ? 'Estados de cuenta - ' + this.currentClient.name : 'Estados de cuenta'}`
    }
  }
}
</script>
<style scoped>
td {
  background-color: rgb(81, 135, 0);
    -moz-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Firefox */
    -webkit-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Safari and Chrome */
    -o-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Opera */
    animation: cssAnimation 1s ease-in 0.3s forwards;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}
.hideMe {
    background-color: rgb(81, 135, 0);
    -moz-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Firefox */
    -webkit-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Safari and Chrome */
    -o-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Opera */
    animation: cssAnimation 1s ease-in 0.3s forwards;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}
@keyframes cssAnimation {
    to {
        background-color: transparent;
    }
}
@-webkit-keyframes cssAnimation {
    to {
        background-color: transparent;
    }
}
</style>
