<template>
  <div>
    <span class="px-2 mb-3 mr-8">
      <v-img
        :src="imgBlob"
        width="500px"
        height="500px"
      />
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
  data () {
    return {
      imgBlob: null
    }
  },
  mounted () {
    this.getMediaById()
  },
  methods: {
    async getMediaById () {
      await fetch(`https://graph.facebook.com/v14.0/${this.payload.entry[0].changes[0].value.messages[0].image.id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.$config.META_TOKEN}`
        }
      })
        .then(response => response.json())
        .then((data) => {
          console.log(data)
          setTimeout(() => {
            fetch('https://lookaside.fbsbx.com/whatsapp_business/attachments/?mid=839491347225724&ext=1666124484&hash=ATuMvDQCE9au0RSMMJ-NLe5kihvfsQGHIwKuhUsg3Ykpmg', {
              method: 'GET',
              headers: {
                'Access-Control-Allow-Origin': '*',
                Authorization: `Bearer ${this.$config.META_TOKEN}`
              }
            })
              .then((data) => {
                console.log(data)
                const imageObjectURL = URL.createObjectURL(data)
                this.imgBlob = imageObjectURL
              })
          }, 500)
        })
    },
    getDateFromUnixTime (unixTime) {
      const date = new Date(unixTime * 1000)
      return `${date.getHours()}:${date.getMinutes()}`
    }
  }
}
</script>
