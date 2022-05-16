<template>
  <div>
    <v-row>
      <v-col
        cols="12"
      >
        <v-card>
          <client-only>
            <v-data-table
              :key="key"
              :headers="headers"
              :items="passwordchanges"
              :search="search"
              :items-per-page="itemsPerPage"
              :page.sync="page"
              :loading="initialLoading"
              sort-by="createdAt"
              calculate-widths
              sort-desc
              no-data-text="No hay informacion para mostrar aun..."
              loading-text="Cargando información de cambios de clave..."
              dense
              hide-default-footer
              mobile-breakpoint="100"
              @page-count="pageCount = $event"
            >
              <template v-slot:[`item.active`]="props">
                <v-chip
                  small
                  :color="getColor(props.item.active)"
                  class="white--text"
                  @click="save(props.item.id, props.item.active, props.item.client ? props.item.client.id : null, props.item.new_password, passwordchanges.indexOf(props.item))"
                >
                  {{ getState(props.item.active) }}
                </v-chip>
              </template>
              <template v-slot:[`item.created_at`]="{ item }">
                <span>
                  {{ getDate(item.createdAt) }}
                </span>
              </template>
              <template v-slot:[`item.actions`]="{ item }">
                <MainClientStatus
                  :name="item.client ? item.client.name : ''"
                  :clientid="item.client ? item.client.id : ''"
                  :code="item.client ? item.client.code : ''"
                />
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
  middleware: 'authenticated',
  data () {
    return {
      key: 0,
      page: 1,
      pageCount: 0,
      itemsPerPage: 50,
      search: '',
      currentCity: 'Mariquita',
      cityName: '',
      cityColor: '',
      alertBox: false,
      dialog: false,
      dialogEdit: false,
      initialLoading: false,
      headers: [
        { text: 'Codigo', sortable: true, value: 'client.code' },
        { text: 'Nombre', sortable: true, value: 'client.name' },
        { text: 'Cedula', sortable: true, value: 'dni' },
        { text: 'Dirección', sortable: true, value: 'address' },
        { text: 'Clave Anterior', sortable: false, value: 'old_password' },
        { text: 'Clave Nueva', sortable: true, value: 'new_password' },
        { text: 'Ciudad', sortable: true, value: 'client.city.name' },
        { text: 'Estado', sortable: true, value: 'active' },
        { text: 'Fecha', sortable: false, value: 'created_at' },
        { text: 'Acciones', sortable: false, value: 'actions' }
      ],
      title: 'Cambios de Clave',
      States: [{ id: 1, name: 'Abierto' }, { id: 2, name: 'Cerrado' }],
      passwordchanges: []
    }
  },
  mounted () {
    this.getPasswordChanges()
  },
  methods: {
    getDate (date) {
      const dateObject = new Date(date)
      const humanDateFormat = dateObject.toLocaleString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: 'numeric' })
      return humanDateFormat
    },
    getColor (state) {
      if (state) {
        return 'blue'
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
    },
    async getPasswordChanges () {
      const qs = require('qs')
      const query = qs.stringify({
        populate: [
          'client',
          'client.city'
        ],
        sort: 'createdAt:desc'
      },
      {
        encodeValuesOnly: true
      })
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}passwordchanges?${query}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        }
      })
        .then(res => res.json())
        .then((passwordchanges) => {
          this.passwordchanges = passwordchanges.data
        })
    },
    async save (id, active, clientid, password, index) {
      this.passwordchanges[index].active = !this.passwordchanges[index].active
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}passwordchanges/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: {
            id,
            active: !active,
            clientid,
            password
          }
        })
      })
        .then(res => res.json())
        .then((_) => {
          this.updateClientPassword(clientid, password)
        })
    },
    async updateClientPassword (id, password) {
      await fetch(`${this.$config.API_STRAPI_ENDPOINT}clients/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.$store.state.auth.token}`
        },
        body: JSON.stringify({
          data: {
            wifi_password: password
          }
        })
      })
        .then(res => res.json())
        .then((_) => {
          this.$toast.success('Peticion Actualizada con Exito', { duration: 4000, position: 'top-center' })
        })
    },
    cancel () {
      this.$toast.error('Petición cancelada', { position: 'top-center' })
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
