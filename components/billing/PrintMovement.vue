<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    light
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-tooltip top>
        <template v-slot:activator="{ on: ontooltip, attrs: tooltip }">
          <v-btn
            icon
            color="white black--text"
            v-bind="{ ...attrs, ...tooltip}"
            v-on="{...on, ...ontooltip}"
          >
            <v-icon>mdi-printer</v-icon>
          </v-btn>
        </template>
        <span>Imprimir Historial</span>
      </v-tooltip>
    </template>
    <v-card>
      <BillingBillTemplate />
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data () {
    return {
      dialog: false
    }
  }
}
</script>
