<template>
  <v-alert
    :color="serviceNapsList.length > 0 ? 'success' : 'error'"
    dense
    outlined
  >
    {{ serviceNapsList.length > 0 ? `El cliente actualmente pertenece a la NAP: ${serviceNapsList[0].code}.` : 'El cliente no pertenece a ninguna NAP. Es necesario agregarla' }}
  </v-alert>
</template>
<script>
export default {
  props: {
    service: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      naps: null,
      color: ''
    }
  },
  computed: {
    serviceNapsList () {
      return this.$store.state.nap.serviceNapsList
    }
  }
}
</script>
