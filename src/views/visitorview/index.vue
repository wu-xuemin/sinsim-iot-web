<template>
  <div>
    <!--<div class="vis-title">
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
import visitorRoute from './visitor-route'

export default {
  data() {
    return {

    }
  },
  computed: {
    key() {
      return this.$route.path
    },
    title() {
      return visitorRoute
    },
    activeIndex() {
      const { name } = this.$route
      return name
    }
  },
  beforeMount() {
    console.log(this.title)
  },
  methods: {
    handleSelect() {

    }
  }
}
</script>

<style scoped lang="sass">
  .vis-title
    padding: 4px
</style>
