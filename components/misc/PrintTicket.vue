<template>
  <div>
    <v-tooltip top>
      <!-- eslint-disable -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="my-2 mx-1"
          color="white black--text"
          dark
          small
          rounded
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-printer</v-icon>
          </v-btn>
        </template>
      <span>Imprimir Lista</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      fullscreen
      hide-overlay
      transition="dialog-bottom-transition"
    >
    <v-toolbar
      class="no-printme"
    >
      <v-btn
        icon
        @click="modal = false, $vuetify.theme.dark = true"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
      <v-card class="printme">
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col cols="2" style="border: 1px solid grey;" class="align-center justify-center printme">
                <MainLogoDark />
              </v-col>
              <v-col cols="5" :style="$route.query.clienttype === 'INTERNET' ? 'border: 1px solid grey;background-color:#bfffff;' : 'border: 1px solid grey;background-color:#ffe8bf;'" class="d-flex align-center justify-center">
                <h2 class="printme">Agenda Técnica {{ $route.query.clienttype }}</h2>
              </v-col>
              <v-col cols="5" style="border: 1px solid grey;" class="d-flex align-center justify-center">
                <v-row>
                  <v-col cols="5" class="text-center" style="border-right: 1px solid grey;">
                    <h3>Fecha: ______ de {{ getDate(new Date()) }}</h3>
                  </v-col>
                  <v-col cols="7" class="justify-center align-center d-flex">
                    <h3 style="color:#c9c9c9;"> Tecnico/s </h3>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <div
                v-for="item in tickets"
                :key="item.client.id"
                class="parent"
              >
                <span>
                  <strong
                    :class="getTicketTypeColor(item.tickettype.name)"
                  >
                    {{ item.tickettype.name }}
                  </strong>
                </span>
                <span>{{ item.client.code }}</span>
                <span>{{ item.client.name }}</span>
                <span v-if="item.tickettype.name !== 'TRASLADO'">
                  {{ item.client.addresses.length > 0 ? item.client.addresses.at(-1).address : item.client.address }}
                  {{ item.client.addresses.length > 0 ? item.client.addresses.at(-1).neighborhood.name : item.client.neighborhood.name }}
                </span>
                <span v-else style="display:grid;">
                  <strong class="red--text darken-4 text-decoration-underline">{{ item.details.split('CX:')[0] }}<br></strong>
                  <strong class="green--text darken-4 text-decoration-underline">{{ 'CX: ' + item.details.split('CX:')[1] }}</strong>
                </span>
                <span>{{ item.client.phone }}</span>
                <span style="color:#c9c9c9;">OBSERVACIONES</span>
                <span style="color:#c9c9c9;">FIRMA CLIENTE</span>
              </div>
              <div
                v-if="tickets.length <= 4"
                class="parent"
              >
                <span style="color:#c9c9c9;"><strong>Tipo de ticket</strong></span>
                <span style="color:#c9c9c9;">Código</span>
                <span style="color:#c9c9c9;">Nombre</span>
                <span style="color:#c9c9c9;">
                  Direccion
                </span>
                <span style="color:#c9c9c9;">Telefono</span>
                <span style="color:#c9c9c9;">OBSERVACIONES</span>
                <span style="color:#c9c9c9;">FIRMA CLIENTE</span>
              </div>
              <div
                class="parent"
              >
                <span style="color:#c9c9c9;"><strong>Tipo de ticket</strong></span>
                <span style="color:#c9c9c9;">Código</span>
                <span style="color:#c9c9c9;">Nombre</span>
                <span style="color:#c9c9c9;">
                  Direccion
                </span>
                <span style="color:#c9c9c9;">Telefono</span>
                <span style="color:#c9c9c9;">OBSERVACIONES</span>
                <span style="color:#c9c9c9;">FIRMA CLIENTE</span>
              </div>
            </v-row>
            <v-row class="mt-3 justify-center" style="border: 1px solid grey;">Agenda de servicio técnico generada por {{$store.state.auth.username.charAt(0).toUpperCase() + $store.state.auth.username.slice(1)}} el {{ getDateLog(new Date()) }} - Tabla autogenerada por la API</v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    tickets: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      modal: false,
      technician: null,
      technicians: []
    }
  },
  methods: {
    async initComponent () {
      await this.getTechnicians()
      if (this.tickets.length > 0) {
        this.$vuetify.theme.dark = false
        this.modal = true
      } else {
        this.$toast.error('Selecciona los clientes antes de imprimir', { position: 'bottom-center' })
      }
    },
    async getTechnicians () {
      this.technicians = await this.$store.dispatch('operator/getOperatorList', {
        token: this.$store.state.auth.token
      })
    },
    getTicketTypeColor (tickettype) {
      if (tickettype === 'SIN SERVICIO') {
        return 'red--text'
      } else if (tickettype === 'SERVICIO LENTO') {
        return 'orange--text darken-2'
      } else if (tickettype === 'INTERMITENCIA') {
        return 'orange--text darken-4'
      } else if (tickettype === 'CONEXION NUEVA') {
        return 'green--text darken-2'
      } else {
        return 'primary--text'
      }
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { month: 'long', year: 'numeric' })
      return humanDateFormat
    },
    getDateLog (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
<style scoped>
@media print {
  .no-printme {
    display: none !important;
  }
  .printme {
    display: block !important;
  }
}
.parent {
  display: grid;
  width: 100%;
  grid-template-columns: 3fr 1fr 4fr 4fr 2fr 4fr 4fr;
  grid-gap: 0px;
}
.parent > span {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px 0;
  border: 1px solid grey;
}
</style>
