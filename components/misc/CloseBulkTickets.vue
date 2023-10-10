<template>
  <span>
    <v-tooltip top>
      <!-- eslint-disable -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          icon
          dark
          rounded
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-minus-box-multiple-outline</v-icon>
          </v-btn>
        </template>
      <span>Cerrar Tickets Masivamente</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="800"
      :fullscreen="!$store.state.isDesktop"
    >
      <v-card>
        <v-card-title>
          <v-icon class="mr-2">mdi-minus-box-multiple-outline</v-icon>
          Cerrar Tickets Masivamente
        </v-card-title>
        <v-card-text>
          <v-chip large color="primary">
            <v-icon>mdi-information-outline</v-icon>
            <span class="ml-2 font-weight-bold">Tickets para cerrar: {{selected.length}}</span>
          </v-chip>
          <v-text-field
            v-model="reasonInput"
            label="Razon de Cierre"
            placeholder="Se soluciona caso masivo..."
            class="mt-4"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="red darken-4"
            block
            class="rounded-xl"
            :disabled="loading"
            :loading="loading"
            @click="closeBulkTickets"
          >
            Cerrar {{selected.length}} Tickets
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'CreateBulkTickets',
  props: {
    selected: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    modal: false,
    reasonInput: '',
    codesProcessed: [],
    loading: false
  }),
  methods: {
    initComponent () {
      if (this.selected.length < 1) {
        this.$toast.error('Debes seleccionar al menos 1 ticket para cerrar.', {
          duration: 2000
        })
        return
      }
      this.modal = true
    },
    async closeBulkTickets () {
      this.loading = true
      if (this.reasonInput === '') {
        this.$toast.error('Debes ingresar la razon de cierre', {
          duration: 2000
        })
        return
      }
      for (let i = 0; i < this.selected.length; i++) {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets/${this.selected[i].id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          },
          body: JSON.stringify({
            data: {
              active: false,
              answered: true
            }
          })
        })
          .then(res => res.json())
          .then(({ data: ticket }) => {
            fetch(`${this.$config.API_STRAPI_ENDPOINT}ticketdetails`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.$store.state.auth.token}`
              },
              body: JSON.stringify({
                data: {
                  ticket: ticket.id,
                  details: this.reasonInput,
                  operator: this.$store.state.auth.id
                }
              })
            }).then((input) => {
              if (input.status === 200) {
                this.$toast.info('Avance de ticket creado correctamente', {
                  duration: 2000
                })
              } else {
                this.$toast.error('El avance de Ticket no pudo ser creado', {
                  duration: 2000
                })
                this.loading = false
              }
            }).catch((error) => {
              // eslint-disable-next-line no-console
              console.error(error)
              this.loading = false
            })
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error(error)
            this.loading = false
          })
      }
      this.reasonInput = ''
      this.loading = false
      this.modal = false
      this.$emit('endProcess')
    }
  }
}
</script>

<style>
</style>
