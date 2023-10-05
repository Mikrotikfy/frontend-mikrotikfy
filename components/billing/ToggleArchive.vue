<template>
  <v-switch
    v-model="togglePayed"
    label="Ver Pagadas"
    class="mr-2"
    inset
    @change="togglePayedStatus"
  />
</template>
<script>
export default {
  data () {
    return {
      togglePayed: false
    }
  },
  watch: {
    '$store.state.billing.showPayed' (newValue, oldValue) {
      this.togglePayed = newValue
    }
  },
  methods: {
    togglePayedStatus () {
      this.$store.commit('billing/togglePayed')
    }
  }
}
</script>
