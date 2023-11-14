<template>
  <div style="width:90%;">
    <h2 class="text-center mb-2">
      Asignar Tarifa
    </h2>
    <v-autocomplete
      v-if="service"
      v-model="selected"
      :items="offers"
      :disabled="!service.active || !$isAdmin()"
      :error="!service.active"
      :error-messages="!service.active ? ['El servicio debe estar activo antes de modificar su tarifa.'] : []"
      label="Tarifa"
      item-text="name"
      item-value="id"
      auto-select-first
      return-object
      outlined
      filled
      @change="confirm()"
    />
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
          <h3>Estas a punto de asignar una tarifa a este servicio.</h3>
        </v-card-text>
        <v-card-text>
          <strong class="green--text darken-4">{{ selected ? selected.name : 'Ninguna seleccionada' }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="red darken-4"
            @click="(setNewOffer(), setPlanFromModal())"
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
    service: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      offers: [],
      dialog: false,
      selected: null,
      isretired: false
    }
  },
  computed: {
    telegramBots () {
      return this.$store.state.telegram.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  async mounted () {
    await this.$store.dispatch('telegram/getTelegramBotsFromDatabase', { token: this.$store.state.auth.token })
    await this.getOffers()
    await this.getLastOfferMovement()
  },
  methods: {
    async setNewOffer () {
      const offer = this.selected
      await this.$store.dispatch('offer/setNewOffer', {
        token: this.$store.state.auth.token,
        service: this.service,
        offer,
        technician: this.$store.state.auth
      })
      await this.$store.dispatch('client/setAuxPlan', {
        token: this.$store.state.auth.token,
        serviceId: this.service.id,
        plan: offer.plan,
        index: this.index
      })
      this.dialog = false
      this.$store.commit('client/refresh') // this one refreshes the service
      this.$store.commit('billing/refresh') // this one refreshes the service when in billing interface
    },
    getLastOfferMovement () {
      this.selected = { ...this.service.offer }
    },
    setPlanFromModal () {
      if (this.service.name === 'INTERNET') {
        this.$store.dispatch('client/setPlanFromModal', {
          serviceId: this.service.id,
          isOfferChange: true,
          kick: true,
          newPlan: this.selected.plan,
          operator: this.$store.state.auth.id,
          token: this.$store.state.auth.token
        })
      }
      // this.$simpleTelegramUpdateOffer({ client: this.service, operator: this.$store.state.auth.username, offer: this.selected, telegramBots: this.telegramBots })
    },
    confirm () {
      this.dialog = true
    },
    async getOffers () {
      this.offers = await this.$store.dispatch('offer/getOffers', {
        token: this.$store.state.auth.token,
        city: this.service.city.name,
        clienttype: this.service.name
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
