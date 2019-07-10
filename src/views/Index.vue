<template>
  <div class="index">
    <el-container>
      <el-header>
        <el-row :gutter="20">
          <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="16"><div class="grid-content bg-purple"></div></el-col>
          <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
      </el-header>
      <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>Main</el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
}
</script>

<style lang="scss">
.index {
  height: 100%;
}
.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 60px;
    .logo {
      float: left;
      height: 100%;
      width: 180px;
      img {
        width: 100%;
        // height: 100%;
      }
    }
    .quit {
      float: right;
      height: 100%;
    }
    .title {
      overflow: hidden;
      height: 100%;
      font-size: 30px;
      color: white;
      font-weight: 700;
    }
  }

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

.el-container {
height: 100%;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  height: 100%;
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
  border-radius: 4px;
  min-height: 60px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
