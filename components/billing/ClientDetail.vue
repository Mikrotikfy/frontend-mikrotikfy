<template>
  <div>
    <p ref="clientP" class="ml-2 hideMe rounded-xl px-2">
      Usuario ID: {{ billingInfo.clientId }} {{ billingInfo.clientName }}
    </p>
    <client-only>
      <v-data-table
        ref="billDataTable"
        style="overflow-y:scroll;height:63vh;"
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
        @current-items="$vuetify.goTo(0)"
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
        <template v-slot:[`item.amount`]="props">
          <span> ${{ Number(props.item.amount).toLocaleString('en') }} </span>
        </template>
      </v-data-table>
    </client-only>
  </div>
</template>
<script>
export default {
  data () {
    return {
      itemsPerPage: 100,
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
  },
  watch: {
    '$store.state.billing.billingInfo': {
      handler () {
        this.changeClient()
      }
    }
  },
  methods: {
    changeClient () {
      this.$refs.clientP.classList.remove('hideMe')
      setTimeout(() => {
        this.$refs.clientP.classList.add('hideMe')
      }, 100)
    }
  }
}
</script>
<style>
.hideMe {
    background-color: rgb(81, 135, 0);
    -moz-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Firefox */
    -webkit-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Safari and Chrome */
    -o-animation: cssAnimation 1s ease-in 0.3s forwards;
    /* Opera */
    animation: cssAnimation 1s ease-in 0.3s forwards;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
}
@keyframes cssAnimation {
    to {
        background-color: transparent;
    }
}
@-webkit-keyframes cssAnimation {
    to {
        background-color: transparent;
    }
}
</style>
