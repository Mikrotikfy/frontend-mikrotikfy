<template>
  <div>
    <div class="d-flex">
      <v-select
        v-model="selectedCity"
        :items="cities"
        label="Filtrar Ciudad"
        item-value="id"
        item-text="name"
        return-object
        filled
        rounded
        hide-details="auto"
        class="mr-2 elevation-0"
        style="width:180px;"
        @change="changeCity(selectedCity)"
      >
        <template v-slot:item="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-select
        v-model="selectedClienttype"
        :items="clienttypes"
        label="Filtrar Servicio"
        item-value="id"
        item-text="name"
        return-object
        filled
        rounded
        hide-details="auto"
        class="mr-2 elevation-0"
        style="width:180px;"
        @change="changeType(selectedClienttype)"
      >
        <template v-slot:item="{ item }">
          {{ item.name }}
        </template>
      </v-select>
      <v-select
        v-model="month"
        :items="months"
        label="Mes a operar"
        filled
        rounded
      />
    </div>
    <v-btn
      :disabled="!month || !selectedCity || !selectedClienttype"
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
      selectedCity: null,
      selectedClienttype: null,
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
  computed: {
    cities () {
      return this.$store.state.auth.cities
    },
    clienttypes () {
      return this.$store.state.auth.clienttypes
    }
  },
  watch: {
    month () {
      this.setMonth()
    }
  },
  mounted () {
    this.setSelectedCity()
    this.setSelectedClienttype()
  },
  methods: {
    setSelectedCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    setSelectedClienttype () {
      if (this.$route.query.clienttype) {
        this.selectedClienttype = this.$store.state.auth.clienttypes.find(c => c.name === this.$route.query.clienttype)
      }
    },
    changeCity (city) {
      this.$router.push({ query: { city: city.name, clienttype: this.$route.query.clienttype } })
    },
    changeType (clienttype) {
      this.$router.push({ query: { city: this.$route.query.city, clienttype: clienttype.name } })
    },
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
