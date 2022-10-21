<template>
  <div class="parent-chat-input">
    <v-text-field
      v-model="operatorTextInput"
      label="Aa"
      filled
      rounded
      dense
      hide-details="auto"
    />
  </div>
</template>
<style scoped>
  .parent-chat-input {
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    width:100%;
  }
</style>
<script>
export default {
  name: 'ChatdeskInput',
  data () {
    return {
      operatorTextInput: '',
      messageText: {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: 'PHONE_NUMBER',
        type: 'text',
        text: { // the text object
          preview_url: false,
          body: 'MESSAGE_CONTENT'
        }
      },
      messageTemplate: {
        messaging_product: 'whatsapp',
        to: '573024493001',
        type: 'template',
        template: {
          name: 'internet_account_dynamic',
          language: {
            code: 'es'
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  text: '15 de octubre',
                  type: 'text'
                }
              ]
            },
            {
              type: 'button',
              index: '0',
              sub_type: 'url',
              parameters: [
                {
                  text: '1110601254',
                  type: 'text'
                }
              ]
            }
          ]
        }
      }
    }
  },
  methods: {
    createMenssageOnDatabase () {
      const messageText = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: this.$route.query.phone,
        type: 'text',
        text: { // the text object
          preview_url: false,
          body: this.operatorTextInput
        }
      }
      this.$store.dispatch('whatsapp/createMessage', messageText)
    },
    sendWhatsappMessage () {

    },
    getDateFromUnixTime (unixTime) {
      const date = new Date(unixTime * 1000)
      return `${date.getHours()}:${date.getMinutes()}`
    }
  }
}
</script>
