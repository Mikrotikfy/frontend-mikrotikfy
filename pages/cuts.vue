<template>
  <div>
    <v-container class="justify-center d-flex">
      <v-card width="90%">
        <v-card-title class="text-center justify-center">
          <span class="headline">Gestión de Tarifas Masivamente {{$route.query.city}}</span>
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
                <v-checkbox
                  v-model="usePlan"
                  label="Seleccion segun plan"
                />
                <v-select
                  v-if="usePlan"
                  v-model="plan"
                  :items="plans"
                  label="Plan"
                  item-text="name"
                  item-value="id"
                />
                <v-textarea
                  v-else
                  v-model="codes"
                  outlined
                  class="mt-2"
                  label="Ingrese los Codigos, Uno por Linea"
                  rows="10"
                />

                <v-btn
                  color="primary"
                  :disabled="usePlan && !plan"
                  @click="confirmCodes"
                >
                  Continuar
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="2">
                <CutsControls v-if="$store.state.cuts.type === 'normal'" />
                <CutsReadyList v-if="$store.state.cuts.type === 'normal'" :e1="e1" />
                <CutsPlanPreparation v-if="$store.state.cuts.type === 'plan'" />
                <v-btn
                  v-if="($store.state.cuts.clients.length > 0 || $store.state.cuts.clientsByPlan.length > 0) && !loading"
                  color="primary"
                  class="mt-5"
                  :loading="loading"
                  @click="e1 = 3"
                >
                  Continuar
                </v-btn>
              </v-stepper-content>

              <v-stepper-content step="3">
                <CutsProcess v-if="$store.state.cuts.type === 'normal'" />
                <CutsPlanOperation v-if="$store.state.cuts.type === 'plan'" />
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
      plan: null,
      e1: '1'
    }
  },
  computed: {
    loading () {
      return this.$store.state.cuts.loading
    },
    plans () {
      return this.$store.state.cuts.plans
    }
  },
  mounted () {
    this.$store.dispatch('cuts/getPlans', {
      token: this.$store.state.auth.token
    })
  },
  methods: {
    async confirmCodes () {
      if (this.codes === null && !this.usePlan) {
        this.$toast.error('Ingrese los codigos antes de continuar')
        return
      }
      if (this.plan && this.usePlan) {
        this.$store.commit('cuts/setType', 'plan')
        await this.$store.dispatch('cuts/getClientsByPlan', {
          plan: this.plan,
          city: this.$route.query.city,
          token: this.$store.state.auth.token
        })
        this.e1 = '2'
        return
      }
      this.$store.commit('cuts/setType', 'normal')
      const codeArray = this.codes.trim().split('\n')
      this.$store.commit('cuts/setCodes', codeArray)
      this.e1 = '2'
    }
  },
  head () {
    return {
      title: 'Cortes ' + this.$route.query.city
    }
  }
}
</script>
<style scoped>

</style>
