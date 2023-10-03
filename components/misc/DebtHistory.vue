<template>
  <v-card class="elevation-0" style="height:100%;">
    <v-card-title class="justify-center">
      Historial de Movimientos
    </v-card-title>
    <v-card-text style="display:grid;place-items:center;">
      <v-data-table
        :items="service.debtmovements"
        :headers="headers"
        :page.sync="page"
        sort-by="createdAt"
        no-data-text="No hay historial de movimientos..."
        sort-desc
        :items-per-page="itemsPerPage"
        hide-default-footer
        @page-count="pageCount = $event"
      >
        <template v-slot:[`item.isindebt`]="props">
          <v-chip
            rounded
            :color="calculateClientStatusColor(props.item.isindebt, props.item.isretired)"
          >
            {{ calculateClientStatus(props.item.isindebt, props.item.isretired) }}
          </v-chip>
        </template>
        <template v-slot:[`item.createdAt`]="props">
          {{ getDate(props.item.createdAt) }}
        </template>
      </v-data-table>
      <v-pagination
        v-model="page"
        :length="pageCount"
      />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'DebtHistory',
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      page: 1,
      itemsPerPage: 5,
      pageCount: 0,
      headers: [
        { text: 'Estado', value: 'isindebt', sortable: false },
        { text: 'Fecha de movimiento', value: 'createdAt', sortable: false },
        { text: 'Quien', value: 'technician.username', sortable: false },
        { text: 'Detalles', value: 'comment', sortable: false }
      ]
    }
  },
  methods: {
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      return humanDateFormat
    },
    calculateClientStatus (indebt, isretired) {
      if (indebt && !isretired) { return 'EN MORA' }
      if (!indebt && !isretired) { return 'AL DIA' }
      if (!indebt && isretired) { return 'RETIRADO' }
      if (indebt && isretired) { return 'RETIRADO' }
    },
    calculateClientStatusColor (indebt, isretired) {
      if (indebt && !isretired) { return 'red' }
      if (!indebt && !isretired) { return 'green darken-3' }
      if (!indebt && isretired) { return 'yellow darken-4' }
      if (indebt && isretired) { return 'yellow darken-4' }
    }
  }
}
</script>
