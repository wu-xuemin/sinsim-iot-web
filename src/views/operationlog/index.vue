<template>
  <div class="app-container">
    <div class="filter-container">
      <el-date-picker
        v-model="time"
        type="datetimerange"
        range-separator="至"
        value-format="yyyy-MM-dd HH:mm:ss"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="getLogList"
      ></el-date-picker>

      <el-input
        v-model="listQuery.condition"
        style="width: 200px;"
        class="filter-item"
        placeholder="请输入用户名称"
        @keyup.enter.native="getLogList"
        prefix-icon="el-icon-search"
        clearable
      />
      <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="getLogList"
            >搜索</el-button
      >
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        @click="handleDownload"
        >导出</el-button
      >
    </div>

    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="name" label="操作用户">
        <template slot-scope="{ row }">
          <span>{{ row.operator }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="module" label="操作模块">
        <template slot-scope="{ row }">
          <span>{{ row.module }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="type" label="类型">
        <template slot-scope="{ row }">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column> -->
      <el-table-column prop="name" label="操作内容" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.message }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="操作时间" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.recordTime | time}}</span>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getLogList"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination";

import { getLogSearch, exportLog } from "@/api/logRecord";
import { updatePage } from '@/utils/update-page'
import Cookies from 'js-cookie'

export default {
  name: "Operationlog",
  computed: {
    ...mapGetters(["name"])
  },
  directives: { waves },
  components: { Pagination },
  created() {
    this.defaultDate();
    updatePage(this.getLogList)
  },
  data() {
    return {
      total: 0,
      downloadLoading: false,
      listQuery: {
        condition: "",
        beginTime: "",
        endTime: "",
        type: "",
        module: "",
        page: 0,
        limit: 10
      },
      skills: [],
      value1: "",
      time: [],
      tableData: []
    };
  },
  filters: {
    // 转化时间戳
    time(value) {
      let date = new Date(value)
      let Y = date.getFullYear() + '-'
      let M =
        (date.getMonth() + 1 < 10
          ? '0' + (date.getMonth() + 1)
          : date.getMonth() + 1) + '-'
      let D =
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
      let h =
        (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
      let m =
        (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) +
        ':'
      let s =
        date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
      return Y + M + D + h + m + s
    },
  },
  methods: {
    async handleDownload() {
      const account = JSON.parse(Cookies.get('User')).account
      const {data} = await exportLog(account, this.listQuery)
      if (data) {
        window.open(data, '_black')
      }
    },

    getLogList() {
      console.log(this.time)
      if (this.time != null) {
        this.listQuery.beginTime = Number(new Date(this.time[0]))
        this.listQuery.endTime = Number(new Date(this.time[1]))
      } else {
        this.listQuery.beginTime = "";
        this.listQuery.endTime = "";
      }
      console.log(this.listQuery)
      return getLogSearch(this.listQuery)
        .then(res => {
          if (res.code == 200) {
            this.tableData = res.data.list;
            this.total = res.data.total;
          }
          return res
        })
        .catch(err => {
          console.log(err);
        });
    },
    defaultDate() {
      const date = new Date();
      const year = date.getFullYear().toString();
      const month =
        date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1).toString()
          : (date.getMonth() + 1).toString();
      const da =
        date.getDate() < 10
          ? "0" + date.getDate().toString()
          : date.getDate().toString();
      const end =
        year +
        "-" +
        month +
        "-" +
        da +
        " " +
        date.getHours() +
        ":" +
        date.getMinutes() +
        ":" +
        date.getSeconds();
      const beg = year + "-" + month + "-01" + " 00:00:00";
      console.log("当天:" + beg);
      this.time = [beg, end];
      this.getLogList();
    }
  }
};
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
