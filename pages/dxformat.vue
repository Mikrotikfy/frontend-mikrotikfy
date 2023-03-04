<template>
  <div v-if="clients">
    <v-card class="printme">
      <v-card-text>
        <v-container fluid>
          <v-row>
            <v-col cols="2" style="border: 1px solid grey;" class="align-center justify-center printme">
              <MainLogoDark />
            </v-col>
            <v-col cols="5" :style="clienttype === 'INTERNET' ? 'border: 1px solid grey;background-color:#ffbfbf;' : 'border: 1px solid grey;background-color:#c9bfff;'" class="d-flex align-center justify-center">
              <h2 class="printme">
                Agenda Desconexiones {{ $route.query.clienttype }}
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
              v-for="item in clients"
              :key="item.id"
              class="parent"
            >
              <span>
                {{ item.code }}
              </span>
              <span>
                {{ item.name }}
              </span>
              <span>
                {{ item.addresses.at(-1).address }}
              </span>
              <span>
                {{ item.addresses.at(-1).neighborhood.name }}
              </span>
              <span>
                {{ item.phone }}
              </span>
              <span style="color:#c9c9c9;">
                OBSERVACIONES
              </span>
            </div>
          </v-row>
          <v-row class="mt-3 justify-center" style="border: 1px solid grey;">
            Agenda de desconexiones por mora generada por {{ $store.state.auth.username.charAt(0).toUpperCase() + $store.state.auth.username.slice(1) }} el {{ getDateLog(new Date()) }} - Tabla autogenerada por la API
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </div>
</template>
<script>
export default {
  name: 'PrintDx',
  layout: 'print',
  data () {
    return {
      modal: false,
      technician: null,
      technicians: []
    }
  },
  computed: {
    clients () {
      return JSON.parse(this.$route.query.clientsInfo) || []
    },
    clienttype () {
      return this.$route.query.clienttype
    }
  },
  mounted () {
    this.$vuetify.theme.dark = false
  },
  methods: {
    async getTechnicians () {
      this.technicians = await this.$store.dispatch('operator/getOperatorList', {
        token: this.$store.state.auth.token
      })
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
  },
  head () {
    return {
      title: 'Agenda Desconexiones ' + this.clienttype
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
  grid-template-columns: 1fr 3fr 2fr 2fr 2fr 4fr;
  grid-gap: 0px;
}
.parent > span {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: .6rem;
  padding: 0 0;
  border: 1px solid grey;
}
</style>
