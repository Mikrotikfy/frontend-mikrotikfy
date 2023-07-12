<template>
  <div v-if="invoices">
    <client-only>
      <v-data-table
        ref="billDataTable"
        :headers="headers"
        :items.sync="invoices"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :options.sync="options"
        :loading="loadingDataTable"
        sort-by="id"
        sort-asc
        :no-data-text="showPayed ? 'No hay facturas pagas aun...' : 'Usuario al día'"
        loading-text="Cargando información de clientes..."
        dense
        hide-default-footer
        mobile-breakpoint="100"
        @page-count="pageCount = $event"
        @current-items="$vuetify.goTo(0)"
      >
        <template v-slot:[`item.invoice_type.name`]="props">
          <v-chip
            :color="props.item.balance > 0 ? 'orange' : 'green'"
            text
            small
            label
          >
            {{ props.item.invoice_type.name }}
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
              :invoice="props.item"
              :index="props.index"
              :balance="props.item.balance"
              class="mr-2"
              @updateInvoiceList="updateInvoiceList(props.item)"
            />
            <BillingDepositHistory :bill="props.item" class="mr-2" />
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
      itemsPerPage: 100,
      page: 1,
      pageCount: 0,
      options: {},
      loadingDataTable: false,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Concepto', value: 'invoice_type.name', sortable: false },
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
    showPayed () {
      return this.$store.state.billing.showPayed
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
