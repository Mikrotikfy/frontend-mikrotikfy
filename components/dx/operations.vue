<template>
  <div>
    <v-btn
      block
      color="primary"
      class="rounded-xl"
    >
      <span>{{ type }}</span>
    </v-btn>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: 'default'
    }
  }
}
</script>
