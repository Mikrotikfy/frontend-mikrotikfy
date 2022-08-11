<template>
  <v-container>
    <v-card>
      <v-card-title class="text-center justify-center">
        <span class="headline">Gestión de Tarifas Masivamente</span>
      </v-card-title>
      <v-card-text>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step
              :complete="e1 > 1"
              step="1"
            >
              Ingresar Codigos
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step
              :complete="e1 > 2"
              step="2"
            >
              Seleccionar Operación
            </v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">
              Proceso y Resumen
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card
                class="mb-12"
                color="grey lighten-1"
                height="200px"
              ></v-card>

              <v-btn
                color="primary"
                @click="e1 = 2"
              >
                Continue
              </v-btn>

              <v-btn text>
                Cancel
              </v-btn>
            </v-stepper-content>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      uwu: ''
    }
  }
}
</script>
<style scoped>

</style>
