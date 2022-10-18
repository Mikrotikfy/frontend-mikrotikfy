<template>
  <div>
    <v-list-item
      v-if="$route.query.phone"
      :key="item.title"
      class="pa-0"
    >
      <v-list-item-avatar>
        <v-img :src="item.avatar" />
      </v-list-item-avatar>

      <v-list-item-content>
        <v-list-item-title v-text="item.title" />
      </v-list-item-content>
    </v-list-item>
  </div>
</template>
<script>
export default {
  data () {
    return {
      item: {
        avatar: 'https://cdn.vuetifyjs.com/images/lists/1.jpg',
        title: 'Nicolas Echeverry'
      }
    }
  }
}
</script>
