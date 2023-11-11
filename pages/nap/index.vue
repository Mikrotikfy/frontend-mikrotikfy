<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="2"
        lg="2"
      >
        <NapCreate />
      </v-col>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="5"
        lg="5"
      >
        <NapList @showNapInfo="showNapInfo" />
      </v-col>
      <v-col
        cols="12"
        xs="12"
        sm="12"
        md="5"
        lg="5"
      >
        <NapClients :napdata="napData" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NapManage',
  data () {
    return {
      napData: {}
    }
  },
  computed: {
    currentCity () {
      // eslint-disable-next-line eqeqeq
      return this.$store.state.auth.cities ? this.$store.state.auth.cities.find(c => c.name == this.$route.query.city) : ''
    }
  },
  watch: {
    '$route.query.city' () {
      this.napData = {}
    }
  },
  methods: {
    showNapInfo (data) {
      this.napData = data
    }
  },
  head () {
    return {
      title: 'Gestion de NAP'
    }
  }
}
</script>

<style>

</style>
