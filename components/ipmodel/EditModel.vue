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
  data () {},
  computed: {
    ipmodel () {
      return this.$store.state.ipmodel.ipModel
    }
  },
  mounted () {
    this.getIpModel()
  },
  methods: {
    async getIpModel () {
      await this.$store.dispatch('ipmodel/getIpModel', {
        clientId: this.client.id,
        city: this.$route.query.city,
        token: this.$store.state.auth.token
      })
    }
  }
}
</script>
