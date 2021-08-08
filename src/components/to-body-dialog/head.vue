<template>
  <div class="v-easy-dialog--head">
    <h2>{{ title }}</h2>
    <i class="el-icon-close" @click="handleClose"></i>
  </div>
</template>

<script>
export default {
  name: 'VeDialogHead',
  props: {
    title: String
  },
  methods: {
    handleClose() {
      this.$store.commit('survive/CHANGE_PROCESS', false)
    }
  }
}
</script>

<style scoped lang="less">
.v-easy-dialog {
  &--head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #303133;
    border-bottom: 1px solid #E4E7ED;
    h2 {
      font-size: 14px;
      margin: 0;
      padding-bottom: 4px;
      font-weight: normal;
      flex: 1;
    }
    i {
      cursor: pointer;
    }
  }
}
</style>
