<template>
  <span v-if="client">
    <v-card
      class="rounded-xl"
    >
      <v-card-title>
        <v-icon class="mr-2">
          mdi-lan
        </v-icon>
        Segmento de red
      </v-card-title>
      <v-card-text v-if="current.length > 0">
        Este cliente pertenece a las siguientes NAPS:
        <v-chip
          v-for="(item, index) in current"
          :key="index"
          color="grey darken-3"
          class="mr-2"
          small
          label
        >
          {{ item.code }}
        </v-chip>
      </v-card-text>
      <v-card-text>
        <v-autocomplete
          ref="autocomplete1"
          v-model="selected"
          :items="naps"
          :disabled="waitingForClientNapData || saving"
          label="Seleccionar NAP"
          autocomplete="off"
          item-text="code"
          item-value="id"
          hide-details="auto"
          return-object
          outlined
          @change="save"
        />
      </v-card-text>
      <v-card-text>
        <NapCreateDialog />
      </v-card-text>
    </v-card>
  </span>
  <span v-else>
    No compatible
  </span>
</template>

<script>
export default {
  name: 'ManageClientNap',
  props: {
    isticket: {
      type: Boolean,
      default: false
    },
    ticketindex: {
      type: Number,
      default: 0
    },
    client: {
      type: Object,
      required: true
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: false,
      selected: null,
      saving: false,
      current: [],
      waitingForClientNapData: true
    }
  },
  computed: {
    naps () {
      return this.$store.state.nap.naps
    },
    clientNapData () {
      return this.$store.state.nap.clientNapData
    }
  },
  mounted () {
    this.initComponent()
  },
  methods: {
    initComponent () {
      this.modal = true
      this.getNapsByCity()
      this.getClientNapData()
    },
    async save () {
      this.saving = true
      await this.$store.dispatch('nap/saveClientNap', {
        token: this.$store.state.auth.token,
        client: this.client,
        nap: this.selected,
        current: this.current
      })
      if (this.isticket) {
        await this.$store.commit('ticket/addNap', {
          token: this.$store.state.auth.token,
          ticketindex: this.ticketindex,
          nap: this.selected
        })
      }
      this.saving = false
      this.selected = null
      this.modal = false
    },
    async getClientNapData () {
      await this.$store.dispatch('nap/getClientNapData', {
        token: this.$store.state.auth.token,
        client: this.client
      })
      this.current = this.clientNapData.naps
      this.waitingForClientNapData = false
    },
    async getNapsByCity () {
      await this.$store.dispatch('nap/getNaps', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city
      })
      await this.$store.commit('nap/filterCurrentNaps', {
        naps: this.clientNapData.naps
      })
    }
  }
}
</script>

<style>

</style>
