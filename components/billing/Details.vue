<template>
  <span> {{ formattedMessage }} </span>
</template>
<script>
const meses = [
  '',
  'ENERO',
  'FEBRERO',
  'MARZO',
  'ABRIL',
  'MAYO',
  'JUNIO',
  'JULIO',
  'AGOSTO',
  'SEPTIEMBRE',
  'OCTUBRE',
  'NOVIEMBRE',
  'DICIEMBRE'
]
export default {
  props: {
    billinginfo: {
      type: Object,
      required: true,
      default: () => {}
    }
  },
  computed: {
    formattedMessage () {
      return this.billinginfo.item.type.billingMonth ? meses[this.billinginfo.item.type.billingMonth] : this.billinginfo.item.details
    }
  }
}
</script>
