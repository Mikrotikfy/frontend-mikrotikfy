<template>
  <div :class="client.naps.length > 0 ? 'green--text mb-2' : 'red--text darken-4 mb-2'">
    {{ client.naps.length > 0 ? `El cliente actualmente pertenece a la NAP: ${client.naps[0].code}. Si es necesario, actualizala` : 'El cliente no pertenece a ninguna NAP. En necesario agregarla'}}
  </div>
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
