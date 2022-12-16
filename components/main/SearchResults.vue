<template>
  <v-card
    width="800"
    class="mx-auto mt-2 rounded-xl"
  >
    <v-card-title class="d-flex justify-center">
      Resultados de la busqueda "{{ $route.params.search }}"
    </v-card-title>
    <v-card-text>
      <v-list>
        <v-list-item
          v-for="result in results"
          :key="result.id"
        >
          <v-list-item-content>
            <v-list-item-title>
              {{ result.name }}
              <v-chip>
                {{ result.type }}
              </v-chip>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  computed: {
    results () {
      return this.$store.state.search.results
    }
  },
  mounted () {
    this.getResultsFromSearch()
  },
  methods: {
    getResultsFromSearch () {
      this.$store.dispatch('search/get', {
        search: this.$route.params.search,
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
