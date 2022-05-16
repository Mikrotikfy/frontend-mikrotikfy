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
          @click="initComponent"
        >
          <v-icon>mdi-wifi-check</v-icon>
          <span v-if="block">
            Ver Estado
          </span>
        </v-btn>
      </template>
      <span>Estatus</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="590"
    >
      <v-card
        :loading="loading"
        :class="clientData ? clientData.online ? clientData.address.includes('172.') ? 'blue-grey darken-4' : 'teal darken-4' : '' : ''"
      >
        <v-card-title class="headline">
          {{ name }}
        </v-card-title>
        <div v-if="!loading">
          <v-card-text>
            <v-alert
              v-if="clientData && clientData.online && clientData.exists"
              dense
              text
              :type="clientData.address.includes('172.') ? 'error' : 'success'"
              class="my-4"
            >
              El cliente esta <strong>{{ clientData.address.includes('172.') ? 'en linea pero NO ESTA NAVEGANDO (SIGUE CORTADO) REPORTAR A NICO' : 'en Linea ' }}</strong>
            </v-alert>
            <v-alert
              v-else-if="clientData && !clientData.online && clientData.exists"
              dense
              outlined
              type="error"
              class="my-4"
            >
              Fuera de linea desde <strong>{{ clientData.offlineTime }}</strong> <br>
              Razón de la desconexión: <strong>{{ clientData.disconnectReason }}</strong> <br>
              Última MAC conocida: <strong>{{ clientData.lastCallerId }}</strong> <br>
              Última Mikrotik conocida: <strong>{{ clientData.mikrotik }}</strong>
            </v-alert>
            <v-alert
              v-else
              dense
              outlined
              type="warning"
              class="my-4"
            >
              Mal identificado en la API. Informa de esto al webmaster
            </v-alert>
            <v-divider class="my-4" />
            <div v-if="clientData && clientData.online">
              <v-row>
                <v-col>
                  <h3>Acceso: <strong><a :href="`http://${clientData.address}`" target="_blank">{{ clientData.address }}</a></strong></h3>
                  <v-spacer />
                  <h3>Mac: {{ clientData.mac_address }}</h3>
                  <v-spacer />
                  <h3>Uptime: {{ clientData.uptime }}</h3>
                  <v-spacer />
                  <h3>Clave: 4Rn0P{{ code }}</h3>
                </v-col>
                <v-col>
                  <h3>Descarga: <strong>{{ formatBytes(clientData.download) }}</strong></h3>
                  <h3>Subida: <strong>{{ formatBytes(clientData.upload) }}</strong></h3>
                  <h3>Mikrotik: {{ clientData.mikrotik }}</h3>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </div>
        <v-card-actions>
          <EditForm
            v-if="item"
            :client="item"
            :index="index"
            :role="$store.state.auth.allowed_components"
          />
          <v-spacer />

          <v-btn
            color="green darken-1"
            text
            @click="modal = false"
          >
            Cerrar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
import EditForm from '../edit/EditForm'
export default {
  name: 'ClientStatus',
  components: {
    EditForm
  },
  props: {
    clientid: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ''
    },
    code: {
      type: String,
      default: ''
    },
    role: {
      type: Array,
      default: () => {}
    },
    block: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    clientData: {},
    modal: false,
    clientExists: false,
    showCard: false,
    loading: true,
    showInfo: false,
    online: false
  }),
  methods: {
    async initComponent () {
      this.loading = true
      this.modal = true
      this.online = false
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clientstatus?id=${this.clientid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then((clientstatus) => {
          this.loading = false
          this.clientData = clientstatus
        })
    },
    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) { return '0 Bytes' }

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    }
  }
}
</script>

<style>

</style>
