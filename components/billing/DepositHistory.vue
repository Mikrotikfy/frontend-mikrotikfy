<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          x-small
          color="blue darken-4"
          elevation="0"
          v-on="on"
          @click="dialog = true"
        >
          <v-icon>mdi-history</v-icon>
        </v-btn>
      </template>
      <span>Historial de movimientos</span>
    </v-tooltip>
    <v-dialog
      v-model="dialog"
      width="auto"
    >
      <v-card>
        <v-card-title>
          Abonos realizados a estado de cuenta <span class="text-decoration-underline green--text darken-3 ml-1">#{{ bill.id }}</span>
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="headers"
            :items="bill.invoice_movements"
            :items-per-page="10"
            class="elevation-1"
          >
            <template v-slot:[`item.id`]="{ item }">
              {{ item.id }}
            </template>
            <template v-slot:[`item.amount`]="{ item }">
              <v-chip>{{ '$' + formatCurrency(item.amount) }}</v-chip>
            </template>
            <template v-slot:[`item.details`]="{ item }">
              {{ item.details ? item.details : 'Sin Detalles.' }}
            </template>
            <template v-slot:[`item.createdAt`]="{ item }">
              {{ getDate(item.createdAt) }}
            </template>
            <template v-slot:[`item.biller`]="{ item }">
              <v-chip>{{ item.biller && item.biller.username ? item.biller.username : 'N/A' }}</v-chip>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false">
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    bill: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      headers: [
        { text: 'ID de Abono', value: 'id' },
        { text: 'Monto', value: 'amount' },
        { text: 'Detalles', value: 'details' },
        { text: 'Fecha', value: 'createdAt' },
        { text: 'Facturador', value: 'biller' }
      ]
    }
  },
  methods: {
    formatCurrency (value) {
      return Number(value).toLocaleString('es')
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    }
  }
}
</script>
