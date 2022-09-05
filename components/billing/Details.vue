<template>
  <span> {{ formattedMessage }} </span>
</template>
<script>
const meses = [
  '',
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
          ? `RECAUDO MES ${meses[this.billinginfo.item.billingMonth].toUpperCase()} ${this.$store.state.billing.showArchive ? 'ARCHIVADO' : ''}`
          : this.billinginfo.item.type === 'FACTURACION'
            ? `FACTURA MES ${meses[this.billinginfo.item.billingMonth].toUpperCase()} ${this.$store.state.billing.showArchive ? 'ARCHIVADO' : ''}`
            : ''
    }
  }
}
</script>
