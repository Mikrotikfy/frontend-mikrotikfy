<template>
  <div>
    <span ref="clientP" class="ml-2 hideMe rounded-xl px-2">
      Usuario: {{ billingInfo.clientId }} {{ billingInfo.clientName }}
    </span>
    <client-only>
      <v-data-table
        ref="billDataTable"
        v-model="selected"
        :headers="headers"
        :items.sync="billingInfo.movements"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :options.sync="options"
        :loading="loadingDataTable"
        sort-by="id"
        sort-asc
        show-select
        single-select
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
          <span :style="props.item.type === 'RECAUDO' ? 'color:salmon;' : 'color:green;'"> ${{ Number(props.item.amount).toLocaleString('es') }} </span>
        </template>
        <template v-slot:[`item.details`]="props">
          <BillingDetails :billinginfo="props" />
        </template>
        <template v-slot:[`item.date`]="props">
          <span>{{ props.item.date.toLocaleString('es-ES') }} </span>
        </template>
        <template v-slot:[`item.actions`]="props">
          <BillingCancelBill :bill="props.item" />
        </template>
      </v-data-table>
    </client-only>
  </div>
</template>
<script>
export default {
  data () {
    return {
      selected: [],
      itemsPerPage: 100,
      page: 1,
      pageCount: 0,
      options: {},
      loadingDataTable: false,
      headers: [
        { text: 'ID', value: 'id', sortable: false },
        { text: 'Tipo de movimiento', value: 'type', sortable: false },
        { text: 'Observaciones', value: 'details', sortable: false },
        { text: 'Valor', sortable: false, value: 'amount' },
        { text: 'Fecha', value: 'date', sortable: false },
        { text: 'Acciones', value: 'actions', sortable: false }
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
        this.selectLastBill()
      }
    },
    '$store.state.billing.resetSelected': {
      handler () {
        this.selected = []
      }
    },
    selected () {
      this.$store.commit('billing/setSelected', this.selected)
    }
  },
  methods: {
    changeClient () {
      this.$refs.clientP.classList.remove('hideMe')
      setTimeout(() => {
        this.$refs.clientP.classList.add('hideMe')
      }, 100)
    },
    selectLastBill () {
      this.selected = []
      const bill = this.billingInfo.movements.filter(item => item.type === 'FACTURACION' && item.active)
      console.log(bill, typeof bill)
      this.selected.push(bill[0])
    }
  }
}
</script>
<style>
td {
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
