<template>
  <div>
    <v-textarea
      v-model="codes"
      outlined
      class="mt-2"
      label="Ingrese los Codigos, Uno por Linea"
      rows="10"
    />
    <v-btn
      color="primary"
      :disabled="!codes"
      @click="confirmCodes"
    >
      Continuar
    </v-btn>
    <v-btn
      @click="$store.commit('cuts/e1', '1')"
    >
      Cancelar
    </v-btn>
  </div>
</template>
<script>
export default {
  data () {
    return {
      codes: null
    }
  },
  computed: {
    loading () {
      return this.$store.state.cuts.loading
    },
    e1 () {
      return this.$store.state.cuts.el
    }
  },
  methods: {
    confirmCodes () {
      if (this.codes === null) {
        this.$toast.error('Ingrese los codigos antes de continuar')
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
