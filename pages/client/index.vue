<template>
  <span>
    <MainSearchBox />
    <MainClientList v-if="$route.query.search" />
  </span>
</template>
<script>
export default {
  name: 'ClientSearch',
  data () {
    return {
    }
  },
  computed: {
  },
  watch: {
  },
  async mounted () {
  },
  methods: {
  }
}
</script>
