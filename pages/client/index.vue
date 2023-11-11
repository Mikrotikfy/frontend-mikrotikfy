<template>
  <v-container fluid>
    <MainSearchBox />
    <MainClientItem v-if="$route.query.search" />
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
  },
  watch: {
  },
  async mounted () {
  },
  methods: {
  }
}
</script>
