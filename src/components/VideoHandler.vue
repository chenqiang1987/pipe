<template>
  <div id="video-handler">
    <div class="wrp" @click="handler(0)">
      <div class="icon-wrapper">
        <svg-icon class="icon-btn" iconClass="jietu"></svg-icon>
      </div>
      <p>一键截图</p>
    </div>
    <div class="wrp" @click="handler(1)">
      <div class="icon-wrapper">
        <svg-icon class="icon-btn" iconClass="video"></svg-icon>
      </div>
      <p>立即录像</p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      
    }
  },
  methods:{
    handler(type) {
      this.$emit("onHandler", type)
    },
  }
};
</script>

<style lang="less">
#video-handler {
  display: flex;
  width: 100%;
  height: 200px;
  align-items: center;
  .wrp {
    display: flex;
    width: 50%;
    flex-flow: wrap;
    .icon-wrapper {
      display: flex;
      width: 100%;
      justify-content: center;
      font-size: 2.2rem;
      color: #47cced;
      .icon-btn {
        padding: 4%;
        border: 1px solid #47cced;
        border-radius: 50%;
        margin-bottom: 10px;
        &:hover {
          cursor: pointer;
        }
      }
    }
    p {
      text-align: center;
      width: 100%;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>