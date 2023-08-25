<template>
  <div>
    <v-card-title class="justify-center">
      Crear NAP
    </v-card-title>
    <client-only>
      <form v-if="cities">
        <v-container>
          <v-alert
            v-if="alertBox"
            type="info"
            :class="alertBoxColor"
            tile
            dismissible
          >
            {{ createdMessage }}
          </v-alert>
          <v-row>
            <v-container style="display:grid;row-gap:20px;">
              <v-text-field
                v-model="nap.code"
                label="Codigo"
                required
                outlined
                hide-details="auto"
                @click="alertBox = false"
              />
              <v-select
                v-model="nap.naptype"
                :items="napTypes"
                item-text="name"
                item-value="id"
                label="Tipo de Nap"
                outlined
                hide-details="auto"
                chips
              />
              <v-text-field
                v-model="nap.address"
                label="Direccion"
                required
                outlined
                hide-details="auto"
              />
              <v-select
                v-model="nap.city"
                item-text="name"
                item-value="id"
                :items="cities"
                :disabled="true"
                label="Ciudad"
                outlined
                dense
                hide-details="auto"
              />
              <v-autocomplete
                v-model="nap.neighborhood"
                item-text="name"
                item-value="id"
                :items="neighborhoods"
                label="Barrio"
                outlined
                dense
                hide-details="auto"
              />
              <v-select
                v-model="nap.technology"
                item-text="name"
                item-value="id"
                :items="technologies"
                label="Tecnología"
                outlined
                dense
                hide-details="auto"
                required
              />
              <v-btn
                class="rounded-xl blue darken-4"
                block
                :loading="isSubmitting"
                :disabled="isSubmitting"
                @click="createNap"
              >
                Crear NAP
              </v-btn>
            </v-container>
          </v-row>
        </v-container>
      </form>
    </client-only>
  </div>
</template>

<script>
export default {
  name: 'CreateNap',
  data: () => ({
    nap: {
      code: '',
      address: '',
      city: null,
      neighborhood: '',
      technology: '',
      naptype: ''
    },
    alertBox: false,
    alertBoxColor: '',
    createdMessage: '',
    napTypes: [],
    isSubmitting: false
  }),
  computed: {
    cities () {
      return this.$store.state.cities
    },
    neighborhoods () {
      return this.$store.state.neighborhoods
    },
    technologies () {
      return this.$store.state.technologies
    }
  },
  watch: {
    '$route.query.city' () {
      this.setCity()
    }
  },
  mounted () {
    this.setCity()
    this.getNapTypes()
  },
  methods: {
    createNap () {
      this.isSubmitting = !this.isSubmitting
      this.$store.dispatch('nap/createNap', { nap: this.nap, token: this.$store.state.auth.token })
        .then(() => {
          this.$store.dispatch('nap/getNaps', { city: this.$route.query.city, token: this.$store.state.auth.token })
          this.isSubmitting = !this.isSubmitting
          this.alertBox = true
          this.alertBoxColor = 'info darken-4'
          this.createdMessage = 'NAP creada correctamente.'
          this.$store.dispatch('nap/getNaps', {
            token: this.$store.state.auth.token,
            city: this.$route.query.city
          })
          this.$emit('close')
        })
        .catch((err) => {
          this.isSubmitting = !this.isSubmitting
          this.alertBox = true
          this.alertBoxColor = 'red darken-4'
          this.createdMessage = 'Error al crear la NAP.' + err
        })
    },
    getNapTypes () {
      this.$store.dispatch('nap/getNapTypes', this.$store.state.auth.token)
        .then(() => {
          this.napTypes = this.$store.state.nap.napTypes
        })
        .catch(() => {
          this.alertBox = true
          this.alertBoxColor = 'red darken-4'
          this.createdMessage = 'Error al obtener los tipos de Nap.'
        })
    },
    setCity () {
      this.nap.city = this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
    }
  }
}
</script>

<style>

</style>
