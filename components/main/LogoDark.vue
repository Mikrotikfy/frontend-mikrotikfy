<template>
  <v-img src="/logo-dark.png" width="150px" class="ml-auto mr-auto printme" />
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
