<template>
  <v-alert
    :color="client.naps.length > 0 ? 'success' : 'error'"
    dense
    outlined
  >
    {{ client.naps.length > 0 ? `El cliente actualmente pertenece a la NAP: ${client.naps[0].code}.` : 'El cliente no pertenece a ninguna NAP. En necesario agregarla' }}
  </v-alert>
</template>
<script>
export default {
  props: {
    client: {
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
