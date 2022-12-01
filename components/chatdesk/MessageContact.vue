<template>
  <div>
    <span class="px-2 mb-3 mr-8">
      <span
        v-for="contact in payload.entry[0].changes[0].value.messages[0].contacts"
        :key="contact.name.first_name"
      >
        {{
          contact.name.first_name
        }}
        <span
          v-for="number in contact.phones"
          :key="number.phone"
        >
          {{ number.phone }}
        </span>
      </span>
    </span>
    <span class="text-caption" style="right:10px;bottom:0;position:absolute;">
      {{
        getDateFromUnixTime(payload.entry[0].changes[0].value.messages[0].timestamp)
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
    }
  },
  methods: {
    getDateFromUnixTime (unixTime) {
      const date = new Date(unixTime * 1000)
      return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
  }
}
</script>
