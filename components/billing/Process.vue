<template>
  <v-container>
    <v-row>
      <v-col class="align-center d-flex">
        <v-btn
          color="primary"
          class="rounded-xl"
          block
          :loading="loading"
          :disabled="loading || clients.length > 0 || end"
          @click="generateBilling"
        >
          Generar Estados de Cuenta
        </v-btn>
        <v-btn
          v-if="end"
          color="secondary"
          class="rounded-xl"
          block
          @click="backToE1"
        >
          Finalizar y regresar
        </v-btn>
      </v-col>
    </v-row>
    <!-- <v-row>
      <v-col>
        <v-btn
          class="rounded-xl"
          color="red"
          block
          :loading="loading"
          :disabled="loading || clients.length < 1 || ended"
          @click="sendNotifications"
        >
          Enviar Notificaciones
        </v-btn>
      </v-col>
    </v-row> -->
    <v-row>
      <v-col>
        <span v-if="sendIndex > 0" class="text-h5">Enviados: <strong>{{ sendIndex }}</strong></span>
        <span v-if="generatedBills > 0" class="text-h5">Cargados: <strong>{{ generatedBills }}</strong></span>
        <span v-if="omitedBills > 0" class="text-h5">Sin Tarifa: <strong>{{ omitedBills }}</strong></span>
        <span v-if="alreadyBilled > 0" class="text-h5">Ya generados: <strong>{{ alreadyBilled }}</strong></span>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-data-table
          v-if="clients.length > 0"
          :headers="headers"
          :items="clients"
        >
          <template v-slot:[`item.messageSent`]="{ item }">
            <v-chip
              v-if="item.messageSent"
              :color="item.messageSent ? 'green' : 'red'"
              text-color="white"
            >
              {{ item.messageSent ? 'ENVIADO' : 'FALLIDO' }}
            </v-chip>
            <v-chip
              v-else
              :color="'cyan darken-4'"
              text-color="white"
            >
              PENDIENTE
            </v-chip>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      end: false,
      loading: false,
      generatedBills: 0,
      omitedBills: 0,
      omitedBillsObejcts: [],
      alreadyBilled: 0,
      alreadyBilledObjects: [],
      ended: false,
      headers: [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Celular', value: 'phone', sortable: false },
        { text: 'Estado del envio', value: 'messageSent', sortable: false }
      ]
    }
  },
  computed: {
    activeServices () {
      return this.$store.state.billing.activeServices
    },
    sendIndex () {
      return this.$store.state.billing.sendIndex
    },
    clients () {
      return this.$store.state.billing.clients || []
    },
    month () {
      return this.$store.state.billing.month
    },
    year () {
      return this.$store.state.billing.year
    }
  },
  methods: {
    sendNotifications () {
      this.loading = true
      // const clients = this.clients

      // for (let i = 0; i < clients.length; i++) {
      //   this.$store.commit('notification/setSendIndex', i + 1)

      //   await this.$store.dispatch('notification/sendWhatsapp', {
      //     client: clients[i],
      //     month: this.month,
      //     token: this.$store.state.auth.token
      //   }).then(async (res) => {
      //     let success = false
      //     if (
      //       res &&
      //       res.contacts &&
      //       res.contacts[0]
      //     ) {
      //       success = true
      //     }
      //     await this.$store.dispatch('notification/updateSentStatus', {
      //       token: this.$store.state.auth.token,
      //       index: i,
      //       success,
      //       city: this.$route.query.city,
      //       clienttype: this.$route.query.clienttype,
      //       client: clients[i]
      //     })
      //   })
      // }
      this.loading = false
      this.ended = true
    },
    async generateBilling () {
      this.loading = true
      for (let i = 0; i < this.activeServices.length; i++) {
        if (this.activeServices[i].offer === null) {
          this.omitedBills++
          this.omitedBillsObejcts.push(this.activeServices[i])
          continue
        }
        if (this.activeServices[i].billingmonth === this.month.value && this.activeServices[i].billingyear === this.year) {
          this.alreadyBilled++
          this.alreadyBilledObjects.push(this.activeServices[i])
          continue
        }
        await this.$store.dispatch('billing/updateBillingPeriod', {
          token: this.$store.state.auth.token,
          service: this.activeServices[i],
          billingmonth: this.month.value,
          billingyear: this.year
        })
        await this.$store.dispatch('billing/addMovement', {
          balance: this.activeServices[i].offer.price,
          value: this.activeServices[i].offer.price,
          month: this.month.value,
          year: this.year,
          type: 'FACTURA',
          offer: this.activeServices[i].offer.id,
          concept: 'FACTURACION MENSUAL',
          details: this.month.text,
          payed: false,
          partial: false,
          indebt: false,
          service: this.activeServices[i].id,
          invoice_type: 1,
          token: this.$store.state.auth.token
        })
        const legalNote = {
          city: this.$route.query.city,
          clienttype: this.$route.query.clienttype,
          token: this.$store.state.auth.token,
          biller: this.$store.state.auth,
          service: parseInt(this.activeServices[i].id),
          debit: this.activeServices[i].offer.price,
          credit: 0,
          concept: 'FACTURACION MENSUAL'
        }
        await this.$store.dispatch('billing/createLegalNote', legalNote)
        this.generatedBills++
      }
      this.loading = false
      this.end = true
    },
    getMonthNameByNumber () {
      const monthNames = [
        'ENERO',
        'FEBRERO',
        'MARZO',
        'ABRIL',
        'MAYO',
        'JUNIO',
        'JULIO',
        'AGOSTO',
        'SEPTIEMBRE',
        'OCTUBRE',
        'NOVIEMBRE',
        'DICIEMBRE'
      ]
      return monthNames[this.month - 1]
    }
  }
}
</script>
