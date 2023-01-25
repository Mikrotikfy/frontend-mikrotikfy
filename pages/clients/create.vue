<template>
  <v-container>
    <v-card class="rounded-xl mx-auto elevation-0" max-width="1024">
      <v-stepper v-model="e1" class="transparent elevation-0">
        <v-stepper-header>
          <v-stepper-step
            :complete="e1 > 1"
            step="1"
            editable
          >
            Tipo de Cliente
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="e1 > 2"
            step="2"
            editable
          >
            Disponibilidad de WhatsApp
          </v-stepper-step>

          <v-divider />

          <v-stepper-step
            :complete="e1 > 3"
            step="3"
            editable
          >
            Envio de Codigo
          </v-stepper-step>
          <v-divider />

          <v-stepper-step step="4">
            Verificacion de Numero
          </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <CreateSelectClienttype />
          </v-stepper-content>

          <v-stepper-content step="2">
            <CreateTypeDisponibility />
          </v-stepper-content>

          <v-stepper-content step="3">
            <CreateSendVerification />
          </v-stepper-content>

          <v-stepper-content step="4">
            <CreateVerification />
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-container>
</template>
<script>
export default {
  computed: {
    e1 () {
      return this.$store.state.create.e1
    }
  }
}
</script>
