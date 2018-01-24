<template>
  <div style="margin: 10px;overflow: hidden">
    <Modal
      width="400"
      v-model="del.modal"
      title="新增角色">
      <Form  ref="formUser" label-position="left" :model="formRole" :rules="ruleInline"  :label-width="100">
        <FormItem label="用户名" prop="roleName">
          <Input type="text" v-model="formRole.roleName"></Input>
        </FormItem>
        <!--<FormItem label="权限" prop="permission">
          <Input type="text" v-model="formRole.permission"></Input>
        </FormItem>-->
        <FormItem label="权限" v-for="(item,index) in permissions"  :key="item.id"  :label="item.name"  >
          <CheckboxGroup  size="large"  v-model="permission[index]" >
            <Checkbox :key="8" :label="8">
              <span>增</span>
            </Checkbox>
            <Checkbox :key="4" :label="4">
              <span>删</span>
            </Checkbox>
            <Checkbox :key="2" :label="2">
              <span>改</span>
            </Checkbox>
            <Checkbox :key="1" :label="1">
              <span>查</span>
            </Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
      <div slot="footer" align="center">
        <Button type="success" size="large"  @click="saveRole">保存</Button>
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
        formRole: {
          roleName: '',
          permission: '',
        },
        permission:[],
        loading: true,
        pageSize: 1,
        data6: [],
        permissions: [],
        dataCount: 0,
        ruleInline: {
          username: [{
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
            title: '角色名',
            key: 'name'
          },
          {
            title: '权限',
            key: 'permission'
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
        this.data6.splice(index, 1);
      },
      changePage (index) {
        this.$http.post(URL.roleAllUrl,{page:(index-1),pageSize:this.pageSize}).then(function(response){
          console.log(response.data.data);
          console.log(response.data.count);
          this.data6 = JSON.parse(response.data.data);
          this.loading = false;
        });
        console.log(index);
        // The simulated data is changed directly here, and the actual usage scenario should fetch the data from the server
      },
      handleAdd () {
        this.$http.post(URL.permissionAllUrl,null).then(function(response){
          this.permissions = JSON.parse(response.data.data);
        })
        this.$set(this.del, 'modal', true);
      },
      saveRole () {
        var permission = this.permission;
        console.log(this.permissions);
        var permissionSave = '';
        var sum = 0;
        for(var per in permission){
          for(var t in permission[per]){
             sum += permission[per][t];
             console.log(permission[per][t]);
          }
          if(permissionSave == '') {
            permissionSave = this.permissions[per].id + ":" + sum;
          }else{
            permissionSave = permissionSave + ';' + this.permissions[per].id + ":" + sum;
          }
          sum = 0;
        }
        console.log(permissionSave);
        this.$http.post(URL.roleSaveUrl,{name:this.formRole.roleName,permission:permissionSave}).then(function(response){
            this.del.modal = false;
        });

      }

    },
    mounted: function(){
      this.$nextTick(function () {
        this.$http.post(URL.roleAllUrl,{page:0,pageSize:this.pageSize}).then(function(response){
          console.log(response.status);
          this.data6 = JSON.parse(response.data.data);
          this.dataCount = response.data.count;
          this.loading = false;
        }).catch(function (err) {
            console.log(err);

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
