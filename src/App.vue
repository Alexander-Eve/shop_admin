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
  }
}
</style>
