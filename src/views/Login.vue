<template>
  <div class="login">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" class="demo-ruleForm">
      <!-- <img src="../assets/1000231_300.jpg" alt=""> -->
      <el-form-item label="用户名" prop="username">
        <el-input type="text" v-model="ruleForm.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input type="password" v-model="ruleForm.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('ruleForm')">登录</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      ruleForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      this.$refs[formName].validate(valid => {
        if (!valid) return false
        console.log('校验通过')
        // axios({
        //   method:'post',
        //   url:'http://localhost:8888/api/private/v1/login',
        //   data:this.ruleForm
        // }).then(res => {
        //   console.log(res.data)
        // })
        axios.post('http://localhost:8888/api/private/v1/login', this.ruleForm).then(res => {
          console.log(res.data)
          // 把res.data里面的数据解构出来
          const { status, msg } = res.data.meta
          if (status === 200) {
            const { token } = res.data.data
            // const { token } = res.data.data
            // 登录成功给一个提示
            this.$message.success('登录成功 ')
            // 把token令牌存储在本地中
            localStorage.setItem('token', token)
            // 连式编程导航
            // this.$router.push('/index')
            this.$router.push({ name: 'index' })
          } else {
            // 登录失败提示
            this.$message.error(msg)
          }
        })
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
.login {
  height: 100%;
  background: url('../assets/5d0b73e10efd9.jpg') no-repeat;
  background-size: cover;
  overflow: hidden;
  .el-input__inner {
    opacity: .5;
    color: black;
  }
  .el-form {
    width: 400px;
    margin: 200px auto;
    padding: 75px 40px 15px;
    border-radius: 20px;
    opacity: .5;
    position: relative;
    background-color: black;
    box-shadow: 0 15px 30px red;
    .el-form-item__label {
      color: white;
    }
    .el-button:last-child {
      margin-left: 100px;
    }
  }
  // img {
  //   position: absolute;
  //   left: 50%;
  //   transform: translateX(-50%);
  //   top: -100px;
  //   width: 160px;
  //   height: 160px;
  //   border-radius: 80px;
  // }
}
</style>
