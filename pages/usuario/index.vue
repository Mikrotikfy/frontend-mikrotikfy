<template>
  <v-container>
    <v-row class="justify-center">
      <v-col cols="5">
        <v-card>
          <MainLogo />
          <v-card-title class="text-center justify-center">
            Consulta tu estado de cuenta
          </v-card-title>
          <v-card-text>
            <v-text-field
              v-model="dni"
              label="Ingresu tu cedula"
              outlined
              prominent
            />
          </v-card-text>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              color="primary"
              l-large
              @click="getAccount"
            >
              Consultar
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'NewPasswordChanger',
  layout: 'outuser',
  computed: {
    dni () {
      return this.$route.params.dni
    }
  },
  head () {
    return {
      title: 'Consulta estado de cuenta'
    }
  }
}
</script>
