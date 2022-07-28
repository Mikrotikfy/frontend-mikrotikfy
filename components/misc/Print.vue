<template>
  <div>
    <v-tooltip top>
      <!-- eslint-disable -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="my-4 mx-4"
          color="white black--text"
          dark
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
      <v-spacer />
      <v-autocomplete
        v-model="technician"
        :items="technicians"
        item-text="username"
        item-value="id"
        return-object
        multiple
        label="Tecnico"
        dense
        class="mr-4 mt-4"
        outlined
      />
    </v-toolbar>
      <v-card class="printme">
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="2" style="border: 1px solid grey;" class="align-center justify-center printme">
                <MainLogoDark />
              </v-col>
              <v-col cols="5" style="border: 1px solid grey;background-color:#bfffff;" class="d-flex align-center justify-center">
                <h2 class="printme">Servicio Técnico Internet</h2>
              </v-col>
              <v-col cols="5" style="border: 1px solid grey;" class="d-flex align-center justify-center">
                <v-row>
                  <v-col cols="5" class="text-center" style="border-right: 1px solid grey;">
                    <h3>{{ getDate(new Date()) }}</h3>
                  </v-col>
                  <v-col cols="7" class="justify-center align-center d-flex">
                    <h3> {{ technician.length > 0 ? technician.length > 1 ? 'Tecnicos:' : 'Tecnico:' : 'Tecnico/s _________________________'}} </h3>
                    <h3
                      v-for="(tech, index) in technician"
                      :key="tech.id"
                      class="ml-2"
                    >
                      {{ technician.length > 1 ? index > 0 ? '/' : '' : '' }} {{ tech.username.charAt(0).toUpperCase() + tech.username.slice(1) }}
                    </h3>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <div
                v-for="client in $store.state.daily.selectedcx"
                :key="client.id"
                class="parent"
              >
                <span class="item">CX</span>
                <span :style="`color:${client.technology ? 'grey' : '#c9c9c9'}`">{{ client.technology ? client.technology.name : 'Tecnol.' }}</span>
                <span  style="color:#c9c9c9;">CANT. FIBRA</span>
                <span>{{ client.code }}</span>
                <span>{{ client.plan.name }}</span>
                <span  style="color:#c9c9c9;">P NAP</span>
                <span  style="color:#c9c9c9;"># CUP.</span>
                <span>{{ client.name }}</span>
                <span style="display:grid;">
                  {{ client.addresses.length > 0 ? client.addresses.at(-1).address : client.address }}
                  {{ client.addresses.length > 0 ? client.addresses.at(-1).neighborhood.name : client.neighborhood.name }}
                </span>
                <span style="color:#c9c9c9;">OBSERVACIONES</span>
                <span style="color:#c9c9c9;">FIRMA CLIENTE</span>
              </div>
              <div
                v-for="client in $store.state.daily.selectedtr"
                :key="client.id"
                class="parent"
              >
                <span class="item">TR</span>
                <span :style="`color:${client.technology ? 'grey' : '#c9c9c9'}`">{{ client.technology ? client.technology.name : 'Tecnol.' }}</span>
                <span  style="color:#c9c9c9;">CANT. FIBRA</span>
                <span>{{ client.code }}</span>
                <span>{{ client.plan.name }}</span>
                <span  style="color:#c9c9c9;">P NAP</span>
                <span  style="color:#c9c9c9;"># CUP.</span>
                <span>{{ client.name }}</span>
                <span style="display:grid;">
                  <v-row>
                    DX:
                    {{ client.addresses.length > 1 ? client.addresses.at(-1).address : 'No aplica en base de datos' }}
                    {{ client.addresses.length > 1 ? client.addresses.at(-1).neighborhood.name : '' }}
                  </v-row>
                  <v-row>
                    CX:
                    {{ client.addresses.length > 0 ? client.addresses.at(-1).address : client.address }}
                    {{ client.addresses.length > 0 ? client.addresses.at(-1).neighborhood.name : client.neighborhood.name }}
                  </v-row>
                </span>
                <span style="color:#c9c9c9;">OBSERVACIONES</span>
                <span style="color:#c9c9c9;">FIRMA CLIENTE</span>
              </div>
            </v-row>
            <v-row class="mt-3 justify-center" style="border: 1px solid grey;">Agenda generada por {{$store.state.auth.username.charAt(0).toUpperCase() + $store.state.auth.username.slice(1)}} el {{ getDate(new Date()) }} - Tabla autogenerada por la API</v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      modal: false,
      technician: [],
      technicians: []
    }
  },
  methods: {
    async initComponent () {
      await this.getTechnicians()
      if (this.$store.state.daily.selectedcx.length > 0 || this.$store.state.daily.selectedtr.length > 0) {
        this.$vuetify.theme.dark = false
        this.modal = true
      } else {
        this.$toast.error('Selecciona los clientes antes de imprimir', { position: 'top-center' })
      }
    },
    async getTechnicians () {
      this.technicians = await this.$store.dispatch('operator/getOperatorList', {
        token: this.$store.state.auth.token
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
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
  grid-template-columns: 1fr 1fr 1fr 1fr 2fr 1fr 1fr 4fr 4fr 4fr 4fr;
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
