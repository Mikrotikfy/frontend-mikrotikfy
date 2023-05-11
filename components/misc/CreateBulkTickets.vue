<template>
  <span>
    <v-tooltip top>
      <!-- eslint-disable -->
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          v-bind="attrs"
          class="my-2 mr-1"
          color="white black--text"
          dark
          small
          rounded
          v-on="on"
          @click="initComponent()"
        >
          <v-icon>mdi-plus-box-multiple-outline</v-icon>
          </v-btn>
        </template>
      <span>Crear Tickets Masivamente</span>
    </v-tooltip>
    <v-dialog
      v-model="modal"
      max-width="800"
      :fullscreen="!$store.state.isDesktop"
    >
      <v-card>
        <v-card-title>
          <v-icon  class="mr-2">mdi-plus-box-multiple-outline</v-icon>
          Crear Tickets Masivamente
        </v-card-title>
        <v-card-text>
          <v-autocomplete
            v-model="tickettype"
            :items="tickettypes"
            label="Tipo de Ticket"
            outlined
            item-text="name"
            item-value="id"
            return-object
          />
          <v-textarea
            v-model="codesInput"
            label="Codigos a Crear, 1 por linea"
            placeholder="15000
15001
15002"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="primary"
            block
            class="rounded-xl"
            :disabled="loading"
            :loading="loading"
            @click="createBulkTickets"
          >
            Crear
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </span>
</template>

<script>
export default {
  name: 'CreateBulkTickets',
  data: () => ({
    modal: false,
    tickettype: null,
    tickettypes: [],
    codesInput: '',
    codesProcessed: [],
    loading: false
  }),
  methods: {
    initComponent () {
      this.modal = true
      this.getTickettypes()
    },
    getTickettypes () {
      this.tickettypes = this.$store.state.ticket.tickettypes
    },
    async createBulkTickets () {
      this.loading = true
      if (this.tickettype === null) {
        this.$toast.error('Debes seleccionar un tipo de ticket primero.', {
          duration: 2000
        })
        return
      }
      if (this.codesInput === '') {
        this.$toast.error('Debes ingresar los codigos a procesar.', {
          duration: 2000
        })
        return
      }
      this.codesProcessed = this.codesInput.split('\n')
      for (let i = 0; i < this.codesProcessed.length; i++) {
        const qs = require('qs')
        const query = qs.stringify({
          filters: {
            code: this.codesProcessed[i],
            city: {
              name: this.$route.query.city
            }
          }
        },
        {
          encodeValuesOnly: true
        })
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: clients }) => {
            if (clients.length === 0 || clients.length > 1) {
              this.$toast.error(`El codigo ${this.codesProcessed[i]} no existe en la base de datos o fueron encontrados mas de 1 lo que genera un conflicto`)
              return
            }
            const idForCode = clients[0].id
            fetch(`${this.$config.API_STRAPI_ENDPOINT}tickets`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.$store.state.auth.token}`
              },
              body: JSON.stringify({
                data: {
                  active: true,
                  client: idForCode,
                  channel: 'office',
                  city: this.$store.state.auth.cities.filter(city => city.name === this.$route.query.city)[0].id,
                  tickettype: this.tickettype.id,
                  clienttype: this.$route.query.clienttype === 'INTERNET' ? 1 : 2,
                  assignated: this.$store.state.auth.id,
                  details: 'TICKET CREADO DE FORMA MASIVA DESDE LA OFICINA'
                }
              })
            }).then((input) => {
              if (input.status === 200) {
                this.$toast.info('Ticket creado correctamente', {
                  duration: 2000
                })
              } else {
                this.$toast.error('Ticket no pudo ser creado', {
                  duration: 2000
                })
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
      this.codesInput = ''
      this.codesProcessed = []
      this.loading = false
      this.modal = false
      this.$emit('endProcess')
    }
  }
}
</script>

<style>
</style>
