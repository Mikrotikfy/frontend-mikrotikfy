<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-file-account-outline</v-icon>
          <span v-if="block">
            Tramites Electronicos
          </span>
        </v-btn>
      </template>
      <span>Tramites Electronicos</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="990"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title class="headline">
          Tramites electronicos
        </v-card-title>
        <v-card-text>
          <v-checkbox
            v-model="client.electronicbill"
            label="Factura Electronica"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'Tramits',
  props: {
    client: {
      type: Object,
      default: () => {}
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: false,
    loading: true,
    page: 1,
    pageCount: 0,
    itemsPerPage: 10
  }),
  methods: {
    updateDeviceList (device) {
      this.devices.push({
        mac_address: device.device.data.mac_address,
        details: device.device.data.details,
        devicebrand: device.devicebrand,
        createdAt: device.device.data.createdAt
      })
      this.$toast.success('Dispositivo creado correctamente', { duration: 4000, position: 'bottom-center' })
    },
    initComponent () {
      this.modal = true
      this.loading = false
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getColor (state) {
      if (state) {
        return 'blue darken-4'
      } else {
        return 'red'
      }
    },
    getState (state) {
      if (state) {
        return 'Abierto'
      } else {
        return 'Cerrado'
      }
    }
  }
}
</script>

<style>

</style>
