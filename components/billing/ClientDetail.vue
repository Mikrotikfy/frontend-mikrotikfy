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
        calculate-widths
        :no-data-text="showPayed ? 'No hay facturas pagas aun...' : 'Usuario al día'"
        loading-text="Cargando información de clientes..."
        dense
        hide-default-footer
        mobile-breakpoint="600"
        @page-count="pageCount = $event"
        @current-items="$vuetify.goTo(0)"
      >
        <template v-slot:[`item.invoice_type.name`]="props">
          <v-chip
            :color="props.item.balance > 0 ? props.item.cancelled ? 'red' : 'orange' : 'green'"
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
          <span class=" d-xl-flex justify-end" :data-index="props.index">
            <BillingPayBill
              v-if="!showPayed"
              :service="currentService"
              :invoice="props.item"
              :index="props.index"
              :balance="props.item.balance"
              class="mr-2"
              @updateInvoiceList="updateInvoiceList()"
            />
            <BillingDepositHistory :bill="props.item" class="mr-2" />
            <BillingCancelBill
              v-if="!showPayed"
              :bill="props.item"
              class="mr-2"
            />
            <v-btn
              class="white black--text"
              x-small
              @click="openPrintReceipt(props.item)"
            >
              <v-icon>mdi-printer</v-icon>
            </v-btn>
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
        { text: 'Anulada', sortable: false, value: 'cancelreason' },
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
    },
    currentService () {
      return this.$store.state.billing.currentService
    }
  },
  methods: {
    updateInvoiceList () {
      this.$store.dispatch('billing/getBillingInfoByServiceId', {
        service: this.currentService.id,
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
    },
    openPrintReceipt (invoice) {
      localStorage.removeItem('invoiceToPrint')
      localStorage.setItem('invoiceToPrint', JSON.stringify(invoice))
      window.open(`/invoice?id=${invoice.id}`)
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
