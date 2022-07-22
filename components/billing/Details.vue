<template>
  <span> {{ formattedMessage }} </span>
</template>
<script>
const meses = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
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
      return this.billinginfo.item.details
        ? this.billinginfo.item.details
        : this.billinginfo.item.type === 'RECAUDO'
          ? `RECAUDO MES ${meses[new Date(this.billinginfo.item.date).getMonth()].toUpperCase()}`
          : this.billinginfo.item.type === 'FACTURACION'
            ? `FACTURA MES ${meses[new Date(this.billinginfo.item.date).getMonth()].toUpperCase()}`
            : ''
    }
  }
}
</script>
