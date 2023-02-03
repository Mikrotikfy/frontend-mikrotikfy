<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent"
        >
          <v-icon>mdi-note-plus</v-icon>
          <span v-if="block">
            Ver Estados de Cuenta
          </span>
        </v-btn>
      </template>
      <span>Estados de cuenta</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="1024"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title>
          <v-icon>mdi-bill</v-icon>
          Estados de cuenta para {{ client.name }}
        </v-card-title>
        <v-divider />
        <v-card-text v-if="clientData">
          <v-data-table
            :headers="[
              { text: 'Mes', value: 'month',sortable: false },
              { text: 'Año', value: 'year', sortable: false },
              { text: 'Fue enviada en facturacion mensual', value: 'success', sortable: false },
              { text: 'Enviada', value: 'createdAt',sortable: false },
              { text: 'Reenviada', value: 'updatedAt', sortable: false },
              { text: 'Reenviada el', value: 'resend_at', sortable: false },
              { text: 'Acciones', value: 'actions', sortable: false }
            ]"
            :items="clientData.monthlybills"
            :loading="loading"
            :mobile-breakpoint="0"
            :no-data-text="'No hay datos para mostrar'"
            :no-results-text="'No hay resultados para mostrar'"
            class="elevation-1"
            hide-default-footer
            item-key="id"
            show-expand
          >
            <template v-slot:[`item.success`]="{ item }">
              <v-chip
                :color="item.success ? 'green' : 'red'"
                :text-color="item.success ? 'white' : 'white'"
              >
                <v-icon>{{ item.success ? 'mdi-check' : 'mdi-close' }}</v-icon>
                {{ item.success ? 'Si' : 'No' }}
              </v-chip>
            </template>
            <template v-slot:[`item.createdAt`]="{ item }">
              {{ getHumanDate(item.createdAt) }}
            </template>
            <template v-slot:[`item.resend_at`]="{ item }">
              {{ item.resend_at ? getHumanDate(item.resend_at) : 'Nunca' }}
            </template>
            <template v-slot:[`item.updatedAt`]="{ item }">
              {{ item.resend ? item.resend > 0 ? `${item.resend} ${item.resend > 1 ? 'veces' : 'vez'}` : 'Nunca' : 'Nunca' }}
            </template>
            <template v-slot:[`item.actions`]="{ item }">
              <div class="d-flex">
                <v-btn
                  class="mr-2"
                  color="primary"
                  :href="`https://admin.arnoproducciones.com/${item.path}`"
                  target="_blank"
                  small
                >
                  <v-icon>mdi-magnify</v-icon>
                  Ver
                </v-btn>
                <v-btn
                  :color="item.success ? 'yellow darken-4' : 'green darken-4'"
                  :disabled="item.resend_at && !hasPassed24Hours(item.resend_at)"
                  small
                  @click="sendBill(item)"
                >
                  <v-icon>mdi-send</v-icon>
                  {{ item.success ? 'Reenviar' : 'Enviar' }}
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'ClientStatus',
  props: {
    client: {
      type: Object,
      default: () => {}
    },
    block: {
      type: Boolean,
      default: false
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    billData: null,
    clientData: null,
    months: [
      {
        text: 'Enero',
        value: 1
      },
      {
        text: 'Febrero',
        value: 2
      },
      {
        text: 'Marzo',
        value: 3
      },
      {
        text: 'Abril',
        value: 4
      },
      {
        text: 'Mayo',
        value: 5
      },
      {
        text: 'Junio',
        value: 6
      },
      {
        text: 'Julio',
        value: 7
      },
      {
        text: 'Agosto',
        value: 8
      },
      {
        text: 'Septiembre',
        value: 9
      },
      {
        text: 'Octubre',
        value: 10
      },
      {
        text: 'Noviembre',
        value: 11
      },
      {
        text: 'Diciembre',
        value: 12
      }
    ]
  }),
  methods: {
    async initComponent () {
      this.modal = true
      await this.getBillsByClientId()
    },
    hasPassed24Hours (date) {
      if (!date) { return false }
      const now = new Date()
      const billDate = new Date(date)
      const diff = now.getTime() - billDate.getTime()
      const hours = diff / (1000 * 3600)
      return hours > 24
    },
    async getBillsByClientId () {
      this.clientData = await this.$store.dispatch('billing/getBillsByClientId', {
        client: this.client,
        token: this.$store.state.auth.token
      })
    },
    async sendBill (bill) {
      this.loading = true
      bill.month = this.months.find(m => m.value === bill.month)
      await this.$store.dispatch('billing/sendBill', {
        client: this.client,
        bill
      })
      await this.$store.dispatch('billing/updateResend', {
        token: this.$store.state.auth.token,
        bill
      })
      await this.getBillsByClientId()
      this.loading = false
    },
    getHumanDate (date) {
      return new Date(date).toLocaleDateString({
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(200px, 1fr));
  grid-gap: 1rem;
  grid-auto-rows: minmax(100px, auto);
}
.grid-item {
  border-radius: 5px;
  padding: 1rem;
  font-size: 1.2rem;
  text-align: center;
}

</style>
