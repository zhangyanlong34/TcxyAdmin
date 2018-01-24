<style scoped>

.wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    padding-top: 150px;
    padding-bottom: 200px;
    /*background: -webkit-gradient(linear, 0 0, 0 bottom, from(#ff0000), to(rgba(0, 0, 255, 0.5)));*/
    /*background: #fff;*/
    /*url(http://78rbeb.com1.z0.glb.clouddn.com/wp-content/uploads/2014/03/free-blurred-web-backgrounds-04.jpg);*/
}
.wrapper > h1{
  text-align: center;
  vertical-align: middle;
  margin-bottom: 20px;
  color: #000;
}
.login {
    margin: 0 auto;
    padding: 200px auto;
    width: 200px;
    height: 100%;
}

</style>

<template>

<div class="wrapper">
<h1>
后台管理系统
</h1>
    <div class="login">
        <i-form ref="formInline" :model="formInline" :rules="ruleInline">
          <FormItem prop="user">
            <Input type="text" v-model="formInline.user" size="large" placeholder="Username"/>
            <Icon type="ios-person-outline" slot="prepend"/>
          </FormItem>
          <FormItem prop="password">
            <Input type="password" v-model="formInline.password" size="large" placeholder="Password"/>
            <Icon type="ios-locked-outline" slot="prepend"/>

          </FormItem>
          <Form-item>
            <i-button type="primary" @click.native="handleSubmit('formInline')" long>登录</i-button>
          </Form-item>
        </i-form>
    </div>
</div>

</template>

<script>
  export default {
      data() {
            return {
                formInline: {
                    user: '',
                    password: '',
                },
                ruleInline: {
                    user: [{
                        required: true,
                        message: '请填写用户名',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请填写密码',
                        trigger: 'blur'
                    }, {
                        type: 'string',
                        min: 6,
                        message: '密码长度不能小于6位',
                        trigger: 'blur'
                    }]
                }
            }
        },
        methods: {
            handleSubmit(name) {
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        this.$http.post(URL.loginUrl,{'username':this.formInline.user,'password':this.formInline.password}).then(function(response){
                          var result = response.data;
                          window.localStorage.setItem('token',result.extdata.token);
                          console.log(result.msg);
                          if(result.msg === 'success') {
                            this.$Message.success('登录成功!');
                            this.$router.push( { path:'/about',params:{username:this.formInline.user }});
                          }
                        });
                    } else {
                        this.$Message.error('表单验证失败!');
                    }
                })
            },
            handleReset(val) {
                console.log(val)
            }
        },
        created: function(){
            var token = window.localStorage.getItem("token");
            this.$http.post(URL.userInfoUrl,{token:token}).then(function(response){
                var result = response.data;
                if(result!=null){
                  console.log(result);
                  this.$router.push( { path:'/about',params:{username:result.extdata.name }});

                }

            })
        }
  }

</script>
