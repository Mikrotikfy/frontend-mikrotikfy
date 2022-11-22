<template>
  <div>
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
      @keyup.enter="confirmCodes"
    />
    <v-btn
      color="primary"
      :disabled="usePlan && !plan"
      @click="confirmCodes"
    >
      Continuar
    </v-btn>
  </div>
</template>
<script>
export default {
  data () {
    return {
      codes: null,
      usePlan: false
    }
  },
  computed: {
    loading () {
      return this.$store.state.cuts.loading
    },
    plans () {
      return this.$store.state.cuts.plans
    },
    e1 () {
      return this.$store.state.cuts.el
    }
  },
  watch: {
    usePlan () {
      this.$store.commit('cuts/usePlan', this.usePlan)
    }
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
        this.$store.commit('cuts/e1', '3')
        return
      }
      this.$store.commit('cuts/setType', 'normal')
      const codeArray = this.codes.trim().split('\n')
      this.$store.commit('cuts/setCodes', codeArray)
      this.$store.commit('cuts/e1', '3')
    }
  }
}
</script>
