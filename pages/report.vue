<template>
  <v-container fluid>
    <v-row>
      <v-col class="d-flex justify-center">
        <v-card width="1200">
          <v-card-title>Informes Generales</v-card-title>
          <v-card-text>
            <v-tabs
              v-model="tab"
              background-color="grey darken-3"
              grow
            >
              <v-tab>
                Servicios
              </v-tab>
              <v-tab>
                Usuarios
              </v-tab>
              <v-tab>
                Recaudo
              </v-tab>
            </v-tabs>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card
                  flat
                >
                  <v-card-text>Servicios</v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card
                  flat
                >
                  <v-card-text>Usuarios</v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card
                  flat
                >
                  <v-card-text>Recaudo</v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data: () => ({
    tab: '1'
  })
}
</script>
