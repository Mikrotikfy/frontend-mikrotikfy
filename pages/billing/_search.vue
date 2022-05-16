<template>
  <v-container>
    <v-row>
      <v-col cols="5">
        <v-card>
          <v-card-title>
            <v-icon>mdi-account-circle</v-icon>
            <span class="headline ml-4">Buscando: {{ $route.params.search }}</span>
          </v-card-title>
          <v-card-text>
            <BillingClientSearch />
            <BillingClientList />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="5">
        <v-card>
          <v-card-title>
            <span class="headline ml-4">Movimientos de Cuenta</span>
          </v-card-title>
        </v-card>
      </v-col>
      <v-col cols="2">
        <v-card>
          <v-card-title>
            <span class="headline ml-4">Acciones</span>
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
