<template>
  <div>
    <MainSearchBox />
    <MainClientList :search="search" />
  </div>
</template>

<script>
export default {
  transition: 'none',
  asyncData ({ params }) {
    const search = params.search // When calling /abc the slug will be "abc"
    return { search }
  },
  data () {
    return {
      title: ''
    }
  },
  computed: {
    role () {
      return this.$store.state.auth.allowed_components
    },
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.cities ? this.$store.state.cities.find(c => c.name == this.$route.query.city) : ''
    }
  },
  watch: {
    $route () {
      this.getTickettypes()
    }
  },
  mounted () {
    this.getTickettypes()
  },
  methods: {
    getTickettypes () {
      this.$store.dispatch('ticket/getTickettypes', {
        city: this.$route.query.city,
        clienttype: this.$route.query.clienttype,
        token: this.$store.state.auth.token
      })
    },
    can (component) {
      // eslint-disable-next-line camelcase
      const allowed_components = this.role
      // eslint-disable-next-line camelcase
      const current_component = component
      return allowed_components.includes(current_component)
    },
    getLocalStorage () {
      this.$store.dispatch('loadLocalStorage')
    }
  },
  head () {
    return {
      title: this.search ? this.search + ' - Búsqueda ' + this.currentCity.name : 'Clientes API ' + this.currentCity.name,
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
