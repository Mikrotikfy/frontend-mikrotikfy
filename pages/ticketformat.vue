<template>
  <div>
    <v-card class="printme elevation-0">
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="2" style="border: 1px solid grey;" class="align-center justify-center printme">
              <MainLogoDark />
            </v-col>
            <v-col cols="5" :style="$route.query.clienttype === 'INTERNET' ? 'border: 1px solid grey;background-color:#bfffff;' : 'border: 1px solid grey;background-color:#ffe8bf;'" class="d-flex align-center justify-center">
              <h2 class="printme">
                Agenda Técnica {{ $route.query.clienttype }}
              </h2>
            </v-col>
            <v-col cols="5" style="border: 1px solid grey;" class="d-flex align-center justify-center">
              <v-row>
                <v-col cols="5" class="text-center" style="border-right: 1px solid grey;">
                  <h3>Fecha: ______ de {{ getDate(new Date()) }}</h3>
                </v-col>
                <v-col cols="7" class="justify-center align-center d-flex">
                  <h3 style="color:#c9c9c9;">
                    Tecnico/s
                  </h3>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="mt-5">
            <div
              v-for="item in ticketListForPrint"
              :key="item.id"
              :class="$route.query.clienttype === 'INTERNET' ? 'parent-internet' : 'parent-television'"
            >
              <h5>
                <strong
                  :class="getTicketTypeColor(item.tickettype.name)"
                >
                  {{ item.tickettype.name }}
                </strong>
              </h5>
              <h5 v-if="$route.query.clienttype === 'INTERNET'">
                {{ item.id }}
              </h5>
              <h5>{{ item.code }}</h5>
              <h5>{{ item.name }}</h5>
              <h5 v-if="item.tickettype.name !== 'TRASLADO'">
                {{ item.addresses.at(-1).address }}
                {{ item.addresses.at(-1).neighborhood.name }}
              </h5>
              <h5 v-else style="display:grid;">
                <strong class="red--text darken-4 text-decoration-underline">{{ item.details.split('CX:')[0] }}<br></strong>
                <strong class="green--text darken-4 text-decoration-underline">{{ 'CX: ' + item.details.split('CX:')[1] }}</strong>
              </h5>
              <h5>{{ item.phone }}</h5>
              <h5 style="color:#c9c9c9;">
                OBSERVACIONES
              </h5>
              <h5 style="color:#c9c9c9;">
                FIRMA CLIENTE
              </h5>
            </div>
            <div
              v-if="ticketListForPrint.length <= 4"
              :class="$route.query.clienttype === 'INTERNET' ? 'parent-internet' : 'parent-television'"
            >
              <span style="color:#c9c9c9;"><strong>Tipo de ticket</strong></span>
              <span v-if="$route.query.clienttype === 'INTERNET'" style="color:#c9c9c9;">ID</span>
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
              :class="$route.query.clienttype === 'INTERNET' ? 'parent-internet' : 'parent-television'"
            >
              <span style="color:#c9c9c9;"><strong>Tipo de ticket</strong></span>
              <span v-if="$route.query.clienttype === 'INTERNET'" style="color:#c9c9c9;">ID</span>
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
          <v-row class="mt-3 justify-center" style="border: 1px solid grey;">
            Agenda de servicio técnico generada por {{ $store.state.auth.username.charAt(0).toUpperCase() + $store.state.auth.username.slice(1) }} el {{ getDateLog(new Date()) }} - Tabla autogenerada por la API
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'TicketFormat',
  layout: 'print',
  data () {
    return {
      modal: false,
      technician: null,
      technicians: [],
      ticketListForPrint: []
    }
  },
  mounted () {
    this.getTicketListForPrint()
    this.$vuetify.theme.dark = false
  },
  methods: {
    getTicketListForPrint () {
      if (localStorage.getItem('ticketListForPrint')) {
        this.ticketListForPrint = JSON.parse(localStorage.getItem('ticketListForPrint'))
      }
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
  * {
  -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }
  @page { margin: 0; }
  .no-printme {
    display: none !important;
  }
  .printme {
    display: block !important;
  }
}
.parent-internet {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 3fr) minmax(0, 1fr) minmax(0, 2fr) minmax(0, 4fr) minmax(0, 4fr) minmax(0, 2fr) minmax(0, 4fr) minmax(0, 4fr);
  grid-gap: 0px;
}
.parent-television {
  display: grid;
  width: 100%;
  grid-template-columns: minmax(0, 3fr) minmax(0, 2fr) minmax(0, 4fr) minmax(0, 4fr) minmax(0, 2fr) minmax(0, 4fr) minmax(0, 4fr);
  grid-gap: 0px;
}
.parent > h6, h5, h4, span {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 30px 5px;
  border: 1px solid grey;
}
</style>
