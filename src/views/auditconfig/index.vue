<template>
  <div class="app-container">
    <!--<div style="margin-bottom: 20px;">
      <el-button size="small" @click="addTab(editableTabsValue)">新增</el-button>
    </div>-->
    <el-tabs
      v-model="editableTabsValue"
      type="card"
      @tab-remove="removeTab"
      @tab-click="clickTab"
      closable
      addable
      @tab-add="addTab(editableTabsValue)"
    >
      <el-tab-pane
        v-for="item in editableTabs"
        :key="item.id"
        :label="item.regionName"
        :name="item.index"
      >
        <div style="color: #a29e9e;">
          <div class="audit-type">
            <div>审核类型：</div>
            <el-select v-model="item.processType" placeholder="请选择">
              <el-option
                v-for="item in processTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="step-item">
            <div class="step">
              <div class="el-step__icon is-text">
                <div class="el-step__icon-inner">1</div>
              </div>
              <div class="step-center">上级审核</div>

              <el-switch
                v-model="item.auditLeaderEnable"
                active-color="#2c71ab"
                inactive-color="#DBDFE6"
              />
            </div>
            <div @click="tableSho" style="color: #66b1ff;">审核名单</div>
          </div>
          <p class="text-p">注：如果打开【一键审核】，超级管理员可直接审核全部流程</p>

          <div class="step-item">
            <div class="step">
              <div class="el-step__icon is-text">
                <div class="el-step__icon-inner">2</div>
              </div>
              <div class="step-center">区域管理员审核</div>
              <el-switch
                v-model="item.auditRegionCheckEnable"
                active-color="#2c71ab"
                inactive-color="#DBDFE6"
              />
            </div>
            <div class="item-info">
              <el-select
                v-model="item.staffAuthIds"
                multiple
                filterable
                allow-create
                collapse-tags
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item in staffAuthInfoOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>

          <div class="step-item">
            <div class="step">
              <div class="el-step__icon is-text">
                <div class="el-step__icon-inner">3</div>
              </div>
              <div class="step-center">超级管理员审核</div>
              <el-switch
                v-model="item.managersEnable"
                active-color="#2c71ab"
                inactive-color="#DBDFE6"
              />
            </div>
            <div class="step">
              <div>一键审核</div>
              <el-switch
                v-model="item.managersKeyAudit"
                active-color="#2c71ab"
                inactive-color="#DBDFE6"
                @change="v => handleChange(item, v)"
              />
            </div>
            <div class="item-info">
              <p class="text-p">注：【上级审核】名单为全局</p>
              <div style="margin-top: 31px;">
                <el-select
                  v-model="item.managers"
                  multiple
                  filterable
                  allow-create
                  collapse-tags
                  default-first-option
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in staffAuthInfoOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </div>
          </div>

          <div class="step-item">
            <div class="step">
              <div class="el-step__icon is-text">
                <div class="el-step__icon-inner">4</div>
              </div>
              <div class="step-center">设备列表</div>
            </div>
            <div class="item-info" style="width: 100%;
    justify-content: end;">
              <el-select
                v-model="item.deviceIds"
                multiple
                filterable
                allow-create
                collapse-tags
                default-first-option
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>

          <div v-if="editableTabs.length > 0" style="float: center;margin-top: 30px;">
            <el-button size="small" @click="handlesave(item)">保存</el-button>
          </div>
        </div>

        <div v-if="tableShow" class="tableshow">
          <div style="margin-top: 30px;">
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              round
              @click="handleCreate"
            ></el-button>
            <el-table :data="tableData" style="width: 100%">
              <el-table-column label="ID" type="index" width="50"></el-table-column>
              <el-table-column prop="name" label="姓名" width="180" align="center" />
              <el-table-column prop="staffPhone" label="手机号" align="center" />
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <el-button
                    icon="el-icon-delete"
                    type="danger"
                    round
                    @click="removeLeader(scope.row.id)"
                  />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="新增名称">
          <el-input v-model="form.regionName" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRegion,
  getCheckLeader,
  getStaffAuthInfos,
  delLeaderStaffId,
  addRegion,
  updateRegion,
  delRegion,
  checkRegionName
} from '@/api/visitor'

import { getDeviceList } from '@/api/device'

