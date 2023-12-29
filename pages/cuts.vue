<template>
  <div>
    <v-container class="justify-center d-flex" fluid>
      <v-card width="100%" class="rounded-xl">
        <v-card-title class="text-center justify-center">
          <span class="headline">Gestión de Tarifas Masivamente {{
            $route.query.city
          }}</span>
        </v-card-title>
        <v-card-text>
          <v-stepper
            v-model="e1"
            class="transparent elevation-0"
          >
            <v-stepper-header class="elevation-0">
              <v-stepper-step
                :complete="e1 > 1"
                step="1"
              >
                Seleccion de Mes
              </v-stepper-step>

              <v-divider />
              <v-stepper-step
                :complete="e1 > 2"
                step="2"
              >
                Ingresar Codigos
              </v-stepper-step>

              <v-divider />

              <v-stepper-step
                :complete="e1 > 3"
                step="3"
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
                <CutsControls />
                <CutsClientPreparation :e1="e1" />
              </v-stepper-content>

              <v-stepper-content step="4">
                <CutsProcess />
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>
        </v-card-text>
      </v-card>
    </v-container>
    <v-container class="justify-center d-flex pt-0" fluid>
      <v-card v-if="e1 < 2" width="100%" class="rounded-xl">
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
  watch: {
    e1 (oldVal, newVal) {
      if (newVal === '1') {
        this.$store.commit('cuts/reset')
        this.$store.commit('cuts/reseterror')
        this.$store.commit('cuts/resetcuts')
        this.$store.commit('cuts/resetvalid')
        this.$store.commit('cuts/prepare', false)
      }
    },
    $route () {
      this.$store.commit('cuts/reset')
      this.$store.commit('cuts/reseterror')
      this.$store.commit('cuts/resetcuts')
      this.$store.commit('cuts/resetvalid')
      this.$store.commit('cuts/prepare', false)
    }
  },
  mounted () {
    this.$store.dispatch('cuts/getPlans', {
      token: this.$store.state.auth.token
    })
  },
  destroyed () {
    this.$store.commit('cuts/clear')
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
