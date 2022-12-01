<template>
  <div>
    <span class="px-2 mb-3">
      (Reaccionaste a un mensaje)
    </span>
    <span class="text-caption" style="left:10px;bottom:0;position:absolute;">
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
      return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
  }
}
</script>
