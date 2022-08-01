<template>
  <v-card class="elevation-0">
    <v-card-title class="justify-center">
      Historial de Movimientos
    </v-card-title>
    <v-card-text style="display:grid;place-items:center;">
      <v-data-table
        :items="debtHistory"
        :headers="headers"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        @page-count="pageCount = $event"
      >
        <template v-slot:[`item.isindebt`]="props">
          <v-chip
            rounded
            :color="props.item.isindebt ? 'red' : 'green darken-3'"
          >
            {{ props.item.isindebt ? 'EN MORA' : 'AL DIA' }}
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
  data () {
    return {
      page: 1,
      itemsPerPage: 10,
      pageCount: 0,
      headers: [
        { text: 'Estado', value: 'isindebt', sortable: false },
        { text: 'Fecha de movimiento', value: 'createdAt' },
        { text: 'Quien lo hizo', value: 'technician.username', sortable: false }
      ]
    }
  },
  computed: {
    debtHistory () {
      return this.$store.state.offer.debtHistory
    }
  },
  methods: {
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
