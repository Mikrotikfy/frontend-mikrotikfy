<template>
  <div>
    <v-row>
      <v-col
        cols="12"
      >
        <v-card>
          <v-card-text>
            <v-row>
              <v-tooltip top>
                <!-- eslint-disable -->
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    v-bind="attrs"
                    color="white black--text"
                    class="mt-4 mx-4"
                    dark
                    rounded
                    :disabled="refreshLoading"
                    :loading="refreshLoading"
                    v-on="on"
                    @click="getActivationRequestsFromDatabase()"
                  >
                    <v-icon>mdi-reload</v-icon>
                  </v-btn>
                </template>
                <span>Refrescar Peticiones de Activacion</span>
              </v-tooltip>
            </v-row>
          </v-card-text>
          <client-only>
            <v-data-table
              :key="key"
              :headers="headers"
              :items="activationRequestsList"
              :search="search"
              :items-per-page="itemsPerPage"
              :page.sync="page"
              :loading="initialLoading"
              sort-by="createdAt"
              calculate-widths
              sort-desc
              no-data-text="No hay peticiones de activacion abiertas aún..."
              loading-text="Cargando peticiones de activación..."
              dense
              hide-default-footer
              mobile-breakpoint="100"
              @page-count="pageCount = $event"
            >
              <template v-slot:[`item.actions`]="props">
                <v-tooltip left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn
                      :color="props.item.active ? 'green darken-3' : 'red darken-3'"
                      :disabled="props.item.active"
                      dark
                      small
                      :loading="props.item.loading"
                      v-bind="attrs"
                      text
                      v-on="on"
                      @click="updateStatus(activationRequestsList.map(function(x) {return x.id; }).indexOf(props.item.id))"
                    >
                      <v-icon>mdi-{{ props.item.active ? 'check' : 'close' }} {{ props.index }}</v-icon>
                    </v-btn>
                  </template>
                <span>Activar Cliente</span>
                </v-tooltip>
              </template>
              <template v-slot:[`item.code`]="props">
                <nuxt-link :to="`/clients/${props.item.code}?city=${$route.query.city}&clienttype=${$route.query.clienttype}`">{{props.item.code}}</nuxt-link>
              </template>
              <template v-slot:[`item.active`]="props">
                <v-chip small :color="getColor(props.item.active)" class="white--text">
                  {{ getState(props.item.active) }}
                </v-chip>
              </template>
              <template v-slot:[`item.createdAt`]="{ item }">
                <span>
                  {{ getDate(item.createdAt) }}
                </span>
              </template>
            </v-data-table>
          </client-only>
          <div class="text-center pt-2">
            <v-pagination v-model="page" :length="pageCount" />
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'ActivationRequestsList',
  data () {
    return {
      key: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 5,
      search: '',
      cityName: '',
      cityColor: '',
      alertBox: false,
      dialog: false,
      dialogEdit: false,
      initialLoading: false,
      loading: false,
      showClosedValue: false,
      refreshLoading: false,
      headers: [
        { text: 'Estado', sortable: false, value: 'active' },
        { text: 'Codigo', sortable: false, value: 'code' },
        { text: 'Cliente', sortable: false, value: 'name' },
        { text: 'Dirección', sortable: false, value: 'address' },
        { text: 'Barrio', sortable: false, value: 'neighborhood.name' },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ],
      States: [{ name: 'Abierto', value: true }, { name: 'Cerrado', value: false }]
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.id == this.$route.query.city) : ''
    },
    activationRequestsList () {
      return this.$store.state.activationrequest.activationrequests
    },
    telegramBots () {
      return this.$store.state.telegramBots.find(bot => bot.city.name === this.$route.query.city)
    }
  },
  mounted () {
    this.getActivationRequestsFromDatabase()
  },
  methods: {
    async getActivationRequestsFromDatabase () {
      this.loading = true
      await this.$store.dispatch('activationrequest/getActivationRequestsFromDatabase', { city: this.$route.query.city, token: this.$store.state.auth.token })
      this.loading = false
    },
    async updateStatus (index) {
      await this.$store.dispatch('activationrequest/updateActivationRequest', { token: this.$store.state.auth.token, activationrequest: this.activationRequestsList[index], index })
      await this.$store.dispatch('activationrequest/createClientOnMikrotikById', { token: this.$store.state.auth.token, client: this.activationRequestsList[index], operador: this.$store.state.auth.username })
      this.$simpleTelegramAdminCreate({ client: this.activationRequestsList[index], telegramBots: this.telegramBots, operator: this.$store.state.auth.username })
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

<style scoped>
a {
    text-decoration: none;
  }
</style>
