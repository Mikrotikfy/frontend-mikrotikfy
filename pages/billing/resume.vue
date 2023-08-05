<template>
  <v-container>
    <v-row>
      <v-card class="rounded-lg mt-5" style="width:100%;">
        <v-card-title class="justify-center">
          Movimientos de cuenta
        </v-card-title>
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col
                cols="12"
                sm="4"
              >
                <v-text-field
                  ref="startDate"
                  v-model="startDate"
                  label="Inicio"
                  outlined
                  :rules="dateRules"
                  class="rounded-xl"
                  hide-details="auto"
                  prepend-icon="mdi-calendar"
                  @keyup.enter="getBillsByDateRange"
                />
              </v-col>
              <v-col
                cols="12"
                sm="4"
              >
                <v-text-field
                  v-model="endDate"
                  label="Fin"
                  outlined
                  :rules="dateRules2"
                  class="rounded-xl"
                  hide-details="auto"
                  prepend-icon="mdi-calendar"
                  @keyup.enter="getBillsByDateRange"
                />
              </v-col>
              <v-col
                cols="12"
                sm="4"
                class="d-flex align-center"
              >
                <v-btn-toggle
                  v-model="mode"
                  borderless
                  color="primary"
                >
                  <v-btn value="credit">
                    <span class="hidden-sm-and-down">Credito</span>

                    <v-icon right>
                      mdi-arrow-down-bold
                    </v-icon>
                  </v-btn>

                  <v-btn value="debit">
                    <span class="hidden-sm-and-down">Debito</span>

                    <v-icon right>
                      mdi-arrow-up-bold
                    </v-icon>
                  </v-btn>
                  <v-btn value="both">
                    <span class="hidden-sm-and-down">Ambos</span>

                    <v-icon right>
                      mdi-circle
                    </v-icon>
                  </v-btn>
                </v-btn-toggle>
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <v-data-table
                  :items="billsOnDataRange"
                  :headers="headers"
                  :options.sync="options"
                  :loading="loadingDataTable"
                  no-data-text="No hay recibos para mostrar..."
                  loading-text="Cargando recibos..."
                  dense
                  hide-default-footer
                  :caption="`Recaudo de ${getDateWithoutHours(startDate)} a ${ getDateWithoutHours(endDate) } - Documentos: ${billsOnDataRange.length} - Total recaudado: $${Number(billsOnDataRange.reduce((a, b) => a + (b.credit || 0), 0)).toLocaleString('es')}`"
                  mobile-breakpoint="100"
                  @page-count="options.pageCount = $event"
                >
                  <template v-slot:[`item.client.code`]="props">
                    <nuxt-link :to="`/billing/${props.item.client.code}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`" class="blue--text">
                      <strong>
                        <h3>
                          {{ props.item.client.code }}
                        </h3>
                      </strong>
                    </nuxt-link>
                  </template>
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
                </v-data-table>
                <v-pagination v-model="options.page" :length="options.pageCount" />
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
      { text: '#', value: 'id', align: 'start' },
      { text: 'Fecha', value: 'createdAt', align: 'start' },
      { text: 'Codigo', value: 'client.code', align: 'start' },
      { text: 'Nombre', value: 'client.name', align: 'start' },
      { text: 'Conceptos', value: 'invoices', sortable: false },
      { text: 'Debito', value: 'debit', sortable: false },
      { text: 'Crédito', value: 'credit', sortable: false }
    ],
    options: {
      page: 1,
      pageSize: 100,
      itemsPerPage: 100,
      pageCount: 0
    },
    loadingDataTable: false,
    mode: 'credit'
  }),
  computed: {
    billsOnDataRange () {
      return this.$store.state.billing.billsOnDataRange
    }
  },
  watch: {
    'options.page' () {
      this.getBillsByDateRange()
    },
    mode () {
      this.getBillsByDateRange()
    }
  },
  mounted () {
    this.startDate = this.returnToday()
    this.endDate = this.returnToday()
    this.getBillsByDateRange()
  },
  methods: {
    async getBillsByDateRange () {
      const { meta } = await this.$store.dispatch('billing/getBillsByDateRange', {
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        token: this.$store.state.auth.token,
        from: this.startDate,
        to: this.endDate,
        pagination: this.options,
        credit: this.mode === 'credit' || this.mode === 'both',
        debit: this.mode === 'debit' || this.mode === 'both'
      })
      this.options = meta.pagination
    },
    returnToday () {
      const today = new Date()
      const dd = String(today.getDate()).padStart(2, '0')
      const mm = String(today.getMonth() + 1).padStart(2, '0')
      const yyyy = today.getFullYear()
      return `${yyyy}-${mm}-${dd}`
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
      const humanDateFormat = dateObject.toLocaleString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    },
    getDateWithoutHours (date) {
      const dateObject = new Date(date + 'T00:00:00')
      const humanDateFormat = dateObject.toLocaleString('es-CO', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'America/Bogota' })
      return humanDateFormat
    }
  },
  head () {
    return {
      title: `Movimientos de Cuenta ${this.startDate} a ${this.endDate}`
    }
  }
}
</script>
