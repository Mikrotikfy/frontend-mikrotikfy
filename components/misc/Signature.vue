<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          block
          :disabled="(ticket.signed || signed)"
          :color="$vuetify.theme.dark && !block ? 'white black--text' : 'white black--text'"
          class="rounded-xl mt-4"
          large
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-pencil-box-outline</v-icon>
          <span>
            {{ ticket.signed || signed ? 'Ya firmado' : 'Firma de usuario' }}
          </span>
        </v-btn>
      </template>
      <span>Firma de usuario</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="1200"
      :fullscreen="!$store.state.isDesktop"
    >
      <v-card
        :loading="loading"
      >
        <div v-if="!loading">
          <v-card-text>
            <client-only>
              <canvas
                ref="canvasEl"
                :width="clientWidth - 30"
                :height="clientHeight - 100"
                style="background-color: #fff;aspect-ratio:9/16"
              />
            </client-only>
          </v-card-text>
        </div>
        <v-card-actions>
          <v-btn
            color="primary"
            class="rounded-xl"
            block
            @click="saveSignature"
          >
            Guardar Firma
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
    },
    ticket: {
      type: Object,
      default: () => ({})
    }
  },
  data: () => ({
    modal: false,
    loading: false,
    signature: '',
    signed: false
  }),
  computed: {
    clientWidth () {
      return this.$store.state.clientWidth
    },
    clientHeight () {
      return this.$store.state.clientHeight
    }
  },
  methods: {
    initComponent () {
      this.modal = true

      setTimeout(() => {
        const signaturePad = new SignaturePad(this.$refs.canvasEl, {
          minWidth: 1,
          maxWidth: 1,
          penColor: 'rgb(0,0,0)'
        })
        signaturePad.addEventListener('endStroke', () => {
          this.signature = signaturePad.toDataURL()
        }, { once: false })
      }, 500)
    },
    async saveSignature () {
      await fetch(this.signature)
        .then(res => res.blob())
        .then((blob) => {
          this.uploadImageToStrapi(blob, this.ticket.id, 'image/png')
        })
    },
    async updateClientAndTicket (uploadedImage) {
      await this.$store.dispatch('signature/updateSignatureOnClient', {
        token: this.$store.state.auth.token,
        ticket: this.ticket,
        signature: uploadedImage.url
      })
      await this.$store.dispatch('signature/updateSignatureOnTicket', {
        token: this.$store.state.auth.token,
        ticket: this.ticket,
        signature: uploadedImage.url
      })
      this.signed = true
      this.modal = false
    },
    async uploadImageToStrapi (imageBlob, imageName, imageType) {
      const formData = new FormData()
      formData.append('files', imageBlob, `${imageName}_${imageType}`)
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: formData
      }).then((input) => {
        if (input.status === 200) {
          Promise.resolve(input.json())
            .then((strapiRes) => {
              this.updateClientAndTicket(strapiRes[0])
            })
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
