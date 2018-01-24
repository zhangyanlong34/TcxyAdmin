<template>
  <div style="margin: 10px;overflow: hidden">
    <Modal
      width="400"
      v-model="del.modal"
      title="新增用户">
      <Form  ref="formUser" label-position="left" :model="formUser" :rules="ruleInline"  :label-width="100">
        <FormItem label="用户名" prop="loginName">
          <Input type="text" v-model="formUser.loginName"></Input>
        </FormItem>
        <FormItem label="密码" prop="password">
          <Input type="password" v-model="formUser.password"></Input>
        </FormItem>
        <FormItem label="确认密码" prop="confirmPassword">
          <Input type="password" v-model="formUser.confirmPassword"></Input>
        </FormItem>
        <FormItem label="用户角色" >
          <CheckboxGroup  size="large" v-model="roleSelected">
            <Checkbox v-for="(item,index) in roles" :key="item.id"  :label="item.id">
              <span>{{item.name}}</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
        {{ formUser }}
      </Form>
      <div slot="footer" align="center">
        <Button type="success" size="large"  @click="saveUser">保存</Button>
      </div>
      <!--<Form  label-position="top">
        <FormItem label="Title">
          <Input ></Input>
        </FormItem>
        <FormItem label="Title name">
          <Input ></Input>
        </FormItem>
        <FormItem label="Aligned title">
          <Input ></Input>
        </FormItem>-->
    </Modal>
    <Row style="margin-bottom: 20px;">
      <Col span="8">
      <Button type="primary" size="large"  @click="handleAdd()">新增</Button>
      </Col>
      <Col span="10"> </Col>
      <Col span="1" style="float: right;"><div><Button type="primary" size="large" @click="handleRemove(index)">查找</Button></div></Col>
      <Col span="5" style="float: right;"><Input type="text" size="large"  placeholder="输入查找内容..."/></Col>

    </Row>
    <Table border :columns="columns7" :loading="loading"  :data="data6" stripe></Table>
    <div style="float: right;padding-top: 15px;" >
      <Page :total="dataCount" :page-size="1" show-total @on-change="changePage"></Page>
    </div>
  </div>
</template>
<script>
  export default {
    data () {
      const validateName = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('Please enter your username'));
        } else {
            this.$http.post(URL.validatorUsername,{name:value}).then(function(response){
                console.log(0 === response.data);
                if(0 === response.data){
                    callback(new Error("username alreay Used"));
                }
                callback();
            });
        }

      };
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter your password'));
        } else {
          if (this.formUser.confirmPassword !== '') {
            // 对第二个密码框单独验证
            this.$refs.formUser.validateField('confirmPassword');
          }
          callback();
        }
      };
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('Please enter your password again'));
        } else if (value !== this.formUser.confirmPassword) {
          callback(new Error('The two input passwords do not match!'));
        } else {
          callback();
        }
      };
      return {
        del: {
          modal: false,
          id: 0
        },
        roleSelected:[],
        formUser: {
           loginName: '',
           password: '',
           confirmPassword: ''
        },
        loading: true,
        pageSize: 2,
        data6: [],
        roles: [],
        dataCount: 0,
        ruleInline: {
          loginName: [{
            validator: validateName,
         //   required: true,
           // message: '请填写用户名',
            trigger: 'blur'
          }],
          password: [{
       //     required: true,
            message: '请填写密码',
            trigger: 'blur',
            validator: validatePass
          }, {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur',
          }],
          confirmPassword: [{
     //       required: true,
            message: '请填写密码',
            trigger: 'blur',
            validator: validatePassCheck
          }, {
            type: 'string',
            min: 6,
            message: '密码长度不能小于6位',
            trigger: 'blur'

          }]
        },
        columns7: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: 'Id',
            key: 'id',
            render: (h, params) => {
              return h('div', [
                h('Icon', {
                  props: {
                    type: 'person'
                  }
                }),
                h('strong', params.row.id)
              ]);
            }
          },
          {
            title: '账号',
            key: 'name'
          },
          {
            title: '密码',
            key: 'password'
          },
          {
            title: 'Action',
            key: 'action',
            width: 250,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'success',
                    size: 'default'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '查看'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'default'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.show(params.index)
                    }
                  }
                }, '修改'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'default'
                  },
                  on: {
                    click: () => {
                      this.remove(params.index)
                    }
                  }
                }, '删除')
              ]);
            }
          }
        ]
      }
    },
    methods: {
      show (index) {
        this.$Modal.info({
          title: 'User Info',
          content: `Id：${this.data6[index].id}<br>Name：${this.data6[index].name}<br>Password：${this.data6[index].password}`
        })
      },
      remove (index) {
        console.log(this.data6[index].id);
        this.$http.post(URL.userDeleteUrl,{id:this.data6[index].id}).then(function(response){
          this.data6.splice(index, 1);
        });

      },
      changePage (index) {
        this.$http.post(URL.userAllUrl,{page:(index-1),pageSize:this.pageSize}).then(function(response){
          console.log(response.data.data);
          console.log(response.data.count);
          this.data6 = JSON.parse(response.data.data);
          this.loading = false;
        });
        console.log(index);
        // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      },
      handleAdd () {
         this.$http.post(URL.roleAllUrl,null).then(function(response){
             this.roles = JSON.parse(response.data.data);
         })
         this.$set(this.del, 'modal', true);
      },
      saveUser () {
        console.log(this.roleSelected);
        var roles = this.roleSelected.join(',');
        console.log(roles);
        if(this.formUser.password != this.formUser.confirmPassword){
           console.log(this.formUser.loginName+" "+ this.formUser.password+" "+this.formUser.confirmPassword );
           this.$Message.error("密码不相等");
        }else{
           this.$http.post(URL.userSaveUrl,{name:this.formUser.loginName,password:this.formUser.password,roles:roles}).then(function(response){
              this.del.modal = false;
              this.$Modal.remove();
           });

        }

      }

    },
    mounted: function(){
        this.$nextTick(function () {
            this.$http.post(URL.userAllUrl,{page:0,pageSize:this.pageSize}).then(function(response){
              this.data6 = JSON.parse(response.data.data);
              console.log(this.data6);
              this.dataCount = response.data.count;
              this.loading = false;
            });
        })

        /*this.loading = false;
        return [
          {
            id: 'John Brown',
            name: 18,
            password: 'New York No. 1 Lake Park'
          },
          {
            name: 'Jim Green',
            age: 24,
            address: 'London No. 1 Lake Park'
          },
          {
            name: 'Joe Black',
            age: 30,
            address: 'Sydney No. 1 Lake Park'
          },
          {
            name: 'Jon Snow',
            age: 26,
            address: 'Ottawa No. 2 Lake Park'
          }
        ];*/

    }
  }
</script>
