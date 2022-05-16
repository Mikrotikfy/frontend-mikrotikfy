<template>
  <v-container
    fluid
    class="transparent"
  >
    <v-row
      class="align-center"
      style="height:97vh;"
    >
      <v-col
        cols="12"
        xs="12"
        sm="10"
        md="8"
        lg="4"
        lx="4"
        class="mx-auto"
      >
        <AuthForm />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import AuthForm from '../components/auth/AuthForm.vue'
export default {
  layout: 'outuser',
  components: {
    AuthForm
  },
  middleware: 'notAuthenticated',
  head () {
    return {
      title: 'Ingreso API',
      meta: [
        { hid: 'language', name: 'language', content: 'es' },
        { hid: 'audience', name: 'audience', content: 'all' },
        { hid: 'rating', name: 'rating', content: 'general' },
        { hid: 'distribution', name: 'distribution', content: 'global' },
        { hid: 'document-type', name: 'document-type', content: 'Public' },
        { hid: 'MSSmartTagsPreventParsing', name: 'MSSmartTagsPreventParsing', content: 'true' },
        { hid: 'robots', name: 'robots', content: 'all' },
        { hid: 'robots', name: 'robots', content: 'all, index, follow' },
        { hid: 'googlebot', name: 'googlebot', content: 'all, index, follow' },
        { hid: 'yahoo-slurp', name: 'yahoo-slurp', content: 'all, index, follow' },
        { hid: 'msnbot', name: 'msnbot', content: 'index, follow' },
        { hid: 'googlebot-image', name: 'googlebot-image', content: 'all' },
        { hid: 'title', name: 'title', content: this.title },
        { hid: 'og:title', property: 'og:title', content: this.title },
        { hid: 'og:description', property: 'og:description', content: 'ARNOProducciones - Base de datos interactiva' },
        { hid: 'author', name: 'author', content: 'Nicolas Echeverry' }
      ]
    }
  }
}
</script>

<style>
body {
    color: rgba(255,255,255,0.65);
    background-color: #24292e;
    background-image: url('/star-bg.svg'),linear-gradient(#191c20, #1e1e1e 50%);
    background-repeat: no-repeat;
    background-position: center 0, 0 0, 0 0;
    background-size: cover;
}
</style>
