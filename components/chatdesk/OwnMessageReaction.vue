<template>
  <div>
    <span class="px-2 mb-3 mr-8">
      (Reaccionaste a un mensaje)
    </span>
    <span class="text-caption" style="right:10px;bottom:0;position:absolute;">
      {{
        getDate(createdat)
      }}
    </span>
  </div>
</template>
<script>
export default {
  name: 'ChatdeskMessageText',
  props: {
    payload: {
      type: Object,
      required: true
    },
    createdat: {
      type: String,
      required: true
    }
  },
  methods: {
    getDate (inputdate) {
      const date = new Date(inputdate)
      return `${date.getHours()}:${date.getMinutes()}`
    }
  }
}
</script>
