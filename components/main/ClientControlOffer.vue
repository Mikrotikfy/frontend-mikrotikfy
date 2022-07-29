<template>
  <div>
    <h2 class="text-center mb-2">
      Asignar Tarifa
    </h2>
    <v-list>
      <v-list-item-group active-class="border" mandatory>
        <v-list-item
          v-for="(offer, i) in offers"
          :key="i"
          @click="confirm(offer)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="offer.name" />
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <v-dialog
      v-model="dialog"
      transition="dialog-bottom-transition"
      max-width="600"
    >
      <v-card>
        <v-toolbar color="red darken-4">
          Confirmacion de seguridad
        </v-toolbar>
        <v-card-text class="mt-4">
          <h3>Estas a punto de asignar una tarifa a este cliente.</h3>
        </v-card-text>
        <v-card-text>
          <strong class="green--text darken-4">{{ selected ? selected.name : 'Ninguna seleccionada'}}</strong>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="red darken-4"
            @click="setNewOffer"
          >
            Asignar
          </v-btn>
          <v-btn
            text
            @click="dialog = false"
          >
            Cancelar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'ClientControlOffer',
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      selected: null,
      offers: [],
      dialog: false
    }
  },
  mounted () {
    this.getOffers()
  },
  methods: {
    setNewOffer () {
      const offer = this.selected
      this.$store.dispatch('offer/setNewOffer', {
        token: this.$store.state.auth.token,
        client: this.client,
        offer,
        technician: this.$store.state.auth
      })
      this.dialog = false
    },
    confirm (e) {
      this.selected = e
      this.dialog = true
    },
    async getOffers () {
      this.offers = await this.$store.dispatch('offer/getOffers', {
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
<style scoped>
.border {
  background-color: rgb(11, 67, 11);
}
</style>
