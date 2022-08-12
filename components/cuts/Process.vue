<template>
  <div>
    <span style="display:grid;place-items:center;">
      <v-btn
        color="red darken-4 mx-auto justify-self-center"
        class="mb-5"
        x-large
        :loading="loading"
        @click="makeCuts"
      >
        Iniciar proceso de cortes
      </v-btn>
    </span>
    <v-card>
      <v-card-title>
        Proceso
      </v-card-title>
    </v-card>
    <v-card v-if="inprocess">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="cuts"
          :loading="loading"
          :item-class="getcolor"
        />
      </v-card-text>
    </v-card>
    <v-card v-if="cutErrors.length > 0">
      <v-card-text>
        <v-data-table
          :headers="headers"
          :items="cutErrors"
          :loading="loading"
          :item-class="getcolor"
        />
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  props: {
    e1: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      prepare: false,
      inprocess: false,
      headers: [
        { text: 'Codigo', value: 'code' },
        { text: 'Nombre', value: 'name' },
        { text: 'Direccion', value: 'address' },
        { text: 'Barrio', value: 'neighborhood.name' },
        { text: 'Telefono', value: 'phone' },
        { text: 'Plan', value: 'plan.name' },
        { text: 'Resultado', value: 'success' }
      ]
    }
  },
  computed: {
    validClients () {
      return this.$store.state.cuts.validClients
    },
    cuts () {
      return this.$store.state.cuts.cuts
    },
    cutErrors () {
      return this.$store.state.cuts.cutErrors
    },
    kick () {
      return this.$store.state.cuts.kick
    },
    loading () {
      return this.$store.state.cuts.loading
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  watch: {},
  methods: {
    async makeCuts () {
      this.inprocess = true
      for (let i = 0; i < this.validClients.length; i++) {
        const client = this.validClients[i]
        await this.$store.dispatch('offer/setNewDebt', {
          token: this.$store.state.auth.token,
          isindebt: true,
          isretired: false,
          client,
          technician: this.$store.state.auth
        }).then(() => {
          this.$simpleTelegramUpdateDebt({ client, operator: this.$store.state.auth.username, isInDebt: true, isRetired: false, telegramBots: this.telegramBots })
          this.$store.dispatch('client/setPlanFromModal', {
            clientId: client.id,
            clientIndex: null,
            isOfferChange: false,
            kick: this.kick,
            newPlan: { id: 7 },
            operator: this.$store.state.auth.id,
            token: this.$store.state.auth.token
          }).then((success) => {
            if (success) {
              this.$store.commit('cuts/addCut', {
                client
              })
            } else {
              this.$store.commit('cuts/addCutError', {
                client
              })
            }
          })
        })
      }
    },
    getcolor (item) {
      if (item.success) {
        return 'success--text'
      } else {
        return 'error--text'
      }
    }
  }
}
</script>
<style>
.ready-list {
  background-color:red;
}
</style>
