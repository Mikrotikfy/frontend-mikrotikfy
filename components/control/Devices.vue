<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          icon
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-router-wireless</v-icon>
        </v-btn>
      </template>
      <span>Dispositivos Vinculados</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      width="900"
    >
      <v-card
        :loading="loading"
        class="rounded-xl"
      >
        <v-card-title>
          <v-icon class="mr-2">
            mdi-wifi
          </v-icon>
          Equipos asociados
        </v-card-title>
        <v-card-text>
          <CreateDevice :serviceid="service.id" @createDevice="updateDeviceList($event)" />
        </v-card-text>
        <div v-if="!loading">
          <v-card-text>
            <client-only>
              <h3>{{ name }}</h3>
              <v-data-table
                :headers="headers"
                :items="devices"
                :items-per-page="itemsPerPage"
                sort-by="createdAt"
                calculate-widths
                sort-desc
                :page.sync="page"
                no-data-text="No hay equipos para mostrar aun..."
                loading-text="Cargando información de equipos..."
                dense
                hide-default-footer
                mobile-breakpoint="100"
                @page-count="pageCount = $event"
              >
                <template v-slot:[`item.createdAt`]="{ item }">
                  <span>
                    {{ getDate(item.createdAt) }}
                  </span>
                </template>
              </v-data-table>
            </client-only>
            <div v-if="pageCount > 1" class="text-center pt-2">
              <v-pagination v-model="page" :length="pageCount" />
            </div>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'Devices',
  props: {
    name: {
      type: String,
      default: 'Devices'
    },
    service: {
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
    itemsPerPage: 10,
    devices: [],
    headers: [
      { text: 'Mac', sortable: false, value: 'mac_address' },
      { text: 'Marca', sortable: false, value: 'devicebrand.name' },
      { text: 'Comentario', sortable: false, value: 'details' },
      { text: 'Fecha de Adicion', sortable: true, value: 'createdAt' }
    ]
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
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          services: {
            id: {
              $eq: this.service.id
            }
          }
        },
        populate: [
          'devicebrand'
        ]
      },
      {
        encodeValuesOnly: true
      })
      fetch(`${this.$config.API_STRAPI_ENDPOINT}devices?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then(({ data: devices }) => {
          this.devices = devices
        })
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
