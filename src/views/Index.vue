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
            :default-active="path"
            class="el-menu-vertical-demo"
            text-color="#000"
            active-text-color="#ffd04b">
            <!-- index 是跳转路径 -->
            <el-submenu v-for="menu in indexList" :key="menu.id" :index="menu.path">
              <template slot="title">
                <i class="el-icon-location"></i>
                <span>{{ menu.authName }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item :index="item.path" v-for="item in menu.children" :key="item.id">
                  <i class="el-icon-menu"></i>{{ item.authName }}</el-menu-item>
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
  data () {
    return {
      indexList: []
    }
  },
  computed: {
    path () {
      return this.$route.path.slice(1).split('-')[0]
    }
  },
  async created () {
    const { meta, data } = await this.axios.get('menus')
    if (meta.status === 200) {
      this.indexList = data
    }
  },
  methods: {
    async quit () {
      try {
        await this.$confirm('你确定要退出么?', '温馨提示', {
          type: 'waring'
        })
        localStorage.removeItem('token')
        this.$message.success('成功退出')
        this.$router.push('/login')
      } catch {
        this.$message.warning('取消退出')
      }
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
  background: url('../assets/1000097.jpg') no-repeat center/cover;
  .logo,
  .quit {
    width: 180px;
    color: #ccc;
  }
  .logo {
    background: url('../assets/logo.png') no-repeat center center/contain ;
  }
  .quit {
    color: #ddd;
    font-weight: 700;
    a {
      color: peru;
      font-weight: 550;
    }
  }
  .title {
    flex: 1;
    h1 {
      font-size: 30px;
      color: #f0f0f0;
      text-align: center;
    }
  }
}
.el-aside {
  height: 100%;
  background: black url('../assets/timg.jpg') no-repeat center center/cover;
  .el-submenu {
    width: 200px;
  }
  .el-menu {
    background-color: transparent;
  }
}
.el-main {
  height: 100%;
  background: url('../assets/320290.jpg') no-repeat center center/cover;
}
</style>
