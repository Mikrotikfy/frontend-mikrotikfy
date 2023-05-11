<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          block
          :color="$vuetify.theme.dark && !block ? 'white black--text' : 'white black--text'"
          class="rounded-xl mt-4"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-camera</v-icon>
          <span>
            Fotografia
          </span>
        </v-btn>
      </template>
      <span>Captura</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="1200"
      :fullscreen="!$store.state.isDesktop"
    >
      <v-card
        v-resize="onResize"
        :loading="loading"
      >
        <v-toolbar dense class="elevation-0 transparent">
          <v-spacer />
          <v-btn icon @click="modal = false, $refs.webcam.stop()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>
        <div v-if="!loading">
          <v-card-text v-if="!imageData" class="pt-0">
            <client-only>
              <div>
                <vue-web-cam
                  ref="webcam"
                  :width="windowSize.width - 50"
                  :height="windowSize.height - 250"
                  :autoplay="true"
                  :resolution="{
                    width: 1920,
                    height: 1080
                  }"
                  @error="errorShow"
                  @notsupported="errorShow"
                  @cameras="showCameras"
                />
              </div>
              <div style="display:grid;place-items:center;">
                <v-btn
                  color="white"
                  fab
                  large
                  @click="takePicture"
                />
                <v-select
                  v-model="selectedCamera"
                  :items="cameras"
                  item-text="label"
                  item-value="id"
                  outlined
                  label="Selecciona una camara"
                  class="mt-4"
                  @change="changeCamera($event)"
                />
              </div>
            </client-only>
          </v-card-text>
          <v-card-text v-else>
            <v-img :src="imageData" />
          </v-card-text>
        </div>
        <v-card-actions class="d-block">
          <v-btn
            v-if="imageData"
            color="primary"
            class="rounded-xl"
            block
            @click="savePhoto"
          >
            Guardar Foto
          </v-btn>
          <v-btn
            v-if="imageData"
            class="rounded-xl mt-4   ml-0"
            block
            @click="imageData = null"
          >
            Tomar de nuevo
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'PhotoDialog',
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
    },
    ticket: {
      type: Object,
      default: () => ({})
    },
    ticketindex: {
      type: Number,
      default: -1
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    imageData: null,
    imageMimeType: null,
    deviceId: null,
    selectedCamera: null,
    cameras: [],
    windowSize: {
      width: 0,
      height: 0
    }
  }),
  watch: {
    modal (val) {
      if (!val) {
        this.$refs.webcam.stop()
      }
    }
  },
  methods: {
    initComponent () {
      this.modal = true
      if (this.cameras.length > 0) {
        console.log(this.cameras)
        this.$refs.webcam.changeCamera(this.cameras[0].deviceId)
      }
    },
    errorShow (err) {
      this.$toast.error('Error al cargar la cámara: ' + err, { duration: 5000 })
    },
    showCameras (cameras) {
      this.cameras = cameras
      this.selectedCamera = cameras[0]
      this.$refs.webcam.changeCamera(this.selectedCamera.deviceId)
    },
    changeCamera (e) {
      const newCam = this.cameras.find(cam => cam.label === e)
      this.$refs.webcam.changeCamera(newCam.deviceId)
    },
    takePicture () {
      const camera = this.$refs.webcam
      const imgData = camera.capture()
      this.imageData = imgData
      this.imageMimeType = 'image/png'
    },
    onResize () {
      this.windowSize = { width: window.innerWidth, height: window.innerHeight }
    },
    savePhoto () {
      this.modal = false
      this.$toast.info('Foto puesta en cola para subir...', { duration: 4000 })
      fetch(this.imageData)
        .then(res => res.blob())
        .then((blob) => {
          this.uploadImageToStrapi(blob, `photo_ticket_${this.ticket.id}`, 'image/png')
        })
    },
    async uploadImageToStrapi (imageBlob, imageName, imageType) {
      const formData = new FormData()
      formData.append('files', imageBlob, `${imageName}_${imageType}`)
      formData.append('ref', 'api::ticket.ticket')
      formData.append('refId', '5626')
      formData.append('field', 'media')
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: formData
      }).then((input) => {
        if (input.status === 200) {
          this.imageData = null
          this.$toast.info('Foto guardada con exito.', { duration: 4000 })
        } else {
          throw new Error('Upload failed')
        }
      }).catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error)
      })
    }
  }
}
</script>

<style>
</style>
