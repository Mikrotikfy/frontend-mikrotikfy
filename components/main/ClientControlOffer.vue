<template>
  <div style="width:90%;">
    <h2 class="text-center mb-2">
      Asignar Tarifa
    </h2>
    <v-autocomplete
      v-model="selected"
      :items="offers"
      :disabled="isretired"
      :error="isretired"
      :error-messages="isretired ? ['El cliente debe estar activo antes de modificar su tarifa.'] : []"
      label="Tarifa"
      item-text="name"
      item-value="id"
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
          <h3>Estas a punto de asignar una tarifa a este cliente.</h3>
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
    client: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      offers: [],
      selected: null,
      dialog: false,
      isretired: false
    }
  },
  computed: {
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  watch: {
    '$store.state.offer.debtHistory' () {
      this.getLastDebtMovement()
    }
  },
  async mounted () {
    await this.getOffers()
    await this.initComponent()
  },
  methods: {
    initComponent () {
      this.getLastOfferMovement()
      this.getLastDebtMovement()
    },
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
    async getLastOfferMovement () {
      const res = await this.$store.dispatch('offer/getLastOfferMovement', {
        token: this.$store.state.auth.token,
        client: this.client
      })
      if (res) {
        this.selected = res
      } else {
        await this.getOfferByPlanId()
        this.setNewOffer()
      }
    },
    async getLastDebtMovement () {
      const res = await this.$store.dispatch('offer/getLastDebtMovement', {
        client: this.client,
        token: this.$store.state.auth.token
      })
      if (res) {
        if (res.isretired || res.isindebt) {
          this.isretired = true
        } else {
          this.isretired = false
        }
      }
    },
    setPlanFromModal () {
      this.$store.dispatch('client/setPlanFromModal', {
        clientId: this.client.id,
        clientIndex: this.index,
        isOfferChange: true,
        newPlan: this.selected.plan,
        operator: this.$store.state.auth.id,
        token: this.$store.state.auth.token
      })
      this.$simpleTelegramUpdateOffer({ client: this.client, operator: this.$store.state.auth.username, offer: this.selected, telegramBots: this.telegramBots })
    },
    async getOfferByPlanId () {
      this.selected = await this.$store.dispatch('offer/getOfferByPlanId', {
        token: this.$store.state.auth.token,
        client: this.client
      })
    },
    confirm () {
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
