<template>
  <div>
    <div v-if="hasWhatsapp" class="d-flex">
      <v-text-field
        v-model="userRandomNumber"
        label="Ingrese el codigo de confirmacion enviado al numero del cliente"
        class="mt-1"
        style="border-radius: 0px 0px 0px 0px;"
        outlined
        hide-details="auto"
      />
      <v-btn
        color="primary"
        class="mt-1"
        style="border-radius: 0px 10px 10px 0px; height:56px;"
        :disabled="!userRandomNumber"
        x-large
        @click.enter="testRandomNumber"
      >
        <v-icon>
          mdi-send
        </v-icon>
      </v-btn>
    </div>
    <div v-else>
      <v-card
        class="rounded-xl"
      >
        <v-card-title style="border-bottom: 1px green solid;">
          <v-icon class="green--text darken-4 mr-2">
            mdi-check-circle
          </v-icon>
          Numero telefonico confirmado - <strong class="ml-1">{{ clientNumber }}</strong>
        </v-card-title>
        <v-card-text class="mt-3">
          A continuacion se creara un nuevo cliente con el numero de telefono anteriormente ingresado.
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            @click="createDialog = true"
          >
            Crear cliente
          </v-btn>
        </v-card-actions>
      </v-card>
    </div>
    <v-dialog
      v-model="createDialog"
      origin="bottom center"
      class="transparent"
      max-width="1350px"
      :retain-focus="false"
    >
      <CreateForm
        v-if="createDialog"
        :clientnumber="clientNumber"
      />
    </v-dialog>
  </div>
</template>
<script>
export default {
  data: () => ({
    userRandomNumber: null,
    createDialog: false
  }),
  computed: {
    hasWhatsapp () {
      return this.$store.state.create.hasWhatsapp
    },
    randomNumber () {
      return this.$store.state.create.randomNumber
    },
    clientNumber () {
      return this.$store.state.create.clientNumber
    },
    currentCity () {
      return this.$store.state.auth.cities.find(city => city.name === this.$route.query.city)
    }
  },
  methods: {
    testRandomNumber () {
      if (parseInt(this.userRandomNumber) === this.randomNumber) {
        this.$store.commit('create/hasWhatsapp', false)
      } else {
        this.$toast.error('El codigo ingresado no es correcto')
      }
    }
  }
}
</script>
