<template>
  <transition name="fade">
    <div
      v-show="visible"
      :class="['v-easy-dialog', placementClass]">
      <dialog-head :title="title" />
      <dialog-body>
        <slot name="body" />
      </dialog-body>
      <dialog-footer />
    </div>
  </transition>
</template>

<script>
import DialogHead from './head'
import DialogBody from './body'
import DialogFooter from './footer'

export default {
  name: 'VeDialog',
  components: {
    DialogHead,
    DialogBody,
    DialogFooter
  },
  props: {
    title: {
      type: String,
      default: '提示'
    },
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    placement: {
      type: String,
      default: 'right-bottom'
    }
  },
  computed: {
    placementClass() {
      return 'v-easy-dialog--' + this.placement
    }
  },
  watch: {
    visible(visible) {
      if (visible) {
        document.body.appendChild(this.$el)
      } else {
        this.removeNode()
      }
    }
  },
  mounted() {
    if (this.visible) {
      document.body.appendChild(this.$el)
    }
  },
  destroyed() {
    this.removeNode()
  },
  methods: {
    removeNode() {
      if (this.$el && document.body.contains(this.$el)) {
        document.body.removeChild(this.$el)
      }
    }
  }
}
</script>

<style scoped lang="less">
.v-easy {
  &-dialog {
    position: fixed;
    box-sizing: border-box;
    padding: 10px;
    box-shadow: 0 1px 3px 3px #e8e8e8;
    background-color: #ffffff;
    z-index: 999;
    &--right-bottom {
      right: 10px;
      bottom: 10px;
    }
    &--right-top {
      top: 10px;
      right: 10px;
    }
    &--left-bottom {
      left: 10px;
      bottom: 10px;
    }
    &--left-top {
      top: 10px;
      left: 10px;
    }
  }
}
</style>
