<template>
  <div>
    <h1>Camera MAC - Lector de codigo de barras</h1>
    <v-btn @click="initCamera()">
      {{ initialized ? 'Stop' : tries >= 1 ? 'Retry' : 'Start' }}
    </v-btn>
    <div>
      {{ mac_result }}
    </div>
    <div id="camera_stream" />
  </div>
</template>
<script>
import Quagga from 'quagga'
export default {
  data () {
    return {
      mac_result: '0',
      initialized: false,
      tries: 0
    }
  },
  methods: {
    initCamera () {
      this.initialized = true
      this.mac_result = '0'
      this.tries++
      Quagga.init({
        inputStream: {
          type: 'LiveStream',
          target: document.querySelector('#camera_stream'),
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            aspectRatio: { min: 1, max: 100 },
            facingMode: 'environment' // or user
          }
        },
        locator: {
          patchSize: 'medium',
          halfSample: false
        },
        numOfWorkers: 4,
        frequency: 10,
        decoder: {
          readers: [{
            format: 'code_128_reader',
            config: {}
          }]
        },
        locate: true
      }, function (err) {
        if (err) {
          // eslint-disable-next-line no-console
          console.log(err)
        }
        Quagga.start()
      })
      Quagga.onProcessed(function (result) {
        const drawingCtx = Quagga.canvas.ctx.overlay
        const drawingCanvas = Quagga.canvas.dom.overlay

        if (result) {
          if (result.boxes) {
            drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')))
            result.boxes.filter(function (box) {
              return box !== result.box
            }).forEach(function (box) {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, { color: 'green', lineWidth: 2 })
            })
          }

          if (result.box) {
            Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, { color: '#00F', lineWidth: 2 })
          }

          if (result.codeResult && result.codeResult.code) {
            Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, { color: 'red', lineWidth: 3 })
          }
        }
      })
    }
  }
}
</script>

<style>
#camera_stream {
  position:relative;
}
canvas.drawing,
canvas.drawingBuffer {
    position: absolute;
    left: 0;
    top: 0;
}
#interactive.viewport > canvas, #interactive.viewport > video {
    max-width: 100%;
    width: 100%;
}
</style>
