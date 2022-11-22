<template>
  <div>
    <v-select
      v-model="month"
      :items="months"
      label="Mes a operar"
      filled
      rounded
    />
    <v-btn
      color="primary"
      @click="monthSelect"
    >
      Continuar
    </v-btn>
  </div>
</template>

<script>
export default {
  data () {
    return {
      month: null,
      months: [
        {
          text: 'Enero',
          value: '1'
        },
        {
          text: 'Febrero',
          value: '2'
        },
        {
          text: 'Marzo',
          value: '3'
        },
        {
          text: 'Abril',
          value: '4'
        },
        {
          text: 'Mayo',
          value: '5'
        },
        {
          text: 'Junio',
          value: '6'
        },
        {
          text: 'Julio',
          value: '7'
        },
        {
          text: 'Agosto',
          value: '8'
        },
        {
          text: 'Septiembre',
          value: '9'
        },
        {
          text: 'Octubre',
          value: '10'
        },
        {
          text: 'Noviembre',
          value: '11'
        },
        {
          text: 'Diciembre',
          value: '12'
        }
      ]
    }
  },
  watch: {
    month () {
      this.setMonth()
    }
  },
  methods: {
    setMonth () {
      this.$store.commit('cuts/setMonth', this.month)
    },
    monthSelect () {
      if (!this.$store.state.cuts.month) {
        this.$toast.error('Selecciona un mes antes de continuar')
        return
      }
      this.$store.commit('cuts/e1', '2')
    }
  }
}
</script>
