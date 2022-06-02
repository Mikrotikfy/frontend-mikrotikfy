<template>
  <div>
    <p class="ml-4">
      Usuario ID: {{ billingInfo.clientId }} {{ billingInfo.clientName }}
    </p>
    <client-only>
      <v-data-table
        :headers="headers"
        :items.sync="billingInfo.movements"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :options.sync="options"
        :loading="loadingDataTable"
        no-data-text="Realiza una busqueda para iniciar..."
        loading-text="Cargando información de clientes..."
        dense
        hide-default-footer
        mobile-breakpoint="100"
        @page-count="pageCount = $event"
      >
        <template v-slot:[`item.type`]="props">
          <v-chip
            :color="props.item.type == 'RECAUDO' ? 'green' : props.item.type == 'FACTURACION' ? 'orange' : 'red'"
            text
            small
            label
          >
            {{ props.item.type }}
          </v-chip>
        </template>
      </v-data-table>
    </client-only>
  </div>
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
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Fecha', value: 'date', sortable: false },
        { text: 'Tipo de movimiento', value: 'type', sortable: false },
        { text: 'Valor', sortable: false, value: 'amount' }
      ]
    }
  },
  computed: {
    billingInfo () {
      return this.$store.state.billing.billingInfo
    }
  }
}
</script>
