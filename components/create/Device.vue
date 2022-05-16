<template>
  <span class="d-flex">
    <v-btn
      class="mr-4"
      elevation="0"
      :block="block"
      :color="$vuetify.theme.dark && !block ? 'primary' : 'primary'"
      @click="dialogDevice = true"
    >
      <v-icon>mdi-plus</v-icon>
      Agregar MAC
      <span v-if="block">
        Router/ONU
      </span>
    </v-btn>
    <v-dialog v-if="dialogDevice" v-model="dialogDevice" max-width="1100px" :retain-focus="false" :fullscreen="getResolution()">
      <v-card>
        <v-card-title>
          <v-toolbar
            dark
          >
            <v-btn
              icon
              dark
              @click="dialogDevice = false"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
            <v-toolbar-title>Crear Equipo</v-toolbar-title>
          </v-toolbar>
        </v-card-title>
        <v-card-text>
          <v-container>
            <!-- <MiscMacScanner @detectedmac="detectedMac($event)" /> -->
            <v-alert
              v-if="alertBox"
              type="info"
              :class="alertBoxColor"
              tile
              dismissible
            >
              {{ createdMessage }}
            </v-alert>
            <v-form ref="createDevice" v-model="valid" class="mt-3">
              <v-row>
                <v-col
                  cols="12"
                >
                  <v-row>
                    <v-col>
                      <v-text-field
                        :value="device.mac_address ? device.mac_address.toUpperCase() : ''"
                        label="Mac"
                        :rules="valid_mac"
                        required
                        outlined
                        dense
                        @input="device.mac_address = $event.toUpperCase()"
                      />
                    </v-col>
                    <v-col>
                      <v-autocomplete
                        v-model="device.devicebrand"
                        item-text="name"
                        item-value="_id"
                        :items="devicebrands"
                        :rules="valid_brand"
                        return-object
                        label="Marca"
                        outlined
                        dense
                        hide-details
                        @change="alertBox = false"
                      />
                    </v-col>
                    <v-col>
                      <v-text-field
                        v-model="device.details"
                        label="Comentario"
                        required
                        outlined
                        dense
                      />
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn
            class="mr-4"
            color="primary"
            :loading="loading"
            :disabled="loading"
            @click="createDeviceFn()"
          >
            Confirmar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
/* eslint-disable vue/prop-name-casing */
export default {
  name: 'CreateDevice',
  props: {
    clientid: {
      type: Number,
      default: -1
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => {
    return {
      device: {},
      valid: false,
      pref_mac: '',
      dialogDevice: false,
      alertBox: false,
      alertBoxColor: '',
      createdMessage: '',
      loading: false,
      valid_mac: [
        value => !!value || 'Debes especificar la Mac',
        (value) => {
          const pattern = /^[A-Fa-f0-9]+$/
          return pattern.test(value) || 'La mac no es válida. No pongas guiones ni dos puntos'
        }
      ],
      valid_brand: [
        value => !!value || 'Debes especificar la marca'
      ],
      success: false,
      error: false,
      commentDisabled: false,
      successMessage: '',
      errorMessage: ''
    }
  },
  computed: {
    cities () {
      return this.$store.state.cities
    },
    plans () {
      return this.$store.state.plans
    },
    neighborhoods () {
      return this.$store.state.neighborhoods
    },
    technologies () {
      return this.$store.state.technologies
    },
    devicebrands () {
      return this.$store.state.devicebrands
    }
  },
  methods: {
    detectedMac (mac) {
      this.$set(this.device, 'mac_address', mac)
    },
    async createDeviceFn () {
      if (this.valid) {
        this.loading = true
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}devices`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          },
          body: JSON.stringify({
            data: { mac_address: this.device.mac_address, details: this.device.details, devicebrand: this.device.devicebrand.id, clients: [this.clientid] }
          })
        }).then((input) => {
          if (input.status === 200) {
            Promise.resolve(input.json())
              .then((device) => {
                this.$emit('createDevice', { device, devicebrand: this.device.devicebrand })
                this.dialogDevice = false
                this.loading = false
              })
          } else {
            this.loading = false
            throw new Error('Error creating device')
          }
        }).catch((error) => {
          this.loading = false
          // eslint-disable-next-line no-console
          console.error(error)
        })
      } else {
        this.alertBox = true
        this.createdMessage = 'Debes completar todos los campos'
        this.alertBoxColor = 'red'
        this.loading = false
      }
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getResolution () {
      const res = document.body.clientWidth
      if (res < 800) {
        const isMobile = true
        return isMobile
      } else {
        const isMobile = false
        return isMobile
      }
    }
  }
}
</script>

<style>

</style>
