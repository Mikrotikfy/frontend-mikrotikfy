<template>
  <div>
    <v-textarea
      v-model="input"
    />
    <v-btn
      color="blue darken-4"
      @click="paseJson"
    />
    <v-btn
      color="blue darken-4"
      @click="getCLientsByCity"
    />
  </div>
</template>
<script>
export default {
  data () {
    return {
      input: ''
    }
  },
  methods: {
    async addAddress (clientCode, address, neighborhoodId) {
      console.table({ clientCode, address, neighborhoodId })
      await this.$store.dispatch('address/addAddressRepair', {
        clientCode,
        address: this.address,
        neighborhoodId,
        token: this.$store.state.auth.token
      })
    },
    paseJson () {
      const jsonParsed = JSON.parse(this.input)
      jsonParsed.forEach(async (client) => {
        const { code, address, neighborhood } = client
        await this.addAddress(code, address, neighborhood)
      })
    },
    getCLientsByCity () {
      this.$store.dispatch('client/getClientsByCity', {
        token: this.$store.state.auth.token,
        city: this.$route.query.city
      })
    }
  }
}
</script>
