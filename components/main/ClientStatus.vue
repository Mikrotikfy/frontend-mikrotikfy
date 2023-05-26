<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'green darken-4 white--text'"
          class="rounded-xl"
          :large="block"
          v-on="on"
          @click="initComponent"
        >
          <v-icon :class="block ? 'mr-1' : ''">mdi-wifi-check</v-icon>
          <span v-if="block">
            Ver Estado
          </span>
        </v-btn>
      </template>
      <span>Estatus</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="890"
      class="transparent"
      content-class="elevation-0"
    >
      <v-card
        :loading="loading"
        :class="clientData ? clientData.online ? clientData.address.includes('172.') ? 'blue-grey darken-4 rounded-xl' : 'teal darken-4 rounded-xl' : 'rounded-xl' : 'rounded-xl'"
      >
        <v-card-title>
          <v-icon>mdi-account</v-icon>
          {{ name }}
        </v-card-title>
        <v-divider />
        <div v-if="!loading">
          <v-card-text>
            <v-alert
              v-if="clientData && clientData.online && clientData.exists"
              dense
              text
              :type="clientData.address.includes('172.') ? 'error' : 'success'"
              class="mb-4"
            >
              El cliente esta <strong>{{ clientData.address.includes('172.') ? 'en linea pero NO ESTA NAVEGANDO (SIGUE CORTADO) REPORTAR A NICO' : 'en Linea ' }}</strong>
            </v-alert>
            <v-alert
              v-else-if="clientData && !clientData.online && clientData.exists"
              dense
              outlined
              type="error"
              class=""
            >
              Lleva fuera de linea <strong>{{ formatTimeOffLineSince(clientData.offlineTime) }}</strong> <br>
              Desde <strong>{{ formatTimeOffLine(clientData.offlineTime) }}</strong> <br>
              Razón de la desconexión: <strong>{{ disconnectReason(clientData.disconnectReason) }}</strong> <br>
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
              <v-icon>mdi-lightbulb-alert-outline</v-icon>
              Error de conexión con las Mikrotik. Suele deberse a fallas en el internet. Por favor reportar al webmaster
            </v-alert>
            <div v-if="clientData && clientData.online">
              <v-row>
                <v-col>
                  <h3>Acceso: <strong><a :href="`http://${clientData.address}`" target="_blank">{{ clientData.address }}</a></strong></h3>
                  <v-spacer />
                  <h3>Mac: {{ clientData.mac_address }}</h3>
                  <v-spacer />
                  <h3>En Linea: {{ formatTimeOnline(clientData.uptime) }}</h3>
                  <v-spacer />
                </v-col>
                <v-col>
                  <h3>Descarga: <strong>{{ formatBytes(clientData.download) }}</strong></h3>
                  <h3>Subida: <strong>{{ formatBytes(clientData.upload) }}</strong></h3>
                  <h3>Equipo RouterBoard: {{ clientData.mikrotik }}</h3>
                </v-col>
              </v-row>
            </div>
          </v-card-text>
        </div>
        <v-card-actions>
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
      <v-card
        class="mt-5 rounded-xl"
      >
        <v-card-title>
          <v-icon>mdi-history</v-icon>
          Eventos recientes de subida y caída del servicio
        </v-card-title>
        <v-divider />
        <div>
          <v-card-text>
            <v-data-table
              :headers="headers"
              :items="events"
              no-data-text="No hay eventos recientes"
              no-results-text="No hay eventos recientes"
              items-per-page="5"
              calculate-widths
            >
              <template v-slot:[`item.type`]="props">
                <v-chip>
                  <v-icon :color="props.item.type === 'up' ? 'green' : 'red'">{{ props.item.type === 'up' ? 'mdi-arrow-up-bold' : 'mdi-arrow-down-bold' }}</v-icon>
                  {{ props.item.type === 'up' ? 'Subida' : 'Caída' }}
                </v-chip>
              </template>
              <template v-slot:[`item.createdAt`]="props">
                <div style="display:flex!important;flex-direction:column;">
                  <span class="text-caption" style="white-space:nowrap;">
                    {{ getHour(props.item.createdAt) }}
                  </span>
                  <span style="line-height:1rem;" class="text-caption text--secondary">
                    {{ getDate(props.item.createdAt) }}
                  </span>
                </div>
              </template>
            </v-data-table>
          </v-card-text>
        </div>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'ClientStatus',
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
    online: false,
    events: [],
    headers: [
      { text: 'Evento', sortable: false, value: 'type' },
      { text: 'Sucedido', sortable: false, value: 'createdAt' },
      { text: '#', sortable: false, value: '' }
    ]
  }),
  computed: {
    clientForDeviceManipulation () {
      return this.$store.state.client.clientForDeviceManipulation
    }
  },
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
          this.searchDeviceByClient(clientstatus.mac_address)
        })
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          client: this.clientid
        },
        pagination: {
          page: 1,
          pageSize: 50
        },
        sort: ['createdAt:desc']
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}pppoe-events?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then((events) => {
          this.loading = false
          this.events = events.data
        })
    },
    async searchDeviceByClient (mac = 'default') {
      const macOfCurrentDevice = mac.replace(/:/g, '')
      await this.$store.dispatch('client/clientForDeviceManipulation', {
        clientid: this.clientid,
        token: this.$store.state.auth.token
      })
      if (!this.clientForDeviceManipulation) { return }
      const devices = this.clientForDeviceManipulation.mac_addresses.map((device) => {
        const newDevice = { ...device }
        newDevice.mac_address = newDevice.mac_address.replace(/:/g, '')
        return device
      })
      if (devices.length === 0) {
        this.$store.dispatch('device/assignDeviceToClient', {
          token: this.$store.state.auth.token,
          clientid: this.clientid,
          mac: macOfCurrentDevice
        })
        this.$toast.info('Nueva MAC asignada', { duration: 5000 })
        return
      }
      if (devices.length > 0) {
        const device = devices.find(device => device.mac_address === macOfCurrentDevice)
        if (!device) {
          this.$store.dispatch('device/assignDeviceToClient', {
            token: this.$store.state.auth.token,
            clientid: this.clientid,
            mac: macOfCurrentDevice
          })
          this.$toast.info('Nueva MAC asignada', { duration: 5000 })
        }
      }
    },
    formatBytes (bytes, decimals = 2) {
      if (bytes === 0) { return '0 Bytes' }

      const k = 1024
      const dm = decimals < 0 ? 0 : decimals
      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

      const i = Math.floor(Math.log(bytes) / Math.log(k))

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
    },
    formatTimeOnline (string) {
      const time = string.split('d')
      let days = 0
      let hours = 0
      let minutes = 0

      if (time.length > 1) {
        days = parseInt(time[0])
        const remainingTime = time[1]

        if (remainingTime.includes('h')) {
          const timeParts = remainingTime.split('h')
          hours = parseInt(timeParts[0])
          const minutesPart = timeParts[1]

          if (minutesPart.includes('m')) {
            minutes = parseInt(minutesPart.split('m')[0])
          }
        } else if (remainingTime.includes('m')) {
          minutes = parseInt(remainingTime.split('m')[0])
        }
      } else if (string.includes('h')) {
        hours = parseInt(time[0].split('h')[0])
        const minutesPart = time[0].split('h')[1]

        if (minutesPart.includes('m')) {
          minutes = parseInt(minutesPart.split('m')[0])
        }
      } else if (string.includes('m')) {
        minutes = parseInt(time[0].split('m')[0])
      }

      return `${days} días, ${hours} horas y ${minutes} minutos`
    },
    formatTimeOffLine (fecha) {
      const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
      ]

      const partes = fecha.split(' ')
      const fechaPartes = partes[0].split('/')
      let mes = fechaPartes[0]

      // Convertir el formato de mes en inglés a su equivalente en español
      if (mes.length === 3) {
        mes = meses.find(mesEspanol => mesEspanol.startsWith(mes.toLowerCase()))
      } else {
        mes = meses[Number(mes) - 1]
      }

      const dia = fechaPartes[1]
      const año = fechaPartes[2]
      const hora = partes[1].split(':')[0]
      const minutos = partes[1].split(':')[1]
      const ampm = Number(hora) >= 12 ? 'pm' : 'am'

      const formatoFecha = `${mes.charAt(0).toUpperCase() + mes.slice(1)} ${dia} de ${año}`
      const formatoHora = `${Number(hora) > 12 ? Number(hora) - 12 : hora}:${minutos} ${ampm}`

      return `${formatoFecha} ${formatoHora}`
    },
    formatTimeOffLineSince (fecha) {
      const fechaActual = new Date()
      const fechaCadena = new Date(fecha)
      const diferenciaMilisegundos = Math.abs(fechaCadena - fechaActual)
      const segundos = Math.floor(diferenciaMilisegundos / 1000)
      const minutos = Math.floor(segundos / 60)
      const horas = Math.floor(minutos / 60)
      const dias = Math.floor(horas / 24)

      const diferencia = {
        dias,
        horas: horas % 24,
        minutos: minutos % 60,
        segundos: segundos % 60
      }

      const formatoDiferencia = `${diferencia.dias <= 1 ? '' : diferencia.dias} ${diferencia.dias <= 1 ? '' : 'dias'} ${diferencia.horas} horas ${diferencia.minutos} minutos`

      return formatoDiferencia
    },
    disconnectReason (string) {
      let traduccion = ''

      switch (string) {
        case 'hung-up':
          traduccion = 'Perdida de potencia optica o fallo en cable UTP'
          break
        case 'peer request':
          traduccion = 'Usuario desconecto el equipo'
          break
        case 'nas request':
          traduccion = 'El usuario fue pateado'
          break
        default:
          traduccion = 'Razón desconocida'
          break
      }

      return traduccion
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })
      return humanDateFormat
    },
    getHour (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { hour: 'numeric', minute: 'numeric', hour12: true })
      return humanDateFormat
    }
  }
}
</script>

<style>

</style>
