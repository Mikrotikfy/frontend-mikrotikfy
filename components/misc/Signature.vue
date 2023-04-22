<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'white black--text'"
          class="rounded-xl"
          :large="block"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-pencil-box-outline</v-icon>
          <span v-if="block">
            Firma de usuario
          </span>
        </v-btn>
      </template>
      <span>Firma de usuario</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="1200"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title class="headline">
          Firma de usuario
        </v-card-title>
        <div v-if="!loading">
          <v-card-text>
            <client-only>
              <canvas />
            </client-only>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-spacer />
          <v-btn
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
import SignaturePad from 'signature_pad'
export default {
  name: 'SignatureDialog',
  props: {
    clientid: {
      type: Number,
      default: -1
    },
    name: {
      type: String,
      default: ''
    },
    block: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    modal: false
  }),
  methods: {
    initComponent () {
      const canvasEl = document.querySelector('canvas')

      const signaturePad = new SignaturePad(canvasEl)

      // Returns signature image as data URL (see https://mdn.io/todataurl for the list of possible parameters)
      signaturePad.toDataURL() // save image as PNG
    }
  }
}
</script>

<style>
</style>
