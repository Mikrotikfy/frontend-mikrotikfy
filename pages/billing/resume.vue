<template>
  <v-container>
    <v-row>
      <v-card class="rounded-lg mt-5" style="width:100%;">
        <v-card-title class="justify-center">
          Recaudo Diario
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  ref="startDate"
                  v-model="startDate"
                  label="Inicio"
                  outlined
                  :rules="dateRules"
                  class="rounded-xl"
                  prepend-icon="mdi-calendar"
                  @keyup.enter="getBillsByDateRange"
                />
              </v-col>
              <v-col
                cols="12"
                sm="6"
              >
                <v-text-field
                  v-model="endDate"
                  label="Fin"
                  outlined
                  :rules="dateRules2"
                  class="rounded-xl"
                  prepend-icon="mdi-calendar"
                  @keyup.enter="getBillsByDateRange"
                />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  :items="billsOnDataRange"
                  :headers="headers"
                  :items-per-page="itemsPerPage"
                  :page.sync="page"
                  :options.sync="options"
                  :loading="loadingDataTable"
                  no-data-text="No hay recibos para mostrar..."
                  loading-text="Cargando recibos..."
                  dense
                  hide-default-footer
                  :caption="`Recaudo de ${getDate(startDate)} a ${ getDate(endDate) }`"
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
                      class="white black--text"
                      x-small
                      @click="openPrintReceipt(props.item)"
                    >
                      <v-icon>mdi-printer</v-icon>
                    </v-btn>
                  </template>
                </v-data-table>
                <v-pagination v-model="page" :length="pageCount" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    startDate: '',
    endDate: '',
    dateRules: [
      v => !!v || 'La fecha de inicio es requerida',
      v => (v && v.length >= 10) || 'La fecha de inicio debe tener 10 caracteres',
      v => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'La fecha de inicio debe tener el formato YYYY-MM-DD'
    ],
    dateRules2: [
      v => !!v || 'La fecha de fin es requerida',
      v => (v && v.length >= 10) || 'La fecha de fin debe tener 10 caracteres',
      v => /^\d{4}-\d{2}-\d{2}$/.test(v) || 'La fecha de fin debe tener el formato YYYY-MM-DD'
    ],
    headers: [
      { text: 'Fecha', value: 'createdAt', align: 'start' },
      { text: 'Debito', value: 'debit', sortable: false },
      { text: 'Crédito', value: 'credit', sortable: false },
      { text: 'Conceptos', value: 'invoices', sortable: false },
      { text: 'Acciones', value: 'actions', sortable: false }
    ],
    itemsPerPage: 10,
    page: 1,
    pageCount: 0,
    options: {
      page: 1,
      pageSize: 25,
      total: 0
    },
    loadingDataTable: false
  }),
  computed: {
    billsOnDataRange () {
      return this.$store.state.billing.billsOnDataRange
    }
  },
  watch: {
    'options.page' () {
      this.getBillsByDateRange()
    }
  },
  mounted () {
    this.startDate = this.returnToday()
    this.endDate = this.returnToday()
    this.getBillsByDateRange()
  },
  methods: {
    returnToday () {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      return yyyy + '-' + mm + '-' + dd
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
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
      return humanDateFormat
    },
    getBillsByDateRange () {
      this.$store.dispatch('billing/getBillsByDateRange', {
        token: this.$store.state.auth.token,
        from: this.startDate,
        to: this.endDate,
        pagination: this.options
      })
    }
  }
}
</script>
