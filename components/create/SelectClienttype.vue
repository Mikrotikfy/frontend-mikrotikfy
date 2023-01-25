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
      outlined
      label="Tipo de Cliente"
    />
    <v-btn
      color="primary"
      class="mt-1"
      style="border-radius: 0px 10px 10px 0px; height:56px;"
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
      clienttypes: null,
      loading: false
    }
  },
  mounted () {
    this.getClientTypes()
  },
  methods: {
    nextE1 () {
      this.$store.commit('create/sete1', 2)
    },
    async getClientTypes () {
      this.clienttypes = await this.$store.dispatch('client/getClientTypesFromDatabase', this.$store.state.auth.token)
    }
  }
}
</script>