export default {
  data() {
    return {
      tableShow: false,
      form: {
        regionName: '',
        id: '',
        valid: true,
        auditLeaderEnable: false,
        managers: [],
        managersKeyAudit: false,
        managersEnable: false,
        auditRegionCheckEnable: false,
        deviceIds: [],
        auditRegionCheck: false,
        staffAuthIds: [],
        processType: '1'
      },
      dialogVisible: false,
      tableData: [],
      processTypeOptions: [
        { value: '1', label: '正常流程' },
        { value: '2', label: 'ipad登记' }
      ],
      staffAuthInfoOptions: [],
      options: [],
      value: '',
      value1: true,
      editableTabsValue: '0',
      editableTabs: [],
      tabIndex: 0
    }
  },
  created() {
    this.getRegion()
    this.getCheckLeader()
    this.getStaffAuthInfos()
    this.getDeviceList()
  },
  methods: {
    handleChange(item, v) {
      if (v) {
        item.managersEnable = true
      }
    },
    //新增
    handleCreate() {},
    //点击tab
    clickTab() {
      this.tableShow = false
    },
    //显示表格
    tableSho() {
      this.tableShow = true
    },
    getDeviceList() {
      getDeviceList()
        .then(res => {
          if (res.code === 200) {
            var devices = res.data
            for (var i = 0; i < devices.length; i++) {
              this.options.push({
                label: devices[i].deviceName,
                value: devices[i].deviceId
              })
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getStaffAuthInfos() {
      getStaffAuthInfos()
        .then(res => {
          if (res.code === 200) {
            var staffAuthInfos = res.data.list
            for (var i = 0; i < staffAuthInfos.length; i++) {
              this.staffAuthInfoOptions.push({
                label: staffAuthInfos[i].name,
                value: staffAuthInfos[i].id
              })
            }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getRegion() {
      getRegion()
        .then(res => {
          var list = res.data.list
          for (var i = 0; i < list.length; i++) {
            if (list[i].staffAuthIds === null || list[i].staffAuthIds === '') {
              list[i].staffAuthIds = []
            } else {
              list[i].staffAuthIds = list[i].staffAuthIds.split(',')
            }
            if (list[i].managers === null || list[i].managers === '') {
              list[i].managers = []
            } else {
              list[i].managers = list[i].managers.split(',')
            }
            if (list[i].deviceIds === null || list[i].deviceIds === '') {
              list[i].deviceIds = []
            } else {
              list[i].deviceIds = list[i].deviceIds.split(',')
            }
          }
          this.editableTabs = list
          console.log(this.editableTabs)
        })
        .catch(err => {
          console.log(err)
        })
    },
    confirm() {
      checkRegionName(this.form.regionName)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.dialogVisible = false
            const newTabName = ++this.tabIndex + ''
            this.form.id = newTabName
            this.editableTabs.push(this.form)
            console.log(this.editableTabs)
            this.editableTabsValue = newTabName
          } else {
            this.$alert('区域名称命名重复', '区域名称', {
              confirmButtonText: '确定',
              callback: action => {
                console.log(this.form.regionName)
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
    },
    addTab(targetName) {
      this.dialogVisible = true
    },
    removeTab(targetName) {
      const tabs = this.editableTabs
      if (targetName.length > 10) {
        delRegion(targetName)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
      this.editableTabs = tabs.filter(tab => tab.id !== targetName)
    },
    getCheckLeader() {
      getCheckLeader()
        .then(res => {
          if (res.code === 200) {
            this.tableData = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    removeLeader(staffId) {
      delLeaderStaffId(staffId)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 保存
    handlesave(infoRegion) {
      var info = Object.assign({}, infoRegion)
      info.deviceIds = info.deviceIds.join(',')
      info.managers = info.managers.join(',')
      info.staffAuthIds = info.staffAuthIds.join(',')
      if (info.id === null || info.id.length < 10) {
        addRegion(info)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        updateRegion(info)
          .then(res => {
            if (res.code === 200) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
            }
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.audit-type {
  display: flex;
  align-items: center;
  margin-top: 30px;
}

.el-tab-pane {
  display: grid;
  grid-template-columns: 30% 70%;
}

.step-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 30px;
  margin-bottom: 30px;
  .step {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.text-p {
  color: #2b71ab;
  font-size: 12px;
  text-align: left;
  font-family: SourceHanSansSC-regular;
}
.item-info {
  margin-top: 25px;
}
.tableshow {
  margin-left: 20px;
}
.step-center {
  margin-left: 12px;
  margin-right: 12px;
}
</style>
