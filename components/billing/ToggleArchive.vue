<template>
  <v-switch
    v-model="togglePayed"
    label="Ver Pagadas"
    class="mr-2"
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
  methods: {
    togglePayedStatus () {
      this.$store.commit('billing/togglePayed')
    }
  }
}
</script>
