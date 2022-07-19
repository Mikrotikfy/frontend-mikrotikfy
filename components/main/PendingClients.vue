<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-card
          fluid
          class="rounded-xl"
        >
          <v-card-text class="py-4">
            <v-row>
              <v-tooltip top>
                <!-- eslint-disable -->
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    class="my-4 mx-4"
                    color="white black--text"
                    dark
                    rounded
                    :disabled="loading"
                    :loading="loading"
                    v-on="on"
                  >
                    <v-icon>mdi-reload</v-icon>
                    </v-btn>
                  </template>
                <span>Refrescar Lista</span>
              </v-tooltip>
              <h3 class="align-self-center">
                {{ clients.length }}
                {{ clients.length === 1 ? 'Cliente pendiente' : 'Clientes pendientes' }}
              </h3>
              <v-spacer />
              <MiscPrint :clients="selected" />
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col
        cols="12"
      >
        <v-card
          fluid
          class="rounded-xl"
        >
          <client-only>
            <v-data-table
              v-model="selected"
              :headers="headers"
              :items="clients"
              :items-per-page="itemsPerPage"
              :page.sync="page"
              :loading="loading"
              sort-by="createdAt"
              calculate-widths
              sort-desc
              show-select
              no-data-text="No hay clientes pendientes por instalacion aún..."
              loading-text="Cargando información de clientes..."
              hide-default-footer
              mobile-breakpoint="100"
              @page-count="pageCount = $event"
            />
          </client-only>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount" />
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data () {
    return {
      clients: [],
      selected: [],
      loading: true,
      error: null,
      itemsPerPage: 5,
      page: 1,
      pageCount: 1,
      headers: [
        { text: 'Codigo', value: 'code', sortable: false },
        { text: 'Nombre', value: 'name', sortable: false },
        { text: 'Cedula', value: 'dni', sortable: false },
        { text: 'Direccion', sortable: false, value: 'address' },
        { text: 'Barrio', value: 'neighborhood.name', sortable: false },
        { text: 'Telefono', sortable: false, value: 'phone' },
        { text: 'Plan', value: 'plan.name', sortable: false },
        { text: 'Tecnologia', value: 'technology.name', sortable: false },
        { text: '', value: 'actions', sortable: false }
      ]
    }
  },
  mounted () {
    this.getPendingClients()
  },
  methods: {
    async getPendingClients () {
      this.loading = true
      this.clients = await this.$store.dispatch('client/getPendingClients', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype
      })
        .catch((error) => {
          this.error = error
          this.loading = false
        })
      this.loading = false
    }
  }
}
</script>
