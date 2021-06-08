<template>
  <div id="repairOrder">
    <el-form :inline="true">
      <el-form-item>
        <el-date-picker
          v-model="filter.time"
          type="daterange"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          format="yyyy 年 MM 月 dd 日"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item class="select-group">
        <el-select v-model="filter.repairId" placeholder="请选择类型" clearable>
          <el-option
            v-for="item in faultList"
            :key="item.code"
            :label="item.name"
            :value="item.code"
          ></el-option>
        </el-select>
        <el-button icon="el-icon-search" @click="search"></el-button>
      </el-form-item>
      <el-form-item>
        <el-checkbox-group v-model="owner" @change="onChangeFilter">
          <el-checkbox-button v-for="o in ownerTypes" :label="o.value" :key="o.value">{{o.label}}</el-checkbox-button>
        </el-checkbox-group>
      </el-form-item>
      <el-button icon="el-icon-plus" @click="addVisible = true; resetForm()" class="add-btn">添加</el-button>
    </el-form>

    <el-table
      :data="maintainList.data"
      stripe
      style="width: 100vw"
      max-height="620"
      @filter-change="filterByStatus"
    >
      <el-table-column prop="pic" label="图片" align="center">
        <template slot-scope="scope">
          <el-image
            v-if="scope.row.imgsUrl"
            style="width: 60px; height: 60px"
            :src="scope.row.imgsUrl.split(',')[0]"
            :preview-src-list="scope.row.imgsUrl.split(',')"
          ></el-image>

          <span v-else>暂无图片</span>
        </template>
      </el-table-column>
      <el-table-column prop="video" label="视频" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.vedioUrl"
            @click="viewVideo(scope.row.vedioUrl)"
          >查看视频</el-button>
          <span v-else>暂无视频</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center"></el-table-column>
      <el-table-column prop="exeName" label="执行人" align="center"></el-table-column>
      <el-table-column prop="content" label="内容" align="center"></el-table-column>
      <el-table-column prop="start" label="开始时间" align="center"></el-table-column>
      <el-table-column prop="end" label="结束时间" align="center"></el-table-column>
      <el-table-column prop="repairName" label="维修人员" align="center"></el-table-column>

      <el-table-column
        prop="status"
        label="状态"
        align="center"
        :filters="repairStatus"
        :filter-multiple="false"
        filter-placement="bottom-end"
        column-key="status"
      >
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === '等待维修' ? 'warning' : scope.row.status === '正在维修中' ? 'primary' : scope.row.status === '已经完成' ? 'success': 'danger'"
            disable-transitions
          >{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="expert" label="协助专家" align="center"></el-table-column>
      <el-table-column width="300px" label="操作" align="center">
        <template slot-scope="scope">
          <el-button size="mini" plain type="info" @click="viewProgress(scope.row)">维修进度</el-button>
          <el-button size="mini" plain type="primary">编辑</el-button>
          <el-button size="mini" plain type="danger">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      class="paging"
      :current-page="filter.pageNum"
      :page-sizes="[10, 20, 30]"
      :page-size="filter.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalRows"
      @size-change="onPageSizeChange"
      @current-change="onPageCurrentChange"
    ></el-pagination>

    <el-dialog title="工单添加" :visible.sync="addVisible" :close-on-click-modal="false">
      <el-form :model="uploadForm" ref="uploadForm">
        <el-form-item style="margin: 10px 0 50px 0">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-avatar :size="90">
                <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
              </el-avatar>
            </el-col>
            <el-col :span="15" style="text-align: center">
              <p>选择上传相关图片/视频</p>
              <el-upload
                :action="`${config.baseURL}/upload`"
                :before-upload="beforeUpload"
                multiple
                :limit="3"
                :on-exceed="handleExceed"
                :on-success="handleSuccess"
                :file-list="fileList"
                accept=".jpg, .jpeg, .mp4, .avi, .JPG, .JPEG, .MP4, .AVI"
              >
                <el-button size="small" class="upload-btn">上传</el-button>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item
          label="类型"
          prop="faultCode"
          :rules="[{ required: true, message: '请选择类型', trigger: ['blur']}]"
        >
          <el-select v-model="uploadForm.faultCode" placeholder="请选择类型">
            <el-option
              v-for="item in faultList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="执行人" prop="type">
          <el-select v-model="uploadForm.exeName" placeholder="请选择执行人">
            <el-option v-for="item in exes" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>-->
        <!-- <el-form-item label="维修状态" prop="type">
          <el-select v-model="uploadForm.status" placeholder="请选择维修状态">
            <el-option v-for="item in status" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="维修人员" prop="userId">
          <el-select v-model="uploadForm.userId" placeholder="请选择维修人员">
            <el-option
              v-for="item in userlist.data"
              :key="item.id"
              :label="item.userName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="内容"
          prop="content"
          :rules="[{ required: true, message: '请输入内容', trigger: ['blur']}]"
        >
          <el-input
            type="textarea"
            v-model="uploadForm.content"
            :autosize="{ minRows: 5, maxRows: 10}"
            placeholder="输入损坏位置信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="createWorkOrder">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="故障视频" :visible.sync="videoVisible" center :close-on-click-modal="false">
      <video-player
        class="video-player vjs-custom-skin"
        ref="videoPlayer"
        :playsinline="true"
        :options="playerOptions"
      ></video-player>
    </el-dialog>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";
import * as types from "@/store/action-types";
import { getSession, setSession } from "@/utils/local";
import config from "@/config";

export default {
  data() {
    return {
      config: config,
      addVisible: false,
      videoVisible: false,
      owner: [],
      ownerTypes: [
        {
          value: 1,
          label: "由我创建的",
        },
        {
          value: 2,
          label: "指派给我的",
        },
        {
          value: 3,
          label: "由我解决的",
        },
      ],
      uploadForm: {
        faultCode: "",
        content: "",
        userId: "",
        imgsUrl: "",
        vedioUrl: "",
      },
      maintainers: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      filter: {
        pageNum: 1,
        pageSize: 10,
        time: [],
        repairId: "",
        isByMe: 0,
        isToMe: 0,
        isResolveByMe: 0,
      },
      fileList: [],
      status: [],
      repairStatus: [
        {
          text: "等待维修",
          value: "WAIT_REPAIR",
        },
        {
          text: "正在维修中",
          value: "REPAIRING",
        },
        {
          text: "已经完成",
          value: "COMPLETED",
        },
        {
          text: "维修失败",
          value: "FAILED",
        },
      ],
      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
        autoplay: false, //如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: "auto", // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: "zh-CN",
        aspectRatio: "16:9", // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [
          {
            type: "", //这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
            src: "", //url地址
          },
        ],
        poster: "", //你的封面地址
        // width: document.documentElement.clientWidth, //播放器宽度
        notSupportedMessage: "此视频暂无法播放，请稍后再试", //允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true, //全屏按钮
        },
      },
    };
  },
  computed: {
    ...mapState({
      faultList: (state) => state.maintain.faultList,
      maintainList: (state) => state.maintain.maintainList,
      userlist: (state) => state.account.userlist,
    }),
    totalRows() {
      return this.maintainList.total;
    },
  },
  async created() {
    try {
      await this[types.GET_MAINTAIN_LIST](this.filter);
      await this[[types.GET_ALL_USERS]]({ roleId: 2 });
    } catch (e) {
      this.$message.error(e.msg)
    }
  },
  methods: {
    ...mapMutations({
      [types.CUR_MAINTAIN_ORDER]: `maintain/${[types.CUR_MAINTAIN_ORDER]}`,
    }),
    ...mapActions({
      [types.GET_MAINTAIN_LIST]: `maintain/${[types.GET_MAINTAIN_LIST]}`,
      [types.CREATE_WORK_ORDER]: `maintain/${[types.CREATE_WORK_ORDER]}`,
      [types.GET_ALL_USERS]: `account/${[types.GET_ALL_USERS]}`,
    }),
    onPageSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.filter.pageSize = val;
      this[types.GET_MAINTAIN_LIST](this.filter);
    },
    onPageCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.filter.pageNum = val;
      this[types.GET_MAINTAIN_LIST](this.filter);
    },
    onChangeFilter(newVal) {
      this.filter.isByMe = 0;
      this.filter.isToMe = 0;
      this.filter.isResolveByMe = 0;
      newVal.forEach((v) => {
        if (v === 1) {
          this.filter.isByMe = 1;
        }
        if (v === 2) {
          this.filter.isToMe = 1;
        }
        if (v === 3) {
          this.filter.isResolveByMe = 1;
        }
      });
      this[types.GET_MAINTAIN_LIST](this.filter).catch((e) => {
        this.$message.error(e.msg);
      });
    },
    search() {
      if (this.filter.time.length === 0 && !this.filter.repairId) {
        this.$message.error("请输入查询条件！");
        return;
      }
      const filter = {
        pageNum: 1,
        pageSize: this.filter.pageSize,
        start: this.filter.time[0],
        end: this.filter.time[1],
        repairId: this.filter.repairId,
      };
      this[types.GET_MAINTAIN_LIST](filter).catch((e) => {
        this.$message.error(e.msg);
      });
    },
    filterByStatus(filters) {
      let status = filters.status[0];
      const filter = {
        pageNum: 1,
        pageSize: this.filter.pageSize,
        repairId: this.filter.repairId,
        status: status,
      };
      this[types.GET_MAINTAIN_LIST](filter).catch((e) => {
        this.$message.error(e.msg);
      });
    },
    createWorkOrder() {
      if (!this.uploadForm.userId) {
        this.uploadForm.userId = getSession("userInfo").id;
      }
      this[types.CREATE_WORK_ORDER](this.uploadForm)
        .then(() => {
          this.$message.success("添加成功！");
          this[types.GET_MAINTAIN_LIST](this.filter);
        })
        .catch((e) => {
          this.$message.error(e.msg);
        });
      this.addVisible = false;
    },
    beforeUpload(file) {
      let fileExName = file.name.substring(file.name.lastIndexOf(".") + 1);
      const extensions = [
        "jpg",
        "jpeg",
        "mp4",
        "avi",
        "JPG",
        "JPEG",
        "MP4",
        "AVI",
      ];
      let accept = extensions.some((exName) => fileExName === exName);
      if (!accept) {
        this.$message.warning("上传文件只能是 jpg、jpeg、mp4、avi格式!");
      }
      return accept;
    },
    handleExceed() {
      this.$message.error("最多上传3个文件！");
    },
    handleSuccess(res, file) {
      let fileExName = file.name.substring(file.name.lastIndexOf(".") + 1);
      if (res.code === "success") {
        if (fileExName === "jpg" || fileExName === "jpeg") {
          if (!this.uploadForm.imgsUrl) {
            this.uploadForm.imgsUrl = res.fileUrl;
          } else {
            this.uploadForm.imgsUrl += `,${res.fileUrl}`;
          }
        } else {
          if (!this.uploadForm.vedioUrl) {
            this.uploadForm.vedioUrl = res.fileUrl;
          } else {
            this.uploadForm.vedioUrl += `,${res.fileUrl}`;
          }
        }
      }
    },
    resetForm() {
      this.uploadForm = {};
      this.fileList = [];
    },
    viewVideo(url) {
      this.playerOptions.sources[0].src = url;
      this.videoVisible = true;
    },
    viewProgress(row) {
      this.$router.push("/repair/repairProgress");
      this[types.CUR_MAINTAIN_ORDER](row);
      setSession("curOrder", row);
    },
  },
};
</script>

<style lang="less">
#repairOrder {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  .select-group {
    margin-bottom: 0;
    .el-form-item__content {
      .el-input__inner {
        border-right: 0;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
      .el-button {
        border-left: 0;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background-color: rgb(97, 153, 238);
        color: white;
      }
    }
  }

  .add-btn {
    float: right;
    background-color: orange;
    color: white;
  }
  .upload-btn {
    background: rgb(255, 174, 1);
    color: white;
    width: 80px;
  }

  .el-table {
    border-radius: 5px;
    box-shadow: 0 0 8px 4px rgba(0, 0, 0, 0.1);
    .el-table__header {
      width: 100% !important;
    }
    .el-table__body {
      width: 100% !important;
    }
  }
  .paging {
    text-align: center;
    margin: 12px 0;
  }
  .el-input {
    box-shadow: 0 0 8px 2px rgba(0, 0, 0, 0.1);
  }
  .el-dialog {
    width: 30vw;
    .el-dialog__body {
      overflow: hidden;
    }
    .el-form {
      .el-form-item {
        .el-input {
          box-shadow: none;
        }
        .el-select {
          width: 100%;
        }
      }
    }

    .video-js .vjs-icon-placeholder {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}
</style>
