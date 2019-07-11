<template>
  <div class="index">
    <el-container>
      <el-header>
        <div class="logo"></div>
        <div class="title">
          <h1>电商后台管理系统</h1>
        </div>
        <div class="quit">
          欢迎光临，xxx <a href="javascript:;" @click='quit'>退出</a>
        </div>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu
            router
            unique-opened
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>用户管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="users">用户列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>权限管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-3">用户列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>商品管理</span>
              </template>
              <el-menu-item-group>
                <el-menu-item index="1-2">用户列表</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    handleOpen (key, keyPath) {
      console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath)
    },
    quit () {
      this.$confirm('你确定要退出么?', '温馨提示', {
        type: 'warning'
      }).then(() => {
        localStorage.removeItem('token')
        this.$message.success('成功退出')
        this.$router.push('/login')
      }).catch(() => {
        this.$message.warning('取消退出')
      })
    }
  }
}
</script>

<style lang="scss">
.index {
  height: 100%;
}
.el-container {
  height: 100%;
}
.el-header {
  line-height: 60px;
  display: flex;
  background: url('../assets/1000113_300.jpg') no-repeat center/cover;
  .logo,
  .quit {
    width: 180px;
  }
  .logo {
    background: url('../assets/logo.png') no-repeat center center/contain ;
  }
  .quit {
    a {
      color: peru;
      font-weight: 550;
    }
  }
  .title {
    flex: 1;
    h1 {
      font-size: 30px;
      color: #596;
      text-align: center;
    }
  }
}
.el-aside {
  background-color: #545c64;
  .el-submenu {
    width: 200px;
  }
}
.el-main {
  background-color: #eaeef1;
}

</style>
