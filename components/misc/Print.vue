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
      <v-select
        v-model="technician"
        :items="technicians"
        item-text="username"
        item-value="id"
        return-object
        label="Tecnico"
        dense
        class="mr-4 mt-4"
        outlined
      />
    </v-toolbar>
      <v-card class="printme">
        <v-card-text>
          <v-container fluid>
            <v-row>
              <v-col style="border: 1px solid grey;" class="align-center justify-center">
                <MainLogoDark />
              </v-col>
              <v-col style="border: 1px solid grey;" class="d-flex align-center justify-center">
                <h2 class="printme">Agenda Tecnica Internet</h2>
              </v-col>
              <v-col style="border: 1px solid grey;" class="d-flex align-center justify-center">
                <v-row>
                  <v-col class="text-center">
                    <h2>Fecha: {{ getDate(new Date()) }}</h2>
                  </v-col>
                  <v-col class="justify-center align-center d-flex">
                    <h2>Tecnico: {{ technician ? technician.username : ''  }}</h2>
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <div
                v-for="client in clients"
                :key="client.id"
                class="parent"
              >
                <span class="item">CX</span>
                <span>{{ client.technology ? client.technology.name : '' }}</span>
                <span  style="color:#c9c9c9;">CANT. FIBRA</span>
                <span>{{ client.code }}</span>
                <span>{{ client.plan.name }}</span>
                <span  style="color:#c9c9c9;">P NAP</span>
                <span  style="color:#c9c9c9;"># CUP.</span>
                <span>{{ client.name }}</span>
                <span>{{ client.addresses.length > 0 ? client.addresses[client.addresses.length - 1].address : client.address }}</span>
                <span style="color:#c9c9c9;">OBSERVACIONES</span>
                <span style="color:#c9c9c9;">FIRMA CLIENTE</span>
              </div>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    clients: {
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
      if (this.clients.length > 0) {
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
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
<style>
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
  grid-template-columns: 1fr 1fr 1fr 2fr 2fr 1fr 1fr 3fr 3fr 3fr 3fr;
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
