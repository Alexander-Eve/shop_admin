<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>

export default {

}
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  list-style: none;
}
html,
body,
#app {
  height: 100%;
}
#app {
  .el-breadcrumb {
    line-height: 40px;
    background-color: black;
    opacity: .6;
    padding-left: 10px;
    border-radius: 5px;
  }
  .diy {
  margin: 10px 0;
  background: url('./assets/325473.jpg') no-repeat center center/cover;
  color: transparent;
  font-size: 40px;
  opacity: .6;
  &:active,
  &:focus,
  &:hover {
    color: transparent;
  }
  }
  .el-table,
  .el-table th,
  .el-table tr {
    background-color: black;
    opacity: .7;
  }
}
</style>
