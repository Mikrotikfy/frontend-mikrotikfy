<template>
  <v-container fluid class="py-0">
    <v-row class="mb-1 justify-center w-100">
      <v-col
        cols="12"
        xs="12"
        sm="8"
        md="6"
        lg="6"
        xl="6"
      >
        <v-row
          class="mx-1 mt-4 justify-center d-flex"
        >
          <v-btn
            color="grey lighten-4 black--text elevation-0"
            dark
            :loading="loadingDataTable"
            tile
            large
            x-large
            style="border-radius: 30px 0 0 30px;padding:5px;height:56px;"
            @click="getClientBySearch()"
          >
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
          <v-text-field
            ref="searchClient"
            v-model="searchClientInput"
            :label="loadingDataTable ? 'Cargando... Por favor espere.' : 'Buscar por código, nombre, barrio o dirección'"
            single-line
            hide-details
            filled
            rounded
            autofocus
            autocomplete="off"
            :loading="loadingDataTable"
            :disabled="loadingDataTable"
            :class="searchByAddress ? 'primary white--text' : 'white--text'"
            style="width:100px;max-width: 600px;border-radius: 0;"
            @keyup.enter="getClientBySearch()"
          />
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :color="searchByAddress ? 'primary white--text elevation-0' : 'grey lighten-4 black--text elevation-0'"
                dark
                :loading="loadingDataTable"
                tile
                large
                x-large
                style="border-radius: 0 30px 30px 0;padding:5px;height:56px;"
                v-bind="searchByAddress ? null : attrs"
                v-on="searchByAddress ? null : on"
                @click="searchByAddress ? searchByAddress = false : getClientBySearch()"
              >
                <v-icon>{{ searchByAddress ? 'mdi-close-circle' : 'mdi-filter-outline' }}</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title class="mr-2">
                  Busqueda por direccion
                </v-list-item-title>
                <v-switch
                  v-model="searchByAddress"
                  color="primary"
                  @change="getClientBySearch()"
                />
              </v-list-item>
            </v-list>
          </v-menu>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'SearchBox',
  data () {
    return {
      searchClientInput: '',
      loadingDataTable: false,
      searchByAddress: false
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.id == this.$route.query.city) : ''
    }
  },
  watch: {
    '$route.query.clienttype' () {
      setTimeout(() => {
        this.$refs.searchClient.$refs.input.select()
        this.$refs.searchClient.$refs.input.focus()
      }, 200)
      this.searchClientInput = ''
    },
    searchByAddress () {
      this.getClientBySearch()
    }
  },
  mounted () {
    this.searchClientInput = this.$route.params.search
    this.searchByAddress = this.$route.query.fuzzy
    const latestSearch = localStorage.getItem('searchClient')
    if (latestSearch && this.$route.query.referer === 'layout') {
      this.searchClientInput = latestSearch
      this.getClientBySearch()
    } else {
      localStorage.setItem('searchClient', this.searchClientInput)
    }
    setTimeout(() => {
      this.$refs.searchClient.$refs.input.select()
      this.$refs.searchClient.$refs.input.focus()
    }, 200)
  },
  methods: {
    getClientBySearch () {
      if (this.searchClientInput) {
        localStorage.setItem('searchClient', this.searchClientInput)
        this.loadingDataTable = true
        this.$router.push({
          path: `/clients/${this.searchClientInput}?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}&referer=${this.$route.query.referer}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', this.searchClientInput)
        this.loadingDataTable = false
      } else {
        this.$router.push({
          path: `/clients?city=${this.$route.query.city}&clienttype=${this.$route.query.clienttype}&referer=${this.$route.query.referer}&fuzzy=${this.searchByAddress ? 'true' : 'false'}`
        })
        this.$emit('search', '')
        this.loadingDataTable = false
      }
    }
  }
}
</script>
