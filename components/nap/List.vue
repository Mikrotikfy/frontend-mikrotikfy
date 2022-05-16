<template>
  <form>
    <v-container>
      <v-alert
        v-if="alertBox"
        type="info"
        :class="alertBoxColor"
        tile
        dismissible
      >
        {{ createdMessage }}
      </v-alert>
      <v-card-title>
        {{ $store.state.nap.naps.length }} Naps en {{ currentCity.name }}
      </v-card-title>
      <v-card-text>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Buscar Naps"
          single-line
          hide-details
        />
      </v-card-text>
      <v-card-text>
        <client-only>
          <v-data-table
            :headers="headers"
            :items="napList"
            :item-class="itemRowBackground"
            :page.sync="page"
            :search="search"
            sort-by="calories"
            mobile-breakpoint="100"
            class="elevation-1"
            hide-default-footer
            @page-count="pageCount = $event"
            @click:row="showNapInfo"
          />
        </client-only>
      </v-card-text>
      <v-pagination
        v-model="page"
        :length="pageCount"
      />
    </v-container>
  </form>
</template>

<script>
export default {
  name: 'ListNap',
  data: () => ({
    id: 0,
    name: '',
    createdMessage: '',
    alertBox: false,
    alertBoxColor: '',
    isSubmitting: false,
    page: 0,
    pageCount: 0,
    search: '',
    headers: [
      { text: 'Codigo', value: 'code' },
      { text: 'Tipo Nap', value: 'naptype.name' },
      { text: 'Barrio', value: 'neighborhood.name' },
      { text: 'Direccion', value: 'address' },
      { text: 'Tec.', value: 'technology.name' }
    ]
  }),
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.name == this.$route.query.city) : ''
    },
    napList () {
      return this.$store.state.nap.naps
    }
  },
  mounted () {
    this.$store.dispatch('nap/getNaps', { city: this.$route.query.city, token: this.$store.state.auth.token })
  },
  methods: {
    showNapInfo (nap) {
      this.$emit('showNapInfo', nap)
    },
    itemRowBackground () {
      if (this.$vuetify.theme.dark) {
        return 'selected'
      }
    }
  }
}
</script>

<style>
.selected {
  background-color: #2b3f2b;
}
</style>
