<template>
  <div>
    <v-data-table
      :items="legalNotes"
      :headers="headers"
      :items-per-page="itemsPerPage"
      :page.sync="page"
      :options.sync="options"
      :loading="loadingDataTable"
      no-data-text="No hay recibos para mostrar..."
      loading-text="Cargando recibos..."
      dense
      hide-default-footer
      :caption="`Movimientos para servicio ID: ${$route.params.search}`"
      mobile-breakpoint="100"
      @page-count="pageCount = $event"
    >
      <template v-slot:[`item.debit`]="props">
        <strong> ${{ Number(props.item.debit).toLocaleString('es') }} </strong>
      </template>
      <template v-slot:[`item.credit`]="props">
        <strong> ${{ Number(props.item.credit).toLocaleString('es') }} </strong>
      </template>
      <template v-slot:[`item.invoices`]="props">
        <strong> {{ formatConcepts(props.item.invoice_movements, props.item) }} </strong>
      </template>
      <template v-slot:[`item.createdAt`]="props">
        <strong> {{ getDate(props.item.createdAt) }} </strong>
      </template>
      <template v-slot:[`item.actions`]="props">
        <v-btn
          v-if="props.item.debit === 0 && props.item.credit > 0"
          class="white black--text"
          x-small
          @click="openPrintReceipt(props.item)"
        >
          <v-icon>mdi-printer</v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-pagination v-model="page" :length="pageCount" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      itemsPerPage: 50,
      page: 1,
      pageCount: 0,
      options: {},
      loadingDataTable: false,
      selected: [],
      headers: [
        { text: 'Fecha', value: 'createdAt', align: 'start' },
        { text: 'Debito', value: 'debit', sortable: false },
        { text: 'Crédito', value: 'credit', sortable: false },
        { text: 'Conceptos', value: 'invoices', sortable: false },
        { text: 'Acciones', value: 'actions', sortable: false }
      ]
    }
  },
  computed: {
    legalNotes () {
      return this.$store.state.billing.legalNotes
    },
    showPayed () {
      return this.$store.state.billing.showPayed
    }
  },
  methods: {
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    },
    formatConcepts (invoicesMovements, legalNote) {
      if (invoicesMovements.length === 0) { return legalNote.concept }
      let concepts = ''
      invoicesMovements.forEach((movement, index) => {
        concepts += `${movement.type === 'FACTURACION MENSUAL' ? movement.concept : movement.type} $${Number(movement.amount).toLocaleString('es')}`
        if (index < invoicesMovements.length - 1) {
          concepts += ', '
        }
      })
      return concepts
    },
    openPrintReceipt (receipt) {
      localStorage.removeItem('receiptToPrint')
      localStorage.setItem('receiptToPrint', JSON.stringify(receipt))
      window.open(`/bill?id=${receipt.id}`)
    }
  }
}
</script>
