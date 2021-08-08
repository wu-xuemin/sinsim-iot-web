/* eslint-disable vue/no-parsing-error */
/* eslint-disable vue/no-parsing-error */
<template>
  <div class="app-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>迁入规则</span>
      </div>
      <div>
        <el-form ref="form" :model="formCheckIn" label-width="80px" :validate="editConfigCheckIn">
          <el-form-item>
            <el-radio-group v-model="formCheckIn.resource">
              <el-radio v-model="formCheckIn.resource" :label="0">到点迁入</el-radio>
              <el-radio v-model="formCheckIn.resource" :label="1">人证核验迁入</el-radio>
              <el-radio v-model="formCheckIn.resource" :label="2">验证码/二维码迁入</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div class="el-radio__label el-radio">到点提前迁入时间：</div>
            <el-select v-model="formCheckIn.date" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-button v-on:click="editConfigCheckIn">提交</el-button>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>迁出规则</span>
      </div>
      <div>
        <el-form ref="form" :model="formCheckOut" label-width="80px">
          <el-form-item>
            <el-radio-group v-model="formCheckOut.resource">
              <el-radio v-model="formCheckOut.resource" :label="0">到点迁出</el-radio>
              <el-radio v-model="formCheckOut.resource" :label="1">验证码/二维码迁出</el-radio>
              <el-radio v-model="formCheckOut.resource" :label="2">验证码/指定设备识别后迁出</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <div class="el-radio__label el-radio">到点延迟迁出时间：</div>
            <el-select v-model="formCheckOut.date" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <div class="el-radio__label el-radio">指定设备：</div>
            <el-select v-model="formCheckOut.device" placeholder="请选择">
              <el-option
                v-for="item in deviceOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <el-button v-on:click="editConfigCheckOut">提交</el-button>
    </el-card>
  </div>
</template>
<script>
import { getDeviceList } from '@/api/device'
import {
  getConfigCheckIn,
  getConfigCheckOut,
  editCheckIn,
  editCheckOut
} from '@/api/visitor'

export default {
  data() {
    return {
      formCheckIn: {
        date: '',
        resource: ''
      },
      formCheckOut: {
        date: '',
        resource: '',
        device: ''
      },
      options: [
        {
          value: 1,
          label: '1小时'
        },
        {
          value: 2,
          label: '2小时'
        },
        {
          value: 3,
          label: '3小时'
        }
      ],
      deviceOptions: [],
      value: ''
    }
  },
  methods: {
    editConfigCheckIn() {
      editCheckIn(this.formCheckIn)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    editConfigCheckOut() {
      editCheckOut(this.formCheckOut)
        .then(res => {
          if (res.code === 200) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getConfigCheckIn() {
      getConfigCheckIn()
        .then(res => {
          if (res.code === 200) {
            this.formCheckIn = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getConfigCheckOut() {
      getConfigCheckOut()
        .then(res => {
          if (res.code === 200) {
            this.formCheckOut = res.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    getDeviceList() {
      getDeviceList()
        .then(res => {
          if (res.code === 200) {
            var devices = res.data
            for (var i = 0; i < devices.length; i++) {
              this.deviceOptions.push({
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
    onSubmit() {
      console.log('submit!')
    }
  },
  created() {
    this.getDeviceList()
    this.getConfigCheckIn()
    this.getConfigCheckOut()
  }
}
</script>
