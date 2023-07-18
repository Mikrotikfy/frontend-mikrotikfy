<template>
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
    caption="Movimientos"
    mobile-breakpoint="100"
    @page-count="pageCount = $event"
    @click:row="showLegalNotesInfo"
  >
    <template v-slot:[`item.amount`]="props">
      <strong> ${{ Number(props.item.amount).toLocaleString('es') }} </strong>
    </template>
    <template v-slot:[`item.invoices`]="props">
      <strong> {{ formatConcepts(props.item.invoices) }} </strong>
    </template>
    <template v-slot:[`item.createdAt`]="props">
      <strong> {{ getDate(props.item.createdAt) }} </strong>
    </template>
  </v-data-table>
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
      selected: [],
      headers: [
        { text: 'Fecha', value: 'createdAt', align: 'start' },
        { text: 'Debito', value: 'amount' },
        { text: 'Crédito', value: 'amount' },
        { text: 'Conceptos', value: 'invoices', sortable: false }
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
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    },
    formatConcepts (invoices) {
      let concepts = ''
      invoices.forEach((invoice, index) => {
        concepts += `${invoice.details} ${invoice.value - invoice.balance}`
        if (index < invoices.length - 1) {
          concepts += ', '
        }
      })
      return concepts
    }
  }
}
</script>
