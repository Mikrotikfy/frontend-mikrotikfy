<template>
  <div>
    <v-card-title>
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
            <v-container>
              <v-text-field
                v-model="nap.code"
                label="Codigo"
                required
                outlined
                @click="alertBox = false"
              />
              <v-select
                v-model="nap.naptype"
                :items="napTypes"
                item-text="name"
                item-value="id"
                label="Tipo de Nap"
                outlined
                chips
              />
              <v-text-field
                v-model="nap.address"
                label="Direccion"
                required
                outlined
              />
              <v-select
                v-model="nap.city"
                item-text="name"
                item-value="id"
                class="mb-3"
                :items="cities"
                :disabled="true"
                label="Ciudad"
                outlined
                dense
                hide-details
              />
              <v-autocomplete
                v-model="nap.neighborhood"
                item-text="name"
                item-value="id"
                class="mb-3"
                :items="neighborhoods"
                label="Barrio"
                outlined
                dense
                hide-details
              />
              <v-select
                v-model="nap.technology"
                item-text="name"
                item-value="id"
                class="mb-3"
                :items="technologies"
                label="Tecnología"
                outlined
                dense
                required
                hide-details
              />
              <v-btn
                class="mr-4 blue darken-4"
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
      city: '',
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
  mounted () {
    this.nap.city = this.$store.state.cities.find(c => c.name === this.$route.query.city).id
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
    }
  }
}
</script>

<style>

</style>
