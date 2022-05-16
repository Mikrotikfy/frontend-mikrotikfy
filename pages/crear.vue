<template>
  <v-row class="justify-center">
    <v-col
      cols="6"
    >
      <v-card>
        <v-card-title
          class="justify-center blue darken-4 white--text"
        >
          <h1>
            Crear Cliente
          </h1>
        </v-card-title>
        <v-card-text>
          <CreateForm />
        </v-card-text>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import CreateForm from '../components/create/CreateForm'
export default {
  components: {
    CreateForm
  }
}
</script>

<style>

</style>
