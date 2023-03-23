<template>
  <div>
    <v-card>
      <v-card-title class="px-0">
        Clientes en cola:
        <strong v-if="$store.state.cuts.ready.length > 0" class="ml-2"> {{ this.$store.state.cuts.ready.length }} </strong>
        <span v-if="$store.state.cuts.errors > 0" class="ml-2"> No encontrados: {{ $store.state.cuts.errors }} </span>
        <v-spacer />
        <v-autocomplete
          v-if="applyOffer"
          v-model="offer"
          :items="offers"
          item-text="name"
          item-value="id"
          class="mr-2"
          outlined
          dense
          return-object
          hide-details="auto"
          :label="`Aplicar tarifa a ${this.$store.state.cuts.ready.length } clientes`"
        />
        <v-checkbox
          v-model="applyOffer"
          class="mr-2"
          label="Aplicar tarifa especifica"
        />
        <v-checkbox
          v-model="kick"
          color="red"
          label="Patear? (No recomendado)"
        />
      </v-card-title>
    </v-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      kick: false,
      applyOffer: false,
      offer: null
    }
  },
  computed: {
    offers () {
      return this.$store.state.offer.offers
    }
  },
  watch: {
    kick () {
      this.$store.commit('cuts/kick', this.kick)
    },
    applyOffer () {
      if (!this.applyOffer) {
        this.$store.commit('cuts/offer', null)
        this.offer = null
      }
      this.$store.commit('cuts/reset')
      this.$store.commit('cuts/prepare', false)
      this.$store.commit('cuts/applyOffer', this.applyOffer)
    },
    offer () {
      this.$store.commit('cuts/offer', this.offer)
    }
  },
  mounted () {
    this.getOffers()
  },
  methods: {
    async getOffers () {
      await this.$store.dispatch('offer/getOffers', {
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
