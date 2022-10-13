<template>
  <v-switch
    v-model="toggleArchive"
    label="Ver Facturas Pasadas"
    class="mr-2"
    @change="toggleArchiveStatus"
  />
</template>
<script>
export default {
  data () {
    return {
      toggleArchive: false
    }
  },
  methods: {
    toggleArchiveStatus () {
      this.$store.commit('billing/toggleArchive')
    }
  }
}
</script>
