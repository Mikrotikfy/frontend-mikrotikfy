<template>
  <div v-if="ipmodel">
    <v-row>
      <v-col>
        <p>{{ ipmodel.host }}</p>
        <p>{{ ipmodel.mask }}</p>
        <p>{{ ipmodel.gateway }}</p>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  props: {
    client: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      ipmodel: null
    }
  },
  mounted () {
    this.getIpModel()
  },
  methods: {
    async getIpModel () {
      this.ipmodel = await this.$store.dispatch('ipmodel/getIpModel', {
        clientId: this.client.id,
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
