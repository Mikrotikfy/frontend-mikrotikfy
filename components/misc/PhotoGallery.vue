<template>
  <span>
    <v-tooltip top>
      <!-- eslint-disable -->
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
          <v-icon :class="block ? 'mr-1' : ''">mdi-camera-outline</v-icon>
          <span v-if="block">
            Ver Fotos del Caso
          </span>
          </v-btn>
        </template>
      <span>Ver Capturas del Ticket</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="800"
      :fullscreen="!$store.state.isDesktop"
    >
      <v-card>
        <v-card-title>
          <v-icon  class="mr-2">mdi-camera-outline</v-icon>
          Ver Capturas del Ticket
          <v-spacer />
          <v-btn icon @click="modal = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-card-text>
          <v-container>
            <h3
              v-if="ticket.media === null"
              class="text-center"
            >
              No hay imagenes aun...
            </h3>
            <v-row>
              <v-col
                v-for="img in ticket.media"
                :key="img.id"
              >
                <v-img 
                  :src="`${$config.CDN_STRAPI_ENDPOINT}${img.url}`"
                  :placeholder="`${$config.CDN_STRAPI_ENDPOINT}${img.formats.thumbnail.url}`"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'CreateBulkTickets',
  props: {
    ticket: {
      type: Object,
      required: true
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
      this.modal = true
    }
  }
}
</script>

<style>
</style>
