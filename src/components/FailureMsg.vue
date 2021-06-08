<template>
    <div class="failure-wrapper">
    <div class="msg-row" v-for="msg in warnings" :key="msg.id">
      <svg-icon iconClass="warning"></svg-icon>
      {{msg.ct}}
    </div>
    <el-divider></el-divider>
    <div class="viewDetails">查看全部</div>
  </div>
</template>

<script>
export default {
    data() {
        return {
            warnings: [
                // {
                //     id: 0,
                //     ct: "260米处水管破裂"
                // },
                // {
                //     id: 1,
                //     ct: "260米处起火"
                // }
            ]
            
        }
    }
}
</script>

<style lang="less">
.failure-wrapper {
    .msg-row {
        margin: 0 15px 30px 15px;
    }
    .el-divider--horizontal {
        margin: 8px 0;
    }
    .viewDetails {
        text-align: center;
    }
}

</style>