<template>
  <v-dialog
    v-if="$isAdmin()"
    v-model="dialog"
    width="500"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        color="grey darken-2"
        dark
        v-bind="attrs"
        v-on="on"
      >
        Crear NAP
      </v-btn>
    </template>

    <v-card>
      <NapCreate
        @close="dialog = false"
      />
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data: () => ({
    dialog: false
  })
}
</script>
