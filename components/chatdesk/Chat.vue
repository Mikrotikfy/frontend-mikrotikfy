<template>
  <div class="parent-chat">
    <span>hola</span>
    <ChatdeskChatInput />
  </div>
</template>
<style scoped>
  .parent-chat {
    display: grid;
    height:100%;
    grid-auto-rows: 1fr 1fr;
    grid-gap: 10px;
    place-items: end center;
  }
</style>
