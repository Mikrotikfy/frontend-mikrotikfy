<template>
  <v-alert
    :color="service.naps.length > 0 ? 'success' : 'error'"
    dense
    outlined
  >
    {{ service.naps.length > 0 ? `El cliente actualmente pertenece a la NAP: ${service.naps[0].code}.` : 'El cliente no pertenece a ninguna NAP. En necesario agregarla' }}
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
  }
}
</script>
