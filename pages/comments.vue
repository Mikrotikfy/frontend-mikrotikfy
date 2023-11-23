<template>
  <div>
    <v-row>
      <v-col
        cols="12"
      >
        <v-card :loading="loading">
          <v-card-title
            :style="`color:${cityColor};`"
          >
            <v-col cols="auto" class="pa-0">
              <v-select
                v-model="selectedCity"
                :items="cities"
                label="Filtrar Ciudad"
                item-value="id"
                item-text="name"
                return-object
                dense
                solo
                rounded
                hide-details="auto"
                class="mr-2 elevation-0"
                style="width:180px;"
                @change="changeCity(selectedCity)"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }}
                </template>
              </v-select>
            </v-col>
            <v-col cols="auto" class="pa-0">
              <v-select
                v-model="selectedClienttype"
                :items="clienttypes"
                label="Filtrar Servicio"
                item-value="id"
                item-text="name"
                return-object
                dense
                solo
                rounded
                hide-details="auto"
                class="mr-2 elevation-0"
                style="width:180px;"
                @change="changeType(selectedClienttype)"
              >
                <template v-slot:item="{ item }">
                  {{ item.name }}
                </template>
              </v-select>
            </v-col>
            <v-btn
              color="blue darken-4"
              dark
              :loading="loading"
              :disabled="loading"
              class="mr-4"
              @click="generateComments()"
            >
              <v-icon>mdi-plus</v-icon>
              Generar Comentarios
            </v-btn>
            <v-chip
              color="blue darken-4 white--text"
              small
              class="mr-4"
            >
              Servicios en API: {{ services ? services.length : '' }}
            </v-chip>
            <v-chip
              color="blue darken-4 white--text"
              small
              class="mr-4"
            >
              Servicios en Mikrotik: {{ MikrotikClient ? MikrotikClient.length : '' }}
            </v-chip>
            <v-chip
              color="cyan darken-4 white--text"
              small
              class="mr-4"
            >
              Exito: {{ successChanges }}
            </v-chip>
            <v-chip
              color="red darken-4 white--text"
              small
              class="mr-4"
            >
              Errores: {{ errorChanges }}
            </v-chip>
            <v-spacer />
            <v-btn
              color="red darken-4"
              dark
              class="mr-4"
              @click="applyComments()"
            >
              <v-icon>mdi-pencil</v-icon>
              Aplicar Comentarios
            </v-btn>
          </v-card-title>
          <client-only>
            <v-data-table
              :key="key"
              :headers="headers"
              :items="services"
              :search="search"
              :items-per-page="itemsPerPage"
              :page.sync="page"
              :loading="initialLoading"
              sort-by="created_at"
              calculate-widths
              sort-desc
              no-data-text="No hay informacion para mostrar aun..."
              loading-text="Cargando información de servicios..."
              dense
              hide-default-footer
              mobile-breakpoint="100"
              @page-count="pageCount = $event"
            >
              <!-- COMPONENTS IMPLEMETATION -->
              <!-- eslint-disable -->
              <template v-slot:[`item.actions`]="{ item }">
                <div style="white-space:nowrap">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        v-bind="attrs"
                        color="yellow darken-4"
                        v-on="on"
                        @click="removeItem(services.map(function(x) {return x._id; }).indexOf(item._id))"
                      >
                        mdi-close
                      </v-icon>
                    </template>
                    <span>Quitar</span>
                  </v-tooltip>
                </div>
              </template>
              <!-- ########################### -->
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
  name: 'CommentGenerator',
  components: {
  },
  data () {
    return {
      key: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 50,
      services: [],
      MikrotikClient: [],
      search: '',
      currentCity: 'Mariquita',
      successChanges: 0,
      errorChanges: 0,
      cityName: '',
      cityColor: '',
      alertBox: false,
      loading: false,
      dialog: false,
      dialogEdit: false,
      initialLoading: false,
      headers: [
        { text: 'Codigo', sortable: true, value: 'code' },
        { text: 'Nombre', sortable: true, value: 'client_name' },
        { text: 'Modelo', sortable: true, value: 'newModel' },
        { text: 'Comentario', sortable: true, value: 'comment' },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ],
      title: 'Cambios de Clave',
      States: [{ name: 'Abierto', value: false }, { name: 'Cerrado', value: true }],
      snack: false,
      snackColor: '',
      snackText: '',
      selectedCity: null,
      selectedClienttype: null
    }
  },
  computed: {
    clienttypes () {
      return this.$store.state.auth.clienttypes
    },
    cities () {
      return this.$store.state.auth.cities
    }
  },
  watch: {
    $route () {
      this.populateServices()
      this.populateMikrotikServices()
    }
  },
  mounted () {
    this.populateServices()
    this.populateMikrotikServices()
    this.setQueryCity()
    this.setSelectedClienttype()
  },
  methods: {
    setQueryCity () {
      if (this.$route.query.city) {
        this.selectedCity = this.$store.state.auth.cities.find(c => c.name === this.$route.query.city)
      }
    },
    setSelectedClienttype () {
      if (this.$route.query.clienttype) {
        this.selectedClienttype = this.$store.state.auth.clienttypes.find(c => c.name === this.$route.query.clienttype)
      }
    },
    changeCity (city) {
      this.$router.push({ query: { city: city.name, clienttype: this.$route.query.clienttype, view: this.$route.query.view } })
    },
    changeType (clienttype) {
      this.$router.push({ query: { city: this.$route.query.city, clienttype: clienttype.name, view: this.$route.query.view } })
    },
    generateComment (index) {
      const services = this.services
      const newComment = `${services[index].code} 
      ${services[index].technology ? services[index].technology.name : 'No Def.'} 
      ${services[index].neighborhood} 
      ${services[index].address} 
      ${services[index].client_name} 
      ${services[index].dni} 
      ${services[index].phone} 
      ${services[index].offer?.name} 
      ${services[index].wifi_ssid} 
      ${services[index].wifi_password}`
      return newComment
    },
    async generateComments () {
      this.loading = true
      const length = this.services.length
      for (let i = 0; i < length; i++) {
        this.successChanges++
        this.$set(this.services[i], 'comment', await this.generateComment(i))
        if (length - 1 === i) {
          this.loading = false
        }
      }
    },
    async applyComments () {
      const newServiceInfo = this.services
      for (let i = 0; i < newServiceInfo.length; i++) {
        await this.$store.dispatch('client/updateServiceCommentOnMikrotik', {
          service: newServiceInfo[i],
          token: this.$store.state.auth.token
        }).then((input) => {
          this.successChanges++
        }).catch((error) => {
          this.errorChanges++
          this.snackText = error
        })
      }
    },
    async populateServices () {
      const qs = require('qs')
      const query = qs.stringify({
        filters: {
          city: {
            name: this.$route.query.city
          },
          clienttype: {
            name: this.$route.query.clienttype
          }
        },
        pagination: {
          pageSize: 2500
        },
        populate: ['technology', 'plan', 'clienttype', 'city', 'offer']
      },
      {
        encodeValuesOnly: true
      })
      try {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}services?${query}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          }
        })
          .then(res => res.json())
          .then(({ data: services }) => {
            this.services = services
          })
      } catch (error) {
        throw new Error(`ACTION ${error}`)
      }
    },
    async populateMikrotikServices () {
      try {
        await fetch(`${this.$config.API_STRAPI_ENDPOINT}secrets?mikrotikHost=177.93.39.23:8087`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.$store.state.auth.token}`
          }
        })
          .then(res => res.json())
          .then((secrets) => {
            this.MikrotikClient = secrets
          })
      } catch (error) {
        throw new Error(`ACTION ${error}`)
      }
    },
    removeItem (index) {
      this.clients.splice(index, 1)
    },
    sleep (ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    },
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getColor (state) {
      if (state.value) {
        return 'red'
      } else {
        return 'blue'
      }
    },
    getState (state) {
      if (state.value) {
        return 'Cerrado'
      } else {
        return 'Abierto'
      }
    },
    save (id, status) {
      this.$apollo.mutate({
        // mutation: gqlt`mutation ($input: UpdatePasswordChangeInput){
        //   updatePasswordChangeRequest(input: $input)
        // }`,
        variables: {
          input: {
            _id: id,
            closed: {
              name: status.name,
              value: status.value
            }
          }
        }
      }).then((input) => {
        this.snack = true
        this.snackColor = 'info'
        this.snackText = 'Petición actualizada con éxito.'
      }).catch((error) => {
        this.snack = true
        this.snackColor = 'red'
        this.snackText = error
      })
    },
    cancel () {
      this.snack = true
      this.snackColor = 'error'
      this.snackText = 'Operacion cancelada'
    },
    close () {
      // eslint-disable-next-line no-console
      console.log('Info closed')
    }
  },
  head () {
    return {
      title: this.title,
      meta: [
        { hid: 'language', name: 'language', content: 'es' },
        { hid: 'audience', name: 'audience', content: 'all' },
        { hid: 'rating', name: 'rating', content: 'general' },
        { hid: 'distribution', name: 'distribution', content: 'global' },
        { hid: 'document-type', name: 'document-type', content: 'Public' },
        { hid: 'MSSmartTagsPreventParsing', name: 'MSSmartTagsPreventParsing', content: 'true' },
        { hid: 'robots', name: 'robots', content: 'all' },
        { hid: 'robots', name: 'robots', content: 'all, index, follow' },
        { hid: 'googlebot', name: 'googlebot', content: 'all, index, follow' },
        { hid: 'yahoo-slurp', name: 'yahoo-slurp', content: 'all, index, follow' },
        { hid: 'msnbot', name: 'msnbot', content: 'index, follow' },
        { hid: 'googlebot-image', name: 'googlebot-image', content: 'all' },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: 'ARNOProducciones - Base de datos interactiva' },
        { hid: 'author', name: 'author', content: 'Nicolas Echeverry' }
      ]
    }
  }
}
</script>
