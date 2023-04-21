<template>
  <span class="d-flex fill-height">
    <v-col cols="3" class="pr-0">
      <v-card style="border-radius:20px 0px 0px 20px;height:100%;max-height:100%;" class="elevation-0">
        <v-card-title>
          <v-icon>mdi-account</v-icon>
          <span class="text-h6 ml-1">Escritorio ARNOProducciones</span>
        </v-card-title>
        <v-card-text class="pr-1">
          <ChatdeskUser />
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="9" class="pl-0">
      <v-card style="border-radius:0px 20px 20px 0px;height:100%;backgroud-color:rgba(0,0,0,0.5);backdrop-filter:blur(5px);" class="elevation-0">
        <v-card-text style="height:100%;" class="pa-1 mb-2">
          <ChatdeskChat />
        </v-card-text>
      </v-card>
    </v-col>
  </span>
</template>
<script>
export default {
  name: 'Chatdesk',
  head () {
    return {
      title: this.$route.query.phone ? `Chat de ${this.$route.query.phone}` : 'Escritorio ARNOProducciones'
    }
  }
}
</script>
<style scoped>
</style>
