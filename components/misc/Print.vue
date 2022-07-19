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
    <v-toolbar>
      <v-btn
        icon
        dark
        @click="modal = false"
      >
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-toolbar>
      <v-card>
        <v-card-text>
          <v-container>
            <v-row style="border: 1px solid red;">
              <v-col style="border: 1px solid red;" class="align-center justify-center">
                <MainLogo />
              </v-col>
              <v-col style="border: 1px solid red;" class="d-flex align-center justify-center">
                <h1>Agenda Tecnica Internet</h1>
              </v-col>
              <v-col style="border: 1px solid red;" class="d-flex align-center justify-center">
                <h2>Fecha: tal</h2>
                <h2>Tecnico: tal</h2>
              </v-col>
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
      modal: false
    }
  },
  methods: {
    initComponent () {
      if (this.clients.length > 0) {
        this.modal = true
      } else {
        this.$toast.error('Selecciona los clientes antes de imprimir', { position: 'top-center' })
      }
    }
  }
}
</script>
