<template>
  <div :class="{ hidden: hidden }" class="pagination-container">
    <el-pagination
     class="msg-pagination-container"
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scroll-to'

export default {
  name: 'RecordPage',
  props: {
    total: {
      required: true,
      type: Number
    },
    page: {
      type: Number,
      default: 1
    },
    limit: {
      type: Number,
      default: 20
    },
    pageSizes: {
      type: Array,
      default() {
        return [10, 20, 30, 40]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    currentPage: {
      get() {
        return this.page
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
    pageSize: {
      get() {
        return this.limit
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
    handleSizeChange(val) {
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
    handleCurrentChange(val) {
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background:transparent;
  /* opacity: 0; */
  /* position: absolute; */
  /* bottom:0vw; */
  /* width: 100%;
  top: 5vw; */
  /* position:fixed; */
  /* bottom:0vw; */
  margin-top:1vw;
  width: 100%;
}
.pagination-container.hidden {
  display: none;
}
</style>

<style lang="scss" scoped>
// .el-pagination.is-background .el-pager li:not(.disabled).active {

// color: #ffffff;
// }

</style>
<style>
/* .msg-pagination-container.is-background *{
  height:1.456vw
} */
  .msg-pagination-container.is-background .el-pager li {

    background-color: #10263c;
    color: #FFF;
  }
  .msg-pagination-container.is-background .btn-next {

    background-color: #10263c;
    color: #FFF;
  }
  .msg-pagination-container.is-background .btn-prev {

    background-color: #10263c;
    color: #FFF;
  }
  .msg-pagination-container.is-background .el-pager li:not(.disabled).active {

    /* background-color: #446cff; */
    color: #fff;
  }

.msg-pagination-container.is-background .el-pagination__total{
  color:#ddd;
}
 .msg-pagination-container.is-background .el-pagination__jump{
  color:#ddd;
}
 
</style>
