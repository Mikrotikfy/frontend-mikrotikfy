<template>
  <div>
    <div class="d-flex align-center mb-5">
      <span class="text-h5">Facturas encontradas: <strong class="green--text text-weight-bold">{{ bills.length }}</strong></span>
      <v-btn
        :disabled="codes.length > 0"
        color="primary"
        class="mt-2 ml-3"
        @click="getCodesFromBills"
      >
        Buscar Clientes
      </v-btn>
      <span v-if="codes.length > 0" class="text-h5 ml-3">Codigos encontrados: <strong class="green--text text-weight-bold">{{ codes.length }}</strong></span>
    </div>
    <v-data-table
      :headers="headers"
      :items="bills"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      codes: [],
      clients: [],
      headers: [
        { text: 'Archivo Factura', value: 'file', sortable: false }
      ]
    }
  },
  computed: {
    bills () {
      return this.$store.state.notification.bills.map((bill) => {
        return {
          file: bill
        }
      })
    }
  },
  methods: {
    getCodesFromBills () {
      const codes = this.bills.map((bill) => {
        return bill.file.split('_')[1].split('.')[0]
      })
      this.codes = codes
      this.$store.commit('notification/setCodes', codes)
      this.$store.commit('notification/readyForSend')
    }
  }
}
</script>
