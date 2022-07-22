<template>
  <div>
    <v-btn
      x-small
      color="yellow darken-4"
      elevation="0"
      @click="dialog = true"
    >
      Anular
      <v-icon>mdi-history</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="550"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Anular Factura</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="billingInfo.cancelBill.reason"
            label="Motivo"
            required
            :rules="[v => !!v || 'Este campo es requerido']"
          />
        </v-card-text>
        <v-card-actions>
          <v-btn color="red darken-1">
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
      billingInfo: {
        cancelBill: {
          reason: ''
        }
      }
    }
  }
}
</script>
