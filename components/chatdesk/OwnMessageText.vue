<template>
  <div v-if="payload.hasOwnProperty('recipient_type')">
    <span class="px-2 mb-3">
      {{
        payload.text.body
      }}
    </span>
    <span class="text-caption" style="left:10px;bottom:0;position:absolute;">
      {{
        getDate(createdat)
      }}
    </span>
  </div>
  <div v-else>
    <v-container class="py-1">
      <v-row>
        <v-col class="px-1 py-0">
          {{
            payload.entry[0].changes[0].value.messages[0].text.body
          }}
        </v-col>
      </v-row>
      <v-row class="justify-end text-right">
        <v-col class="px-1 py-0">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                icon
                small
                open-on-hover
                open-delay="3000"
                class="text-caption"
                style="color: #9e9e9e;"
                v-on="on"
              >
                {{ getDateFromUnixTime(payload.entry[0].changes[0].value.messages[0].timestamp) }}
              </v-btn>
            </template>
            <span>{{ getDateFromUnixTime2(payload.entry[0].changes[0].value.messages[0].timestamp) }}</span>
          </v-tooltip>
        </v-col>
      </v-row>
    </v-container>
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
    },
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    getDate (inputdate) {
      const date = new Date(inputdate)
      return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    },
    getDateFromUnixTime (unixTime) {
      const date = new Date(unixTime * 1000)
      return `${date.getHours()}:${date.getMinutes()}`
    },
    getDateFromUnixTime2 (unixTime) {
      const date = new Date(unixTime * 1000)
      return `${date.getHours()}:${date.getMinutes()} - ${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`
    }
  }
}
</script>
