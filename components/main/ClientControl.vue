<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          x-small
          :color="$vuetify.theme.dark ? 'white black--text' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <span>
            Control de usuario
          </span>
        </v-btn>
      </template>
      <span>Control de usuario</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      fullscreen
    >
      <v-toolbar>
        <v-btn
          icon
          @click="modal = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card>
        <v-card-title class="justify-center">
          Centro de Control de Usuario
        </v-card-title>
        <v-divider />
        <div class="mt-2 d-flex" style="height:90vh;">
          <v-col cols="4" class="px-0" style="border-right:1px solid grey;">
            <MiscOfferHistory :client="client" />
          </v-col>
          <v-col cols="4" class="px-0">
            <div style="display:grid;place-items:center;">
              <h2 class="mb-5">{{ client.name }}</h2>
              <MainClientControlOffer :client="client" />
            </div>
          </v-col>
          <v-col cols="4" class="px-0" style="border-left:1px solid grey;">
            <MiscDebtHistory :client="client" />
          </v-col>
        </div>
      </v-card>
    </v-dialog>
  </span>
</template>
<script>
export default {
  name: 'ClientControl',
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      message: 'Hello Vue!'
    }
  },
  methods: {
    initComponent () {
      this.modal = true
    }
  }
}
</script>
