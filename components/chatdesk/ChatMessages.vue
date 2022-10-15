<template>
  <div class="parent-chat-message">
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
    <ChatdeskOwnBubble class="own-message" />
    <ChatdeskThirdPartyBubble class="partner-message" />
  </div>
</template>
<style scoped>
  .parent-chat-message {
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    width:100%;
    height: 100%;
    overflow-y: scroll;
    position:relative;
    bottom:0;
  }
  .own-message {
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    width:100%;
    place-self: end;
  }
  .partner-message {
    display: grid;
    grid-auto-rows: 1fr;
    grid-gap: 10px;
    width:100%;
  }
</style>
