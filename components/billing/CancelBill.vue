<template>
  <div>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          x-small
          color="red darken-4"
          elevation="0"
          v-on="on"
          @click="dialog = true"
        >
          <v-icon>mdi-cancel</v-icon>
        </v-btn>
      </template>
      <span>Anular Estado de Cuenta</span>
    </v-tooltip>
    <v-dialog
      v-model="dialog"
      width="550"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title>
          <span class="headline">Anular Factura</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="reason"
            label="Motivo"
            required
            outlined
            :rules="[v => !!v || 'Este campo es requerido']"
            @keyup.enter="cancelBill"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="red darken-1"
            @click="cancelBill"
          >
            Anular
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    bill: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      reason: '',
      valid: false,
      loading: false
    }
  },
  computed: {
    currentService () {
      return this.$store.state.billing.currentService
    }
  },
  methods: {
    async cancelBill () {
      this.loading = true
      if (this.reason) {
        await this.$store.dispatch('billing/cancelBill', {
          bill: this.bill,
          reason: this.reason,
          token: this.$store.state.auth.token,
          payed: true // infers payed as true becaouse it does compute to the total amount in debt
        })
          .then(() => {
            this.$toast.success('Factura anulada correctamente', { duration: 5000 })
            this.$store.commit('billing/refresh')
            this.dialog = false
            this.loading = false
          })

        const legalNote = {
          city: this.$route.query.city,
          clienttype: this.$route.query.clienttype,
          token: this.$store.state.auth.token,
          biller: this.$store.state.auth,
          service: this.currentService.id,
          debit: 0,
          credit: this.bill.value,
          cancelled: true,
          concept: `Anulada ${this.bill.details} $${this.bill.value}`
        }
        await this.$store.dispatch('billing/createLegalNote', legalNote)
        this.loading = false
        this.amount = null
        this.details = null
        this.$store.commit('billing/refresh')
      } else {
        this.$toast.error('El motivo es requerido', { duration: 5000 })
        this.loading = false
      }
    }
  }
}
</script>
