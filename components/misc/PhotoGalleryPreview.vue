<template>
  <span>
    <v-container @click="modal = true">
      <v-row class="overflow-hidden">
        <v-col
          v-for="img in filteredMedia"
          :key="img.id"
          class="d-flex align-center"
        >
          <v-img
            :src="`${$config.CDN_STRAPI_ENDPOINT}${img.url}`"
            :placeholder="`${$config.CDN_STRAPI_ENDPOINT}${img.formats.thumbnail.url}`"
            width="25"
          />
        </v-col>
      </v-row>
    </v-container>
    <v-dialog
      v-model="modal"
      max-width="800"
      :fullscreen="!$store.state.isDesktop"
    >
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-camera-outline</v-icon>
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
  name: 'PhotoGalleryPreview',
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
  computed: {
    filteredMedia () {
      return this.$store.state.isDesktop ? this.ticket.media.slice(0, 5) : this.ticket.media.slice(0, 1)
    }
  }
}
</script>

<style>
</style>
