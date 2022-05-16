<template>
  <div>
    <v-btn
      color="primary"
      @click="initCamera()"
    >
      <v-icon>mdi-barcode-scan</v-icon>
      Escanear MAC
    </v-btn>
    <v-dialog v-model="dialogMacScanner" eager max-width="1100px" :retain-focus="false" :fullscreen="getResolution()">
      <v-card>
        <v-card-text>
          <v-btn @click="initCamera()">
            {{ initialized ? 'Detener' : tries >= 1 ? 'Reintentar' : 'Iniciar' }}
          </v-btn>
          <div id="camera_stream" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import Quagga from 'quagga'
export default {
  data () {
    return {
      dialogMacScanner: false,
      mac_result: '0',
      initialized: false,
      tries: 0
    }
  },
  methods: {
    initCamera () {
      this.dialogMacScanner = true
      this.initialized = true
      this.mac_result = '0'
      this.tries++
      Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: document.getElementById('camera_stream')
        },
        decoder: {
          readers: ['code_128_reader']
        },
        locate: true
      }, function (err) {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(err)
        }
        Quagga.start()
      })
      Quagga.onDetected((e) => {
        Quagga.stop()
        this.initialized = false
        this.mac_result = e.codeResult.code
        this.$emit('detectedmac', e.codeResult.code)
        this.dialogMacScanner = false
      })
    },
    getResolution () {
      const res = document.body.clientWidth
      if (res < 800) {
        const isMobile = true
        return isMobile
      } else {
        const isMobile = false
        return isMobile
      }
    }
  }
}
</script>

<style>
#camera_stream {
  width: 80%;
  height: auto;
}
</style>
