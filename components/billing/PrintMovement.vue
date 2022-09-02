<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    light
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="rounded-xl"
        color="white black--text"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-printer</v-icon>
      </v-btn>
    </template>
    <v-card>
      <BillingBillTemplate />
    </v-card>
  </v-dialog>
</template>
