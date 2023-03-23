<template>
  <span v-if="client">
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :text="!block"
          :x-small="!block"
          :block="block"
          class="rounded-xl"
          :color="$vuetify.theme.dark && !block ? 'white' : client.naps.length > 0 ? 'grey darken-2' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-lan</v-icon>
          <span v-if="block">{{ client.naps.length > 0 ? 'Actualizar NAP' : 'Agregar NAP' }}</span>
        </v-btn>
      </template>
      <span>Gestionar Acceso a Red</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="800"
    >
      <v-card>
        <v-card-title>
          Gestionar Acceso a Red {{ client.name }}
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
            v-model="selected"
            :items="naps"
            :disabled="waitingForClientNapData"
            label="Seleccionar NAP"
            item-text="code"
            item-value="id"
            hide-details="auto"
            return-object
            outlined
          />
        </v-card-text>
        <v-card-text>
          <v-btn
            color="primary"
            @click="save()"
          >
            Guardar
          </v-btn>
          <NapCreateDialog />
        </v-card-text>
      </v-card>
    </v-dialog>
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
  methods: {
    initComponent () {
      this.modal = true
      this.getNapsByCity()
      this.getClientNapData()
    },
    save () {
      this.$store.dispatch('nap/saveClientNap', {
        token: this.$store.state.auth.token,
        client: this.client,
        nap: this.selected,
        current: this.current
      })
      if (this.isticket) {
        this.$store.commit('ticket/addNap', {
          token: this.$store.state.auth.token,
          ticketindex: this.ticketindex,
          nap: this.selected
        })
      }
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
