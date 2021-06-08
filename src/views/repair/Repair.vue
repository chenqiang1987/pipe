<template>
  <div id="repair">
    <div class="item">
      <ul>
        <li>{{this.$route.name}}</li>
      </ul>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>
export default {};
</script>
<style lang="less">
#repair {
  .item {
    height: 86px;
    box-shadow: 0 0 4px 4px rgba(0, 0, 0, 0.1);
    background-color: #fefefe;
    padding-left: 30px;
    font-weight: bold;
    line-height: 86px;
    ul {
      li {
        float: left;
        font-size: 24px;
        padding: 0 10px;
        color: #7598ea;
        font-size: 28px;
        background-color: #fff;
        border-bottom: 2px solid #7598ea;
      }
    }
  }
}
</style>
