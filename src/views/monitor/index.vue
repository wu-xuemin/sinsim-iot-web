<template>
  <div class="app-container">
    <el-select
      class="monitorSelect"
      v-model="listQuery.taskIds"
      multiple
      filterable
      collapse-tags
      default-first-option
      placeholder="任务名称"
      @change="getVisitRecordList"
    >
      <el-option
        v-for="item in taskList"
        :key="item.taskId"
        :label="item.taskName"
        :value="item.taskId"
      />
    </el-select>

    <el-row :gutter="20">
      <el-col v-for="item in currentDate" :key="item.recordId" :span="5">
              <div class="AlertListItem-wrapper">
            <div class="AlertListItem">
                <div class="AlertListItem-header">
                    <span class="AlertListItem-taskName">{{ getTaskName(item.taskIds) }}</span>
                     <!-- <el-button
                     class="monitorBtn"
              type="primary"
              size="small"
              @click="triggerStaffFrom(item)"
              >一键入库</el-button
            > -->
                </div>

                <div class="AlertListItem-body">
                    <div class="AlertListItem-compareArea">
                        <img v-if="item.faceId" class="AlertListItem-compareImg" :src="feachImage(item.faceId)" alt srcset />
                        <img v-else class="AlertListItem-compareImg monitorLogo" src="./monitorLogo2.png" alt srcset />
                        <img  class="AlertListItem-compareImg" :src="feachSceneImage(item.sceneId)" @click="big(item)" alt srcset />
                    </div>

                    <div class="AlertListItem-alertInfo">
                       <div class="AlertListItem-similarity">
  {{ item.score.toFixed(1) }}
                        </div>
                        <div class="AlertListItem-alertInfoName">
                            {{ item.name }}
                        </div>
                        <div class="AlertListItem-alertInfoItem">
                            <span>时间: </span>
                            <span>{{ item.recordTime | time}}</span>
                        </div>
                        <div class="AlertListItem-alertInfoItem">
                            <span>地点: </span>
                            <span>{{ item.location }}</span>
                        </div>
                        <div class="tags monitoringWall-tags">
                          <div  v-for="tag in getTagNames(item.tagNames)"
                            :key="tag" class="tag-container monitoringWall-tag">{{tag}}</div>
                          <div v-if="getTagNames(item.tagNames).length > 2" class="AlertListItem-more">...</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </el-col>
    </el-row>

    <RecordPage
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getVisitRecordList"
    />

    <!-- <el-dialog title="一键入库" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="90px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="姓名:" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>

        <el-form-item label="工号:" prop="staffNumber">
          <el-input v-model="temp.staffNumber" />
        </el-form-item>

        <el-form-item label="联系方式:" prop="contact">
          <el-input v-model="temp.contact" />
        </el-form-item>

        <el-form-item label="标签:" prop="tagIds">
          <el-select
            v-model="temp.tagIds"
            multiple
            filterable
            default-first-option
            placeholder="请选择标签"
          >
            <el-option
              v-for="item in tagList"
              :key="item.tagId"
              :label="item.tagName"
              :value="item.tagId"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="入职时间:" prop="entryTime">
          <el-date-picker
            v-model="temp.entryTime"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="生日:" prop="birthday">
          <el-date-picker
            v-model="temp.birthday"
            type="date"
            placeholder="选择日期"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="备注:" prop="remark">
          <el-input v-model="temp.remark" type="textarea"></el-input>
        </el-form-item>

        <el-form-item
          ref="uploadImage"
          label="照片:"
          prop="faceIds"
          class="is-required"
        >
          <el-upload
            name="avatarFile"
            list-type="picture-card"
            class="avatar-uploader"
            action="#"
            :class="{ disabled: uploadDisabled }"
            :limit="1"
            :file-list="fileList"
            :on-preview="handlePictureCardPreview"
            :on-success="handleSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="imageUrl" :src="imageUrl" style="width: 148px" alt="" />
            <span v-else>
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </span>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCloseStaffDialog">取消</el-button>
        <el-button :loading="butLoading" type="primary" @click="createData"
          >确认</el-button
        >
      </div>
    </el-dialog> -->
     <el-dialog
      :visible.sync="imgDialogVisible"
      width="930px"
      style="padding:0px 40px"
      title="场景图预览"
    >
      <el-col class="location">{{location}}</el-col>
      <div>
        <img :src="faceImg" width="272" height="300" />
        <img :src="bigImg" width="612" height="300" />
      </div>
    </el-dialog>
    <div id="monitorFooter"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import RecordPage from '@/components/RecordPage'
