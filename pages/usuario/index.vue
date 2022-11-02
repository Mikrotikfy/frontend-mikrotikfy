<template>
  <v-container style="height:95vh;">
    <v-row class="justify-center">
      <v-col cols="12" md="7" xl="5">
        <v-card class="rounded-xl">
          <v-card-title>
            Consulta tu estado de cuenta
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-text-field
              v-model="dni"
              :rules="valid_dni"
              label="Ingresu tu cedula"
              filled
              rouned
              prepend-icon="mdi-account"
              hide-details="auto"
            />
          </v-card-text>
          <v-card-text class="d-flex justify-center pb-5">
            <v-btn
              :color="$route.params.dni ? 'yellow darken-4' : 'primary'"
              class="elevation-0 rounded-xl"
              x-large
              @click="searchAccount"
            >
              {{ $route.params.dni ? 'Volver a consultar' : 'Consultar' }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-card-text class="text-center">
        <p class="grey--text">
          &copy; ARNOProducciones S.A.S.
        </p>
      </v-card-text>
      <div style="width:250px;">
        <MainLogo />
      </div>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'NewPasswordChanger',
  layout: 'outuser',
  data () {
    return {
      dni: '',
      valid_dni: [
        value => !!value || 'Debes especificar la cedula',
        (value) => {
          const pattern = /^[A-Za-z0-9]+$/
          return pattern.test(value) || 'La cedula no debe llevar puntos ni otros caracteres que no sean numeros.'
        }
      ]
    }
  },
  methods: {
    searchAccount () {
      if (this.dni !== '') {
        this.$router.push({ path: `/usuario/${this.dni}` })
      }
    }
  },
  head () {
    return {
      title: 'Consulta estado de cuenta'
    }
  }
}
</script>
