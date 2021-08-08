<template>
  <div class="v-easy-dialog--body">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'VeDialogBody'
}
</script>

<style scoped lang="less">
.v-easy-dialog {
  &--body {
    margin-top: 10px;
  }
}
</style>
