<template>
  <v-img src="/logo-dark.png" width="200px" class="ml-auto mr-auto printme" />
</template>
<style>
@media print {
  .no-printme {
    display: none !important;
  }
  .printme {
    display: block !important;
  }
}
</style>
