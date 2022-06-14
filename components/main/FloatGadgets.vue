<template>
  <div
    style="position:absolute;display:flex;align-items:center;bottom:0;right:10px;float:right;z-index:9999;"
    class="pb-5 pr-3"
  >
    <v-alert
      v-if="showByDate()"
      dense
      text
      type="info"
    >
      {{ textByDate }}
    </v-alert>
    <v-btn
      color="pink"
      dark
      fab
      class="mb-5 mx-3"
      @click="initComponent"
    >
      <v-icon>mdi-calendar</v-icon>
    </v-btn>
    <v-dialog
      v-model="dialog"
      width="1024"
    >
      <v-card>
        <v-card-text class="pa-0">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=q9ibkrtpegqlet5edncku58co8%40group.calendar.google.com&ctz=America%2FBogota"
            style="border: 0"
            width="1014"
            height="600"
            frameborder="0"
            scrolling="no"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  data () {
    return {
      dialog: false,
      textByDate: ''
    }
  },
  methods: {
    initComponent () {
      this.dialog = true
    },
    showByDate () {
      const dayOfMonth = new Date().getDate()
      switch (dayOfMonth) {
        case 13:
          this.textByDate = 'LLAMADAS / SMS / ESTADO FECHA LIMITE DE PAGO'
          return true
        case 14:
          this.textByDate = 'LLAMADAS / SMS / ESTADO FECHA LIMITE DE PAGO'
          return true
        case 15:
          this.textByDate = 'LLAMADAS / SMS / ESTADO FECHA LIMITE DE PAGO'
          return true
        case 16:
          this.textByDate = 'LLAMADAS / SMS / ESTADO FECHA LIMITE DE PAGO'
          return true
        case 17:
          this.textByDate = 'FECHA DE CORTE POR MORA'
          return true
      }
    }
  }
}
</script>
