<template>
  <div class="d-flex">
    <v-autocomplete
      v-model="clienttype"
      :items="clienttypes"
      item-text="name"
      item-value="id"
      style="border-radius: 0px 0px 0px 0px;"
      class="mt-1"
      return-object
      disabled
      outlined
      label="Tipo de Cliente"
      @click.enter="nextE1"
    />
    <v-btn
      color="primary"
      class="mt-1"
      style="border-radius: 0px 10px 10px 0px; height:56px;"
      autofocus="true"
      :disabled="!clienttype"
      :loading="loading"
      x-large
      @click.enter="nextE1"
    >
      <v-icon>
        mdi-send
      </v-icon>
    </v-btn>
  </div>
</template>
<script>
export default {
  data () {
    return {
      clienttype: null,
      loading: false
    }
  },
  computed: {
    clienttypes () {
      return this.$store.state.client.clienttypes
    }
  },
  watch: {
    '$route.query.clienttype' () {
      this.setClienttype()
      this.$store.commit('create/sete1', 1)
    }
  },
  mounted () {
    this.getClientTypes()
  },
  methods: {
    nextE1 () {
      this.$store.commit('create/sete1', 2)
    },
    setClienttype () {
      this.clienttype = this.clienttypes.find(clienttype => clienttype.name === this.$route.query.clienttype)
    },
    async getClientTypes () {
      await this.$store.dispatch('client/getClientTypesFromDatabase', this.$store.state.auth.token)
      this.setClienttype()
    }
  }
}
</script>
