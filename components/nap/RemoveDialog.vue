<template>
  <v-dialog
    v-model="dialog"
    max-width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="red lighten-4 red--text rounded-xl mb-4"
        dark
        block
        v-bind="attrs"
        v-on="on"
      >
        Remover NAP Anterior
      </v-btn>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ title }}
      </v-card-title>
      <v-card-text>
        {{ message }}
      </v-card-text>
      <v-divider />
      <v-card-actions>
        <v-btn
          color="red darken-1 rounded-xl"
          @click="remove"
        >
          Aceptar y eliminar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'RemoveDialog',
  props: {
    isticket: {
      type: Boolean,
      default: false
    },
    ticketindex: {
      type: Number,
      default: 0
    },
    title: {
      type: String,
      default: 'Eliminar'
    },
    message: {
      type: String,
      default: '¿Está seguro que desea remover el cliente de esta NAP? Esta acción se realiza luego de desconectar el traslado en la direccion antigua para liberar el puerto en la NAP'
    },
    client: {
      type: Object,
      default: () => {}
    }
  },
  data: () => ({
    dialog: false
  }),
  methods: {
    async remove () {
      await this.$store.dispatch('nap/removeNap', {
        token: this.$store.state.auth.token,
        client: this.client
      })
      if (this.isticket) {
        this.$store.commit('ticket/removeNap', {
          ticketindex: this.ticketindex
        })
      }
      this.dialog = false
    }
  }
}
</script>
