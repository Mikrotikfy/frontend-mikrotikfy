<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="activeClients"
      :items-per-page="itemsPerPage"
      :page.sync="page"
      class="elevation-0"
      style="height:45svh;overflow-y:scroll;"
      hide-default-footer
      :loading="loading"
      :caption="`Clientes activos en ${$route.query.city} a la fecha: ${activeClients.length}`"
      @page-count="pageCount = $event"
    >
      <template v-slot:[`item.balance`]="props">
        <strong> ${{ Number(props.item.balance).toLocaleString('es') }} </strong>
      </template>
      <template v-slot:[`item.active`]="props">
        <v-chip>
          <v-icon
            :color="props.item.active ? 'green' : 'red'"
            small
            left
          >
            mdi-circle
          </v-icon>
          {{ props.item.active ? 'Activo' : 'Inactivo' }}
        </v-chip>
      </template>
      <template v-slot:[`item.indebt`]="props">
        <v-chip>
          <v-icon
            :color="props.item.indebt ? 'red' : 'green'"
            small
            left
          >
            mdi-circle
          </v-icon>
          {{ props.item.indebt ? 'En mora' : 'Al día' }}
        </v-chip>
      </template>
    </v-data-table>
    <v-pagination v-model="page" :length="pageCount" />
    <v-btn
      :disabled="!activeClients.length > 0 || !month || !year"
      color="primary"
      class="mt-2"
      @click="nextE1"
    >
      Continuar <v-icon class="ml-1">
        mdi-arrow-right
      </v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  data () {
    return {
      codes: [],
      clients: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 100,
      loading: false,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Tarifa', value: 'offer.name', sortable: false },
        { text: 'Saldo', value: 'balance', sortable: false },
        { text: 'Estado', value: 'active', sortable: false },
        { text: 'Deudor', value: 'indebt', sortable: false }
      ]
    }
  },
  computed: {
    activeClients () {
      return this.$store.state.billing.activeClients
    },
    readyForSend () {
      return this.$store.state.notification.readyForSend
    },
    month () {
      return this.$store.state.billing.month
    },
    year () {
      return this.$store.state.billing.year
    }
  },
  methods: {
    nextE1 () {
      this.$store.commit('billing/e1', { e1: 2 })
    }
  }
}
</script>
