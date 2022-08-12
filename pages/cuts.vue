<template>
  <v-container class="justify-center d-flex">
    <v-card width="90%">
      <v-card-title class="text-center justify-center">
        <span class="headline">Gestión de Tarifas Masivamente</span>
      </v-card-title>
      <v-card-text>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step
              :complete="e1 > 1"
              step="1"
              editable
            >
              Ingresar Codigos
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="e1 > 2"
              step="2"
              editable
            >
              Seleccionar Operación
            </v-stepper-step>

            <v-divider />

            <v-stepper-step step="3">
              Proceso y Resumen
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-textarea
                v-model="codes"
                outlined
                class="mt-2"
                label="Ingrese los Codigos, Uno por Linea"
                rows="10"
              />

              <v-btn
                color="primary"
                @click="confirmCodes"
              >
                Continuar
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <CutsControls />
              <CutsReadyList :e1="e1" />

              <v-btn
                v-if="$store.state.cuts.clients.length > 0 && !loading"
                color="primary"
                class="mt-5"
                :loading="loading"
                @click="e1 = 3"
              >
                Continuar
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <CutsProcess />
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-card-text>
    </v-card>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      codes: null,
      e1: '1'
    }
  },
  computed: {
    loading () {
      return this.$store.state.cuts.loading
    }
  },
  methods: {
    confirmCodes () {
      if (this.codes === null) {
        this.$toast.error('Ingrese los codigos antes de continuar')
        return
      }
      const codeArray = this.codes.trim().split('\n')
      this.$store.commit('cuts/setCodes', codeArray)
      this.e1 = '2'
    }
  }
}
</script>
<style scoped>

</style>
