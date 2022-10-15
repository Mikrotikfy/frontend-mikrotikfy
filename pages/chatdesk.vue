<template>
  <v-container class="parent">
    <span class="d-flex">
      <v-col cols="4" class="pr-0">
        <v-card style="border-radius:20px 0px 0px 20px;height:100%;max-height:100%;" class="elevation-0">
          <v-card-title>
            <v-icon>mdi-account</v-icon>
            <span class="headline ml-1">Escritorio ARNOProducciones</span>
          </v-card-title>
          <v-card-text>
            <ChatdeskUser />
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8" class="pl-0">
        <v-card style="border-radius:0px 20px 20px 0px;height:100%;backgroud-color:rgba(0,0,0,0.5);backdrop-filter:blur(5px);" class="elevation-0">
          <v-card-text style="height:100%;" class="pa-1">
            <ChatdeskChat />
          </v-card-text>
        </v-card>
      </v-col>
    </span>
  </v-container>
</template>
<style scoped>
.parent {
  display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    height:100%;
    max-height: 90vh;
}
</style>