import { feachImage, feachSceneImage, uploadImage,feachFaceImage } from '@/api/util'
import { fetchRecordByTaskId } from '@/api/visitRecord'
import { getTaskList } from '@/api/monitoringTask'
import { updatePage } from '@/utils/update-page'
import { getTagSearch, addStaffMonitor } from '@/api/staff'
import request from '@/utils/request'
import { cloneDeep } from 'lodash'

const temp = {
  staffId: '',
  name: '',
  staffNumber: '',
  cardNumber: '',
  faceIds: '',
  contact: '',
  birthday: '',
  tagIds: [],
  entryTime: '',
  email: '',
  remark: ''
}

export default {
  name: 'Monitor',
  computed: {
    ...mapGetters(['name'])
  },
  components: { RecordPage },
  created() {
    this.getTaskInfoList()
    this.getTagInfoList()
    updatePage(this.getVisitRecordList, true)
    this.toBlack()
  },
  beforeDestroy(){
    this.toWhite()
  },
  data() {
    const ids = (window.localStorage.getItem('ids') || '')
      .split(',')
      .filter(v => !!v)
    var pat = /[`~!@#$%^&*()\-+=<>?:"{}|,\/;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/im
    var validateForm = (rule, value, callback) => {
      if (value === '') {
        if (rule.field === 'name') {
          callback(new Error('姓名不能为空'))
        }
      } else if (pat.test(value)) {
        if (rule.field === 'name') {
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
    return {
      dialogFormVisible: false,
      rules: {
        name: [{ required: true, validator: validateForm, trigger: 'blur' }],
        staffNumber: [
          { required: true, validator: validateNum, trigger: 'blur' }
        ],
        tagIds: [{ required: true, message: '请选择标签', trigger: 'change' }]
      },
      temp: temp,
      staffNumberShow: false,
      uploadDisabled: false,
      imageUrl: '',
      butLoading: false,
      fileList: [],
      tagList: [],
      currentDate: [],
      total: 0,
      listQuery: {
        condition: '',
        deviceIds: [],
        tagIds: [],
        queryStartTime: '',
        queryFinishTime: '',
        type: '',
        recordType: 0,
        taskIds: ids || [],
        page: 1,
        limit: 10
      },
      deviceList: [],
      taskList: [],
      taskId: '',
      tagQuery: {
        condition: '',
        type: 'STAFF',
        page: 0,
        limit: 0
      },
      imgDialogVisible:false,
      bigImg: '',
      faceImg: '',
      location: ''
    }
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
    // 添加
    toBlack(){
      let body = document.querySelector("body")
      body.className = "bgcBlack"
      // $("body").addClass("bgcBlack")
    },
    toWhite(){
      let body = document.querySelector("body")
       body.className = ""
      // $("body").removeClass("bgcBlack")
    },
    // 添加
    createData() {
      this.pShow = false
      this.uploadDisabled = false
      this.$refs['dataForm'].validate(valid => {
        if (!this.imageUrl) {
          this.pShow = true
        } else {
          if (valid) {
            const temp = cloneDeep(this.temp)
            temp.tagIds = temp.tagIds.join(',')
            this.butLoading = true
            addStaffMonitor(this.account, temp)
              .then(res => {
                this.dialogFormVisible = false
                this.$message({
                  message: '添加成功',
                  type: 'success'
                })
                this.butLoading = false
                this.imageUrl = ''
                this.tagIds = []
              })
              .catch(err => {
                this.butLoading = false
                console.log(err)
              })
          } else {
            this.butLoading = false
          }
        }
      })
    },
    handleCloseStaffDialog() {
      this.dialogFormVisible = false
      this.$refs['dataForm'].resetFields()
      this.tagIds = []
    },
    // 图片上传成功
    handleSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.dialogImageUrl = file.url
        this.temp.faceIds = response.data

        this.pShow = false
      } else {
        this.imageUrl = ''
        this.$message({
          type: 'error',
          message: response.message
        })
      }
    },
    handlePictureCardPreview(file) {
      this.dialogVisible = true
    },
    // 图片上传前执行
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isPNG = file.type === 'image/png'
      if (!isPNG && !isJPG) {
        this.$message.error('上传头像图片只能是 JPG/PNG 格式!')
        return false
      }
      const isGT50k = file.size / 1024 < 20

      if (isGT50k) {
        this.$message.error('上传文件不能小于20K')
        return false
      }

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = async base => {
        this.imageUrl = reader.result
        const url = uploadImage()
        const res = await request.post(url, {
          base64: this.imageUrl.split(',')[1]
        })
        this.handleSuccess(res, file)
      }

      return false
    },
    // 标签
    getTagInfoList() {
      getTagSearch(this.tagQuery)
        .then(res => {
          this.tagList = res.data.list
        })
        .catch(err => {
          console.log(err)
        })
    },
    triggerStaffFrom(item) {
      this.dialogFormVisible = true
      this.temp.name = item.sceneId.replace(/-/g, '')
      this.temp.staffNumber = item.sceneId.replace(/-/g, '')
      const tag = this.tagList.find(item => item.tagName === '住店客人')
      this.temp.tagIds = tag ? [tag.tagId] : ''
      this.temp.faceIds = item.sceneId
      const img = '/images/face/' + item.sceneId
      this.imageUrl = img
      console.log(this.temp)
    },
    async getVisitRecordList() {
      window.localStorage.setItem('ids', this.listQuery.taskIds)
      return fetchRecordByTaskId(this.listQuery)
        .then(res => {
          if (res.data != null) {
            this.currentDate = res.data.list
            this.total = res.data.total
          } else {
            this.currentDate = []
            this.total = 0
          }
          return res
        })
        .catch(err => {
          console.log(err)
        })
    },
    getTaskInfoList() {
      getTaskList()
        .then(res => {
          this.taskList = res.data
        })
        .catch(err => {
          console.log(err)
        })
    },
    feachImage(faceId) {
      return feachImage(faceId)
    },
    feachSceneImage(sceneId) {
      return feachSceneImage(sceneId)
    },
    getTagNames(tagName) {
      let tagNames = ''
      if (tagName == null || tagName === '') {
        // TODO
      } else {
        tagNames = tagName.split(',')
      }
      return tagNames
    },
    getTaskName(taskId) {
      for (let i = 0; i < this.taskList.length; i++) {
        if (taskId === this.taskList[i].taskId) {
          return this.taskList[i].taskName
        }
      }
    },
    //图片放大
    big(item) {
      this.imgDialogVisible = true
      this.location = item.location
      this.faceImg = feachSceneImage(item.sceneId)
      this.bigImg = feachFaceImage(item.sceneImageId)
    }
  }
}
</script>

<style lang="scss">
.bgcBlack{
  background:#111118
}
.el-col-5 {
  width: 19.999%;
  margin-top: 0vw;
}
.el-row {
  margin-bottom: 0vh;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 0.208vw;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  // min-height: 18vw;
  padding: 0 10px;
  border-radius: 4px;
  border: 1px solid #ebeef5;
  background-color: #222534;
  overflow: hidden;
  color: #ffffff;
  font-size: 14px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  box-shadow: 0 72px 47px 0 rgba(0, 0, 0, 0.1);
  display: grid;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
.el-col-6 {
  margin-bottom: 10px;
}
</style>

<style lang="scss">
.monitor-top {
  display: flex;
  justify-content: space-between;
}

.monitor-img {
  display: flex;
  justify-content: space-around;
  align-items: center;
  img {
    width: 6vw;
    height: 7vw;
  }
  .monitorLogo{
    width: 4.4vw;
    height: 7vw;
  }
}
.user-info {
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin-top: 1.2vw;
  margin-bottom: 1vw;
}
.address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
}
</style>

<style lang="scss" scoped>
*{
line-height:1.4
}
.app-container{
  background-color: #111118;
}
@mixin oneLineEllipsis {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.AlertListItem {
  position: relative;
  min-height: 8vh;
  height:17.6vw;
  // min-height:320px;
  padding: 0.83vw 1.35vw;
  overflow: hidden;
  color: #ffffff;
  font-size: 0.8vw;
  background-color: #222534;
  border-radius: 0.104vw;
  // @include sansMedium;
  &-wrapper {
    // width: 20%;
    padding: 0.78vw;
  }
  &-more {
    font-weight: bold;
    font-size: 0.83vw;
    margin-left: 0.52vw;
    letter-spacing: 0.052vw;
    display: inline-block;
    position: absolute;
  }
  .AlertListItem-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 1.1vw;
    font-size: 0.9vw;
    line-height: 1.1vw;
    @include oneLineEllipsis;
  }
  .AlertListItem-taskName {
    @include oneLineEllipsis;
  }
  .AlertListItem-type,
  .AlertListItem-tag {
    position: absolute;
    top: 0.728vw;
    right: 1.248vw;
    padding: 0 0.208vw;
    // color: rgba($whiteColor, $alpha90);
    // font-size: $fontSize14;
    background: #f99c26;
    border-radius: 0.104vw;
    &.AlertListItem-green {
      background: #07c98a;
    }
    &.AlertListItem-yellow {
      background: #f99c26;
    }
    &.AlertListItem-red {
      background: #ff4438;
    }
  }
  .AlertListItem-body {
    padding-top: 0.8vw;
    overflow: hidden;
  }
  .AlertListItem-compareArea {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.104vw;
  }
  .AlertListItem-compareImg {
    // width: 1.2rem;
    // height: 1.2rem;
    width: 6vw;
    height:7vw;
    border-radius: 0.1248vw;
    &:first-child {
      margin-right: 0.832vw;
    }
  }
  .monitorLogo{
    width: 4.4vw;
    height: 7vw;
    text-align:center;
    // margin:auto;
  }
  .AlertListItem-alertInfo {
    position: relative;
    padding-top: 0.6vw;
  }
  .AlertListItem-similarity {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 1vw;
    color: #FF4438;
    line-height: 1.716vw;
    font-weight: bold;
    // @include sansBold;
  }
  .AlertListItem-alertInfoName {
    margin-right: 3.64vw;
    margin-bottom: 0.104vw;
    text-decoration: underline;
    @include oneLineEllipsis;
  }
  .AlertListItem-alertInfoItem {
    margin-bottom: 0.104vw;
    // @include sansRegular;
    @include oneLineEllipsis;
  }
}

.tag-container {
	display: inline-block;
	border: 0.052vw solid rgba(0,0,0,0.10);
	border-radius: 0.104vw;
	// padding: 0.05rem 0.11rem;
  	padding: 0.25vw 0.55vw;
	font-family: SourceHanSansSC-Normal;
	// font-size: 0.13rem;
  	font-size: 0.65vw;
	color: rgba(0,0,0,0.76);
	// margin-bottom: 0.1rem;
  	margin-bottom: 0.5vw;
}

.tag-container + .tag-container{
  	margin-left: 0.5vw;
}
.format-container{
	background: inherit;
	position: relative;
	height: 100%;
	>.tags-wrapper {
		padding-left: 0.5vw;
		height: 4.25vw;
		padding-top: 0.5vw;
		margin-right: 1.25vw;
		overflow: hidden;
		> .tag-container {
			margin-left: 0;
			margin-right: 0.5vw;
		}
		&.full-wrapper {
			box-shadow: 0 0.2vw 0.4vw 0 rgba(0, 0, 0, 0.10);
			background: inherit;
			position: absolute;
			overflow: inherit;
			height: auto;
			z-index: 1;
			margin-right: 0;
		}
	}
	>.more {
		display:inline;
		height: 0.65vw;
		line-height: 0.65vw;
		position: absolute;
		color: rgba(0, 0, 0, 0.76);
		font-size: 0.65vw;
		opacity: 0.3;
		right: 0vw;
		bottom: 0.5vw;
	}
}

.monitoringWall-tag {
        overflow: hidden;
        white-space: nowrap;
        max-width: 6.24vw;
        text-overflow: ellipsis;
        background: rgba(255,255,255,0.10);
        color: #fff;
    }

.monitoringWall-tags {
        margin-top: 0.624vw;
    }
// #monitorFooter{
//   height:500px;
//   width:100%;
//   margin-left:-20px;
//   position: fixed;
//   z-index: -1;
//   background-color: #111118;
// }

.monitorBtn{
  height:1.62vw;
  position: absolute;
  right:1vw;
  line-height:0.62vw;
  font-size:0.728vw;
  padding:0.468vw 0.832vw;
}

.monitorSelect *{
  height:2.08vw !important;
}
.location {
  font-size: 18px;
  font-weight: 600;
}
</style>