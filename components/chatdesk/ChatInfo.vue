<template>
  <v-toolbar
    class="elevation-1 rounded-xl"
  >
    <v-list-item
      v-if="$route.query.phone"
      class="pa-0"
    >
      <v-list-item-avatar>
        <v-img :src="'default-user.png'" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="currentContact ? currentContact.name + ' - ' + currentContact.phone.slice(2) : ''" />
      </v-list-item-content>
    </v-list-item>
  </v-toolbar>
</template>
<script>
export default {
  data () {
    return {}
  },
  computed: {
    currentContact () {
      return this.$store.state.whatsapp.whatsappContacts.find(c => c.phone === this.$route.query.phone)
    }
  }
}
</script>
