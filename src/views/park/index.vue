<template>
  <div id="twolines">
    <div class="app-container">
      <div class="app-left outer-height-limited">
        <div class="tag inner-height-limited">
          <div class="tag-top">
            <div class="tag-h3">单位</div>
            <i class="el-icon-more" @click="handleTagInfo"></i>
          </div>
          <el-input
            v-model="tagQuery.condition"
            placeholder="请输入单位名称"
            prefix-icon="el-icon-search"
            @keyup.native="getTagList"
            clearable
          ></el-input>
          <div>
            <el-checkbox
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <div style="margin: 15px 0"></div>
            <el-checkbox-group
              v-model="checkedCities"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                class="checkboxSp"
                style="display: block"
                v-for="(city,index) in cities"
                :label="city"
                :key="index"
                >{{ city }}</el-checkbox
              >
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div>
        <div class="filter-container">
          <el-input
            v-model="parkQuery.name"
            style="width: 300px"
            class="filter-item"
            placeholder="输入要查找的园区"
            @keyup.enter.native="getParkSearch"
            prefix-icon="el-icon-search"
            clearable
          />

          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="getParkSearch"
            >搜索</el-button
          >

          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="handleCreate"
            >添加园区</el-button
          >
        </div>

        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="园区名称" prop="parkName" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.parkName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="单位" prop="id" align="center">
            <template slot-scope="{ row }">
              <el-tooltip placement="top">
                <div slot="content">
                  <el-tag
                    style="margin: 5px"
                    v-for="tagName in getTagNameByTagId(row.unit)"
                    :key="tagName"
                    >{{ tagName }}</el-tag
                  >
                </div>
                <div>
                  <el-tag
                    style="margin: 5px"
                    v-for="tagName in getTagNameByTagId(row.unit).slice(0, 3)"
                    :key="tagName"
                    >{{ tagName }}</el-tag
                  >
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" prop="createTime" align="center">
            <template slot-scope="{ row }">
              <span>{{ (row.createTime * 1000) | time }}</span>
            </template>
          </el-table-column>
          <el-table-column label="更新时间" prop="updateTime" align="center">
            <template slot-scope="{ row }">
              <span
                v-if="
                  row.updateTime != 0 &&
                  row.updateTime != null &&
                  row.updateTime != ''
                "
                >{{ (row.updateTime * 1000) | time }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label=""
            align="center"
            class-name="small-padding fixed-width"
            width="200"
          >
            <template slot-scope="{ row, $index }">
              <i
                class="el-icon-edit"
                style="margin-right: 20px; cursor: pointer"
                @click="handleUpdate(row)"
              ></i>
              <i
                class="el-icon-delete"
                style="cursor: pointer"
                @click="handleDelete(row, $index)"
              ></i>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          :total="total"
          :page.sync="parkQuery.page"
          :limit.sync="parkQuery.size"
          @pagination="getParkSearch"
        />
      </div>

      <el-dialog
        :title="dialogStaffName"
        :visible.sync="dialogFormVisible"
        :before-close="handleClose"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="right"
          label-width="90px"
          style="width: 400px; margin-left: 50px"
        >
          <el-form-item label="园区名:" prop="parkName">
            <el-input v-model="temp.parkName" @blur="checkParkNameN" />
          </el-form-item>
          <el-form-item label="单位:" prop="tagIds">
            <el-select
              v-model="temp.unit"
              multiple
              filterable
              default-first-option
              placeholder="请选择标签"
              style="width: 100%"
              clearable
            >
              <el-option
                v-for="item in tagList"
                :key="item.tagId"
                :label="item.tagName"
                :value="item.tagId"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseStaffDialog">取消</el-button>
          <el-button
            type="primary"
            @click="dialogStatus === 'create' ? createData() : updateData()"
            :loading="butLoading"
            >确认</el-button
          >
        </div>
      </el-dialog>

      <el-dialog
        title="提示"
        :visible.sync="deleteConfirmVisible"
        width="400px"
      >
        <span>
          确认要删除[
          <b>{{ this.temp.name }}</b> ]吗？
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteConfirmVisible = false" icon="el-icon-close"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="deleteData"
            icon="el-icon-check"
            :loading="butLoading"
            >确 定</el-button
          >
        </span>
      </el-dialog>

      <el-dialog title="编辑单位" :visible.sync="dialogTagVisible">
        <el-row>
          <el-button
            class="filter-item"
            style="margin-left: 10px"
            type="primary"
            @click="handleCreateTag"
            >添加</el-button
          >
        </el-row>
        <el-table :data="tagCities" style="width: 100%">
          <el-table-column property="areaName" label="单位名称" align="center">
            <template slot-scope="{ row }">
              <span>{{ row.tagName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="{ row, $index }">
              <i
                class="el-icon-edit"
                style="margin-right: 20px; cursor: pointer"
                @click="handleUpdateTag(row)"
              ></i>
              <i
                class="el-icon-delete"
                style="cursor: pointer"
                @click="deleteTagInfo(row, $index)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          :total="tagTotal"
          :page.sync="tagInfoQuery.page"
          :limit.sync="tagInfoQuery.limit"
          @pagination="getTagInfoSearch"
        />
      </el-dialog>

      <el-dialog :title="dialogTagName" :visible.sync="tagDialogVisible">
        <el-form
          :model="tagInfo"
          label-position="right"
          label-width="90px"
          style="width: 400px; margin-left: 50px"
        >
          <el-form-item label="单位名称">
            <el-input
              v-model="tagInfo.tagName"
              @change="checkTagInfo"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseTagVisible">取 消</el-button>
          <el-button
            type="primary"
            @click="dialogTagStatus === 'create' ? createTag() : updateTag()"
            :disabled="addTagBtn"
            >确 定</el-button
          >
        </div>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination'
import Cookies from 'js-cookie'

import {
  getStaffSearch,
  addStaff,
  updateStaff,
  deleteStaff,
  checkCard,
  checkStaffNumber,
} from '@/api/staff'
import {
  getTagSearch,
  getTagList,
  addTag,
  updateTag,
  deleteTag,
  checkTagName,
} from '@/api/staff'
import {
  getParkSearch,
  updatePark,
  addPark,
  deletePark,
  checkParkName,
} from '@/api/park'
import { getAreaList } from '@/api/device'
import { staffExport } from '@/api/export'
import {
  uploadFile,
  uploadImage,
  feachImage,
  getTagNameByTagId,
  getParkNameByParkId,
  verifyValue,
  verifyStaffNum,
  verifyNum,
} from '@/api/util'
import { getToken } from '@/utils/auth'
import { updatePage } from '@/utils/update-page'
import request from '@/utils/request'

let cityOptions = []
const temp = {
  parkName: '',
  unit: '',
}

export default {
  name: 'Employee',
  components: { Pagination },
  directives: { waves },
  data() {
    var pat = /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (value === '') {
        if (rule.field == 'parkName') {
          callback(new Error('园区名不能为空'))
        }
      } else if (pat.test(value)) {
        if (rule.field == 'name') {
          callback(new Error('姓名不能包含特殊字符'))
        }
      } else {
        callback()
      }
    }

    var validateNum = (rule, value, callback) => {
      if (!value) {
        callback(new Error('工号不能为空'))
      } else if (pat.test(value)) {
        callback(new Error('工号不能包含特殊字符'))
      } else {
        callback()
      }
    }

    var validateTag = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择标签'))
      } else {
        callback()
      }
    }

    return {
      staffImage: '',
      getToken: getToken,
      uploadLoading: false,
      uploadFile: '',
      uploadImage: '',
      pShow: false,
      staffExportData: '',
      checkAll: true,
      checkedCities: cityOptions,
      cities: cityOptions,
      isIndeterminate: false,
      staffNumberShow: false,
      dialogStaffName: '创建园区',
      uploadDisabled: false,
      imageUploadUrl: '',
      fileList: [],
      butLoading: false,
      deleteConfirmVisible: false,
      text: '',
      input: '',
      dialogImageUrl: '',
      dialogVisible: false,
      dialogTagVisible: false,
      dialogTagStatus: 'create',
      dialogTagName: '创建单位',
      tagDialogVisible: false,
      tagList: [],
      tagIds: [],
      tagCheckAll: false,
      tagCities: [],
      tagIsIndeterminate: true,
      total: 0,
      staffQuery: {
        condition: '',
        tagIds: [],
        areaIds: [],
        type: 'STAFF',
        page: 1,
        limit: 10,
      },
      tagQuery: {
        condition: '',
        tagType: 'STAFF',
        page: 0,
        limit: 0,
      },
      tagInfoQuery: {
        tagType: 'STAFF',
        page: 1,
        limit: 10,
      },
      tagListQuery: {
        tagType: 'STAFF',
        page: 0,
        limit: 0,
      },
      tagTotal: 0,
      temp: temp,
      tagInfo: {
        tagId: '',
        tagName: '',
        tagType: 'STAFF',
      },
      downloadLoading: false,
      tableData: [],
      dialogFormVisible: false,
      rules: {
        parkName: [
          { required: true, validator: validateForm, trigger: 'blur' },
        ],
        unit: [{ required: true, message: '请选择单位', trigger: 'change' }],
      },
      status: false,
      cardNumStatus: true,
      account: '',
      imageUrl: '',
      addTagBtn: false,
      dialogstatus: '',
      parkQuery: {
        tagIds: [],
        name: null,
        page: 1,
        size: 10,
      },
      parkList: [],
    }
  },
  created() {
    //1、定时查询人员
    updatePage(this.getParkSearch, true)
    //标签
    getTagSearch(this.tagQuery)
      .then((res) => {
        this.tagList = res.data.list
        let tagList = res.data.list
        cityOptions.splice(0)

        tagList.forEach((p) => {
          cityOptions.push(p.tagName)
        })
        this.parkQuery.tagIds = []
        this.getParkSearch()
      })
      .catch((err) => {
        console.log(err)
      })
    this.getTagInfoSearch()
    this.getTagInfoList()
    this.getParkList()
    this.account = JSON.parse(Cookies.get('User')).account
    this.uploadFile = uploadFile()
    this.uploadImage = uploadImage()
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
      return Y + M + D
    },
  },
  methods: {
    //文件导入失败
    handleError() {
      this.$store.commit('survive/CHANGE_PROCESS_CODE', 'exception')
      this.uploadLoading = false
      this.$message.error('文件导入失败')
    },

    //上传文件之前的钩子
    handleGress(file) {
      if (file.name.indexOf('.zip') != -1) {
        this.uploadLoading = true
        this.$store.commit('survive/CHANGE_PROCESS', true)
        this.$store.commit('survive/CHANGE_PROCESS_CODE', 'loading')
        return true
      } else {
        this.$message({
          showClose: true,
          message: '文件格式错误，请上传zip压缩包',
          type: 'error',
        })
        return false
      }
    },

    //文件导入成功
    handleSuccessUpload(response, file, fileList) {
      this.uploadLoading = false
      if (response.code === 400) {
        this.$store.commit('survive/CHANGE_PROCESS_CODE', 'exception')
        this.$store.commit('survive/CHANGE_ERROR_MESSAGE', response.message)
      } else {
        this.$store.commit('survive/CHANGE_PROCESS_CODE', 'success')
      }
    },
    //显示更新
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.unit = this.temp.unit.length ? this.temp.unit.split(',') : []
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    },
    //更新
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.unit = this.temp.unit.join(',')
          this.butLoading = true

          updatePark(this.account, this.temp)
            .then((res) => {
              this.dialogFormVisible = false
              this.$message({
                message: '修改成功',
                type: 'success',
              })
              this.butLoading = false
              this.tagIds = []
              this.getParkSearch()
            })
            .catch((err) => {
              this.butLoading = false
              console.log(err)
            })
        }
      })
    },
    //显示删除
    handleDelete(row) {
      this.deleteConfirmVisible = true
      this.temp = row
    },
    //删除
    deleteData() {
      this.butLoading = true
      deletePark(this.account, this.temp.parkId)
        .then((res) => {
          if (res.code == 200) {
            this.deleteConfirmVisible = false
            this.$message({
              message: '删除成功',
              type: 'success',
            })
            this.butLoading = false
            this.getParkSearch()
          }
        })
        .catch((err) => {
          this.butLoading = false
          console.log(err)
        })
    },
    //显示添加
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.dialogStaffName = '创建园区'
      this.$nextTick(() => {
        this.temp = JSON.parse(JSON.stringify(temp))
        this.$refs.dataForm.resetFields()
      })
    },

    // 添加
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          //       this.temp.entryTime = (new Date()).valueOf()
          // this.temp.birthday = (new Date()).valueOf()
          this.temp.unit = this.temp.unit.join(',')
          this.butLoading = true
          addPark(this.account, this.temp)
            .then((res) => {
              this.dialogFormVisible = false
              this.$message({
                message: '添加成功',
                type: 'success',
              })
              this.butLoading = false
              this.tagIds = []
              this.getParkSearch()
            })
            .catch((err) => {
              this.butLoading = false
              console.log(err)
            })
        } else {
          this.butLoading = false
        }
      })
    },

    //检查卡号
    checkCardNum() {
      if (
        this.temp.cardNumber != null &&
        this.temp.cardNumber != '' &&
        dialogStatus === 'create'
      ) {
        checkCard(this.temp.cardNumber)
          .then((res) => {
            if (res.data == true) {
              this.cardNumStatus = res.data
              this.$message.error('当前卡号已存在')
              this.temp.cardNumber = ''
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    //检查员工工号
    checkParkNameN() {
      if (this.temp.parkName != null && this.temp.parkName != '') {
        checkParkName(this.temp.parkName)
          .then((res) => {
            if (res.code == 200) {
              console.log(res)
              this.status = res.data

              if (this.status) {
                this.temp.parkName = ''
                this.$message.error('当前园区已存在')
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    //检查标签
    checkTagInfo() {
      if (this.tagInfo.tagName != null && this.tagInfo.tagName != '') {
        checkTagName(this.tagInfo.tagType, this.tagInfo.tagName)
          .then((res) => {
            if (res.code == 200) {
              let exitsts = res.data
              this.addTagBtn = exitsts
              if (exitsts) {
                this.$message.error('当前单位已存在')
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
      }
    },
    //导出
    handleDownload() {
      staffExport(this.account, this.staffQuery)
        .then((res) => {
          if (res.code == 400) {
            this.$message.error('导出失败')
          } else {
            window.location.href = res.data
          }
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //员工列表
    getParkSearch() {
      return getParkSearch(this.parkQuery)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
          return res
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //标签
    getTagInfoSearch() {
      getTagSearch(this.tagInfoQuery)
        .then((res) => {
          this.tagCities = res.data.list
          this.tagTotal = res.data.total
        })
        .catch((err) => {
          console.log(err)
        })
    },
    //标签
    getTagInfoList() {
      getTagSearch(this.tagQuery)
        .then((res) => {
          let tagList = res.data.list
          cityOptions.splice(0)
          tagList.forEach((p) => {
            cityOptions.push(p.tagName)
          })
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getTagList() {
      // getTagSearch(this.tagListQuery)
      getTagSearch(this.tagQuery)
        .then((res) => {
          this.tagList = res.data.list
          let tagList = res.data.list
          cityOptions.splice(0)
          this.parkQuery.tagIds.splice(0)
          tagList.forEach((p) => {
            cityOptions.push(p.tagName)
            this.parkQuery.tagIds.push(p.tagId)
          })
          this.getParkSearch()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    getParkList() {
      // getTagSearch(this.tagListQuery)
      getParkSearch(this.parkQuery)
        .then((res) => {
          this.parkList = res.data.list
        })
        .catch((err) => {
          console.log(err)
        })
    },

    //标签全选
    handleCheckAllChange(val) {
      this.checkedCities = val ? cityOptions : []
      this.isIndeterminate = false
      if (val) {
        this.parkQuery.tagIds = []
      }
      if (this.checkedCities.length > 0) {
        this.getParkSearch()
      } else {
        this.parkQuery.tagIds = []
        this.getParkSearch()
      }
    },
    //标签选择
    handleCheckedCitiesChange(value) {
      this.parkQuery.tagIds = []
      let checkedCount = value.length
      this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length
      if (value.length == 0 || this.isIndeterminate == false) {
        this.parkQuery.tagIds = []
        this.getParkSearch()
        return
      }
      const tagIds = []
      for (let i = 0; i < checkedCount; i++) {
        for (let k = 0; k < this.tagList.length; k++) {
          if (this.tagList[k].tagName == value[i]) {
            this.parkQuery.tagIds.push(this.tagList[k].tagId)
          }
        }
      }
      this.getParkSearch()
    },
    //关闭窗口
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          this.$refs['dataForm'].resetFields()
          this.temp = JSON.parse(JSON.stringify(temp))
          done()
        })
        .catch((_) => {})
    },
    //显示照片
    feachImage(faceIds) {
      return feachImage(faceIds)
    },
    //根据标签id查询标签名称
    getTagNameByTagId(tagId) {
      // console.log(tagId)
      const tagIds = tagId.split(',')
      return getTagNameByTagId(tagIds, this.tagList)
    },
    //根据园区id查询园区名称
    getParkNameByParkId(parkId) {
      const parkIds = parkId.split(',')
      return getParkNameByParkId(parkIds, this.parkList)
    },
    //删除图片
    handleRemove(file, fileList) {
      this.uploadDisabled = false
      this.imageUrl = ''
    },
    //图片上传成功
    handleSuccess(response, file, fileList) {
      if (response.code == 200) {
        this.dialogImageUrl = file.url
        this.temp.faceIds = response.data

        this.pShow = false
      } else {
        this.imageUrl = ''
        this.$message({
          type: 'error',
          message: response.message,
        })
      }
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
    },
    //图片上传前执行
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isPNG && !isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      const isGT50k = file.size / 1024 < 20
      const isGT2m = file.size / 1024 > 2 * 1024

      if (isGT50k) {
        this.$message.error('上传文件不能小于20K')
        return false
      }

      if (isGT2m) {
        this.$message.error('上传文件不能大于2M')
        return false
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async (base) => {
        this.imageUrl = reader.result
        const url = uploadImage()
        const res = await request.post(url, {
          // base64: this.imageUrl.split(',')[1],
        })
        console.log(res)
        this.handleSuccess(res, file)
      }

      return false
    },
    // 添加标签
    handleTagInfo() {
      this.dialogTagVisible = true
    },
    // 标签创建窗口
    handleCreateTag() {
      this.tagDialogVisible = true
      this.dialogTagStatus = 'create'
      this.dialogTagName = '创建单位'
    },
    //标签修改窗口
    handleUpdateTag(row) {
      this.tagDialogVisible = true
      Object.assign(this.tagInfo, row)
      this.dialogTagStatus = 'update'
      this.dialogTagName = '编辑单位'
    },
    //标签删除
    deleteTagInfo(row) {
      this.$confirm('确认删除？')
        .then((_) => {
          deleteTag(this.account, row.tagId)
            .then((res) => {
              if ((res.code = 200)) {
                this.$message({
                  message: '删除成功',
                  type: 'success',
                })
              }
              this.getTagList()
              this.getTagInfoSearch()
              this.getTagInfoList()
            })
            .catch((err) => {
              console.log(err)
            })
          done()
        })
        .catch((_) => {})
    },
    //标签创建
    createTag() {
      addTag(this.account, this.tagInfo)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '添加成功',
              type: 'success',
            })
          }
          this.tagDialogVisible = false
          this.tagInfo.tagName = ''
          this.getTagList()
          this.getTagInfoSearch()
          this.getTagInfoList()
        })
        .catch((err) => {
          console.log(err)
        })
    },

    updateTag() {
      updateTag(this.account, this.tagInfo)
        .then((res) => {
          if (res.code == 200) {
            this.$message({
              message: '修改成功',
              type: 'success',
            })
          }
          this.tagDialogVisible = false
          this.getTagInfoSearch()
          this.getTagList()
          this.getTagInfoSearch()
          this.getTagInfoList()
          this.tagInfo.tagName = ''
        })
        .catch((err) => {
          console.log(err)
        })
    },
    handleCloseTagVisible() {
      this.tagDialogVisible = false
      this.tagInfo.tagName = ''
    },
    handleCloseStaffDialog() {
      this.dialogFormVisible = false
      this.$refs['dataForm'].resetFields()
      this.tagIds = []
    },
  },
}
</script>

<style lang="scss" scoped>
.upload-demo {
  display: inline-block;
  margin-left: 10px;
  .el-button--small {
    padding: 12px 20px;
    font-size: 14px;
  }
}
.el-table .cell {
  white-space: nowrap; //强制不换行
  overflow: hidden; //溢出隐藏
  text-overflow: ellipsis; //替换为省略号
}
.disabled >>> .el-upload--picture-card {
  display: none;
}
.el-checkbox {
  line-height: 30px;
  margin-right: 38px;
}

.dashboard {
  &-container {
    margin: 30px;
    display: flex;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
// .outer-height-limited{
//   height: 800px;
//   overflow: hidden;
//   position: relative;
// }
// .inner-height-limited{
//   position: absolute;
// 	left: 0;
// 	top: 0;
// 	right: -17px;
// 	bottom: 0;
// 	overflow-x: hidden;
// 	overflow-y: scroll;
// }
</style>
<style lang="scss">
#twolines .app-container {
  display: grid;
  grid-template-columns: 17.5% 82.5%;
}

.tag {
  padding-right: 20px;
  .el-input {
    margin: 20px 0;
  }
  .tag-top {
    display: flex;
    justify-content: space-between;
  }
}

.area {
  width: 200px;
  padding: 0 20px;
}
.outer-height-limited {
  height: 800px;
  overflow: hidden;
  position: relative;
}
.inner-height-limited {
  position: absolute;
  left: 0;
  top: 0;
  right: -17px;
  bottom: 0;
  overflow-x: hidden;
  overflow-y: scroll;
}
.checkboxSp .el-checkbox__label {
  font-size: 12px;
}
</style>
