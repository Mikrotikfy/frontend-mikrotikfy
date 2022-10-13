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
        :items.sync="billingInfo.bills"
        :items-per-page.sync="itemsPerPage"
        :page.sync="page"
        :options.sync="options"
        :loading="loadingDataTable"
        sort-by="id"
        sort-asc
        show-select
        no-data-text="Realiza una busqueda para iniciar..."
        loading-text="Cargando información de clientes..."
        dense
        hide-default-footer
        mobile-breakpoint="100"
        @page-count="pageCount = $event"
        @current-items="$vuetify.goTo(0)"
      >
        <template v-slot:[`item.type.name`]="props">
          <v-chip
            :color="caculateDebt(props.item.type.price, props.item.deposits) > 0 ? 'orange' : 'green'"
            text
            small
            label
          >
            {{ props.item.type.name }}
          </v-chip>
        </template>
        <template v-slot:[`item.type.price`]="props">
          <strong> ${{ Number(props.item.type.price).toLocaleString('es') }} </strong>
        </template>
        <template v-slot:[`item.debt`]="props">
          <strong class="text-h5"> ${{ Number(caculateDebt(props.item.type.price, props.item.deposits)).toLocaleString('es') }} </strong>
        </template>
        <template v-slot:[`item.details`]="props">
          <BillingDetails :billinginfo="props" />
        </template>
        <template v-slot:[`item.createdAt`]="props">
          <span>{{ props.item.createdAt.toLocaleString('es-ES', {
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }) }} </span>
        </template>
        <template v-slot:[`item.actions`]="props">
          <span class="d-flex justify-end" :data-index="props.index">
            <BillingPayBill
              v-if="!props.item.pay && selected.length < 2"
              :bill="props.item"
              :index="props.index"
              :debt="caculateDebt(props.item.type.price, props.item.deposits)"
              class="mr-2"
            />
            <BillingDepositHistory v-if="props.item.type === 'FACTURACION'" :bill="props.item" class="mr-2" />
            <BillingCancelBill :bill="props.item" />
          </span>
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
        { text: 'Tipo de movimiento', value: 'type.name', sortable: false },
        { text: 'Detalles', value: 'details', sortable: false },
        { text: 'Saldo Pendiente', sortable: false, value: 'debt' },
        { text: 'Fecha', value: 'createdAt', sortable: false },
        { text: 'Acciones', value: 'actions', sortable: false, class: 'text-right' }
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
      const bill = this.billingInfo.bills.filter(item => item.active)
      this.selected.push(bill[0])
    },
    caculateDebt (price, deposits) {
      return price - deposits.reduce((total, curr) => { return total + curr.amount }, 0)
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
