<template>
  <span>
    <v-tooltip top>
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          :block="block"
          :text="!block"
          :x-small="!block"
          :color="$vuetify.theme.dark && !block ? 'white' : 'primary'"
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-account-details-outline</v-icon>
          <span v-if="block">
            Postventa
          </span>
        </v-btn>
      </template>
      <span>Postventa</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="990"
    >
      <v-card
        :loading="loading"
      >
        <v-card-title class="headline">
          Información Postventa
        </v-card-title>
        <v-card-text>
          ¡Te damos la bienvenida a ARNOProducciones!<br>
          Ahora cuentas con un servicio de {{ client.plan.name }} para que puedas navegar de forma ilimitada.
          <br><br>
          Recuerda que puedes comunicarte al 310 343 25 99 por llamada o Whatsapp donde podrás agendar servicio técnico, despejar dudas o realizar peticiones los 7 días de la semana en horario de oficina. Si, ¡Incluso los domingos o festivos!.
          <br><br>
          Para cambiar tu contraseña WiFi puedes usar el siguiente enlace https://api.arnoproducciones.com/cambio
          <br><br>
          Recuerda seguir las instrucciones en caso de tormenta eléctrica y no manipular el equipo o sus conexiones para evitar interrupciones del servicio.
          <br><br>
          Porque ya somos parte de tu hogar
        </v-card-text>
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
export default {
  name: 'Devices',
  props: {
    client: {
      type: Number,
      default: -1
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
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getColor (state) {
      if (state) {
        return 'blue darken-4'
      } else {
        return 'red'
      }
    },
    getState (state) {
      if (state) {
        return 'Abierto'
      } else {
        return 'Cerrado'
      }
    }
  }
}
</script>

<style>

</style>
