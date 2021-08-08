<template>
  <div>
    <el-breadcrumb class="app-breadcrumb" separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.path">
          <span
            v-if="
              item.redirect === 'noRedirect' || index == levelList.length - 1
            "
            class="no-redirect"
            >{{ item.meta.title }}</span
          >
        </el-breadcrumb-item>
      </transition-group>
      <!-- <el-button type="text" @click="dialogVisible = true"
        >设备下发失败人数：{{ device.total }}</el-button
      > -->
    </el-breadcrumb>

    <el-dialog
      title="设备下发数据"
      :visible.sync="dialogVisible"
      width="60%"
      :close-on-click-modal="false"
    >
      <el-button
        class="filter-item"
        type="primary"
        @click="handleIssued()"
        style="margin-bottom: 10px;"
        >全量下发</el-button
      >
      <el-table :data="device.list" style="width: 100%">
        <el-table-column prop="name" label="人员名称" >
        </el-table-column>
        <el-table-column prop="deviceName" label="设备名称" >
        </el-table-column>
        <el-table-column prop="deviceId" label="设备ID" >
        </el-table-column>
        <el-table-column fixed="right" label="操作" >
          <template slot-scope="scope">
            <el-button
              @click="handleIssued(scope.row)"
              type="text"
              size="small"
              :disabled="scope.row.status === '1'"
              >重新下发</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :total="device.total"
        :page.sync="query.page"
        :limit.sync="query.limit"
        @pagination="getDeviceError"
      />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <div class="top-nav" v-if="visitorNav">
      <el-menu
        :default-active="activeIndex"
        router
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in visitorRoute"
          :key="item.path"
          :index="item.name"
          :route="item"
          style="height: 50px;line-height: 50px"
          >{{ item.meta.title }}</el-menu-item
        >
      </el-menu>
    </div>

    <div class="top-nav" v-if="accreditNav">
      <el-menu
        :default-active="activeIndex"
        router
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
      >
        <el-menu-item
          v-for="item in accreditRoute"
          :key="item.path"
          :index="item.name"
          :route="item"
          style="height: 50px;line-height: 50px"
          >{{ item.meta.title }}</el-menu-item
        >
      </el-menu>
    </div>
  </div>
</template>

<script>
import pathToRegexp from 'path-to-regexp'
import { mapGetters } from 'vuex'
import accreditRoute from '@/views/accreditview/accreditview-route'
import visitorRoute from '@/views/visitorview/visitor-route'
import request from '@/utils/request'
import Pagination from '@/components/Pagination'
import { issued } from '@/api/device'
import { updatePage } from '@/utils/update-page'

export default {
  components: { Pagination },
  data() {
    return {
      levelList: null,
      visitorNav: false,
      accreditNav: false,
      device: {},
      dialogVisible: false,
      query: {
        page: 1,
        limit: 10
      }
    }
  },
  computed: {
    ...mapGetters(['permission_routes']),
    accreditRoute() {
      // console.log(this.permission_routes)
      return accreditRoute
    },
    visitorRoute() {
      return visitorRoute
    },
    activeIndex() {
      const { name } = this.$route
      return name
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  created() {
    this.getBreadcrumb()
    // updatePage(this.getDeviceError, true)
  },
  methods: {
    handleIssued(row) {
      if (row){
        row.status = '1'
      }
      if (this.device.length==0){
        this.$message({
          message: '无可下发人员！',
          type: 'warning'
        });
        return ;
      }

      const data = row ? [row] : []
      return issued(data).then(v => {
        this.$message({
          type: v.code === 200 ? 'success' : 'error',
          message: v.code === 200 ? '下发成功' : '下发失败'
        })
        this.getDeviceError()
      })
    },
    getDeviceError() {
      return request({
        method: 'post',
        url: '/device/info/search/not_issued_staff',
        data: this.query
      }).then(v => {
        console.log(v.data)
        this.device = v.data
        return v.data
      })
    },
    handSelect(key, keyPath) {
      if (key == '1') {
        this.$router.push('/visitor/accredit/accreditvisitor')
      } else if (key == '2') {
        this.$router.push('/visitor/accredit/accreditstaff')
      }
    },

    handleSelect(key, keyPath) {},

    getBreadcrumb() {
      // if (this.$route.mate.navbarinfo === "visitor") {
      //   this.visitorNav = true;
      // }
      if (this.$route.matched[1].meta.title === '访客信息') {
        this.visitorNav = true
        this.accreditNav = false
      } else if (this.$route.matched[1].meta.title === '授权名单') {
        this.accreditNav = true
        this.visitorNav = false
      } else {
        this.visitorNav = false
        this.accreditNav = false
      }
      // only show routes with meta.title
      let matched = this.$route.matched.filter(
        item => item.meta && item.meta.title
      )
      const first = matched[0]

      if (!this.isDashboard(first)) {
        matched = [{ path: '/dashboard', meta: { title: 'Dashboard' } }].concat(
          matched
        )
      }

      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      )
    },
    isDashboard(route) {
      const name = route && route.name
      if (!name) {
        return false
      }
      return name.trim().toLocaleLowerCase() === 'Dashboard'.toLocaleLowerCase()
    },
    pathCompile(path) {
      // To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
      const { params } = this.$route
      var toPath = pathToRegexp.compile(path)
      return toPath(params)
    },
    handleLink(item) {
      const { redirect, path } = item
      if (redirect) {
        this.$router.push(redirect)
        return
      }
      this.$router.push(this.pathCompile(path))
    }
  }
}
</script>

<style lang="scss" scoped>
.top-nav {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.app-breadcrumb.el-breadcrumb {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  line-height: 50px;
  margin-left: 8px;
  padding-right: 20px;
  >>> &::before {
    display: none;
  }
  >>> &::after {
    display: none;
  }

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
