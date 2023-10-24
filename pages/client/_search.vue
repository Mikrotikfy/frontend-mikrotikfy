<template>
  <v-container fluid>
    <MainSearchBox />
    <MainClientList v-if="searchByAddress" />
    <MainClientItem v-else />
  </v-container>
</template>
<script>
export default {
  name: 'ClientSearch',
  data () {
    return {
    }
  },
  computed: {
    searchByAddress () {
      return this.$route.query.searchByAddress === 'true'
    }
  },
  watch: {
  },
  async mounted () {
  },
  methods: {
  }
}
</script>
