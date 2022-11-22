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
    <v-btn
      :disabled="!readyForSend && !codes.length > 0"
      color="primary"
      class="mt-2"
      @click="nextE1"
    >
      Continuar
    </v-btn>
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
    },
    readyForSend () {
      return this.$store.state.notification.readyForSend
    }
  },
  methods: {
    nextE1 () {
      this.$store.commit('notification/e1', { e1: 2 })
    },
    getCodesFromBills () {
      const codes = this.bills.map((bill) => {
        return bill.file.split('_')[1].split('.')[0]
      })
      this.codes = codes
      this.$store.commit('notification/setCodes', codes)
      if (codes.length > 0) {
        this.$store.commit('notification/readyForSend')
      }
    }
  }
}
</script>
