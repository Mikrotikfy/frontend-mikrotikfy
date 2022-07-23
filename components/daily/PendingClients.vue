<template>
  <v-container fluid class="no-printme">
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
                    @click="getPendingClients()"
                  >
                    <v-icon>mdi-reload</v-icon>
                    </v-btn>
                  </template>
                <span>Refrescar Lista</span>
              </v-tooltip>
              <h2 class="align-self-center">
                {{ clients.length }}
                {{ clients.length === 1 ? 'Conexiones pendiente' : 'Conexiones pendientes' }}
              </h2>
              <v-spacer />
              <MiscPrint :type="'cx'" class="printme" />
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
              dense
              show-select
              no-data-text="No hay clientes pendientes por instalacion aún..."
              loading-text="Cargando información de clientes..."
              hide-default-footer
              mobile-breakpoint="100"
              @page-count="pageCount = $event"
            >
              <template v-slot:[`item.address`]="{ item }">
                  {{ item.addresses.length > 0 ? item.addresses[item.addresses.length -1].address : item.address }}
              </template>
              <template v-slot:[`item.neighborhood.name`]="{ item }">
                  {{ item.addresses.length > 0 ? item.addresses[item.addresses.length -1].neighborhood.name : item.neighborhood.name }}
              </template>
            <template v-slot:[`item.createdAt`]="{ item }">
                <span>
                  {{ getDate(item.createdAt) }}
                </span>
              </template>
            </v-data-table>
          </client-only>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <div class="text-center pt-1">
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
      pageCount: 1
    }
  },
  computed: {
    headers () {
      return this.$store.state.daily.headers
    }
  },
  watch: {
    $route () {
      this.getPendingClients()
      this.getHeadersByClientType()
    },
    selected () {
      this.$store.commit('daily/setSelectedCx', this.selected)
    }
  },
  mounted () {
    this.getPendingClients()
    this.getHeadersByClientType()
  },
  methods: {
    async getPendingClients () {
      this.loading = true
      this.clients = await this.$store.dispatch('daily/getPendingClients', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype
      })
        .catch((error) => {
          this.error = error
          this.loading = false
        })
      this.loading = false
    },
    getHeadersByClientType () {
      this.$store.dispatch('daily/getHeadersByClientType', {
        clienttype: this.$route.query.clienttype
      })
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
      return humanDateFormat
    }
  }
}
</script>
<style>
@media print {
  .no-printme {
    display: none !important;
  }
  .printme {
    display: block;
  }
}
</style>
