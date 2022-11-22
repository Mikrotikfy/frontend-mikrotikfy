<template>
  <div>
    <v-container class="justify-center d-flex">
      <v-card width="90%">
        <v-card-title class="text-center justify-center">
          <span class="headline">Gestión de Tarifas Masivamente {{
            $route.query.city
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-stepper v-model="e1">
            <v-stepper-header>
              <v-stepper-step
                :complete="e1 > 1"
                step="1"
                editable
              >
                Seleccion de Mes
              </v-stepper-step>

              <v-divider />
              <v-stepper-step
                :complete="e1 > 2"
                step="2"
                editable
              >
                Ingresar Codigos
              </v-stepper-step>

              <v-divider />

              <v-stepper-step
                :complete="e1 > 3"
                step="3"
                editable
              >
                Seleccionar Operación
              </v-stepper-step>

              <v-divider />

              <v-stepper-step step="4">
                Proceso y Resumen
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">
                <CutsMonthSelect />
              </v-stepper-content>
              <v-stepper-content step="2">
                <CutsCodeList />
              </v-stepper-content>

              <v-stepper-content step="3">
                <CutsControls v-if="processType === 'normal'" />
                <CutsReadyList v-if="processType === 'normal'" :e1="e1" />
                <CutsPlanPreparation v-if="processType === 'plan'" />
              </v-stepper-content>

              <v-stepper-content step="4">
                <CutsProcess v-if="processType === 'normal'" />
                <CutsPlanOperation v-if="processType === 'plan'" />
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container>
      <v-card v-if="e1 < 2">
        <CutsResume />
      </v-card>
    </v-container>
  </div>
</template>
<script>
export default {
  data () {
    return {
      usePlan: false,
      codes: null,
      plan: null
    }
  },
  computed: {
    loading () {
      return this.$store.state.cuts.loading
    },
    e1 () {
      return this.$store.state.cuts.e1
    },
    processType () {
      return this.$store.state.cuts.type
    }
  },
  mounted () {
    this.$store.dispatch('cuts/getPlans', {
      token: this.$store.state.auth.token
    })
  },
  head () {
    return {
      title: 'Gestion de Tarifas ' + this.$route.query.city
    }
  }
}
</script>
<style scoped>

</style>
