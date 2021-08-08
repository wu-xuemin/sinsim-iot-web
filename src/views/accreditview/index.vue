<template>
  <div>
    <!--<div class="acc-title">
      <el-menu :default-active="activeIndex" router class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item v-for="item in title" :key="item.path" :index="item.name" :route="item">{{ item.meta.title }}</el-menu-item>
      </el-menu>
    </div>-->
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </div>
</template>

<script>
import accredit from './accreditview-route'

export default {
  computed: {
    key() {
      return this.$route.path
    },
    title() {
      return accredit
    },
    activeIndex() {
      const { name } = this.$route
      return name
    }
  },
  methods: {
    handleSelect() {

    }
  }
}
</script>

<style scoped lang="sass">
  .acc-title
    padding: 4px
</style>
