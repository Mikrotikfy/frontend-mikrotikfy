<template>
  <div class="parent-chat">
    <ChatdeskChatInfo />
    <ChatdeskChatMessages />
    <ChatdeskChatInput />
  </div>
</template>
<style scoped>
  .parent-chat {
    display: grid;
    max-height:calc(100vh - 100px);
    grid-auto-rows: 1fr 20fr 1fr;
    grid-gap: 10px;
  }
</style>
