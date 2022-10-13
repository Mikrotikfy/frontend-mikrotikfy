<template>
  <div>
    <v-card>
      <v-card-title>
        Clientes en cola:
        <strong v-if="$store.state.cuts.ready.length > 0" class="ml-2"> {{ this.$store.state.cuts.ready.length }} </strong>
        <span v-if="$store.state.cuts.errors > 0" class="ml-2"> No encontrados: {{ $store.state.cuts.errors }} </span>
        <v-spacer />
        <v-checkbox
          v-model="kick"
          label="Patear? (No recomendado)"
        />
      </v-card-title>
    </v-card>
  </div>
</template>
<script>
export default {
  data () {
    return {
      kick: false
    }
  },
  watch: {
    kick () {
      this.$store.commit('cuts/kick', this.kick)
    }
  }
}
</script>
