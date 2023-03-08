<template>
  <v-card v-if="$route.query.clienttype === 'INTERNET'" class="elevation-0" style="height:100%;">
    <v-card-title class="justify-center">
      Historial de tarifas
    </v-card-title>
    <v-card-text style="display:grid;place-items:center;">
      <v-data-table
        :items="client.offermovements"
        :headers="headers"
        :page.sync="page"
        sort-by="createdAt"
        no-data-text="No hay historial de tarifas..."
        sort-desc
        :items-per-page="itemsPerPage"
        hide-default-footer
        @page-count="pageCount = $event"
      >
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
  <v-card v-else class="elevation-0" style="height:100%;">
    <v-card-title class="d-flex justify-center">
      No Aplica para TV
    </v-card-title>
  </v-card>
</template>
<script>
export default {
  name: 'MiscOfferHistory',
  props: {
    client: {
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
        { text: 'Tarifa Asignada', value: 'offer.name', sortable: false },
        { text: 'Fecha de asignacion', value: 'createdAt', sortable: false },
        { text: 'Quien', value: 'technician.username', sortable: false },
        { text: 'Detalles', value: 'details', sortable: false }
      ]
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
