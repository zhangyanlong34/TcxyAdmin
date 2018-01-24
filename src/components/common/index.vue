<style scoped>

.layout {
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
}

.layout-breadcrumb {

    padding: 10px 15px 0;
}

.layout-content {
    min-height: 700px;
    margin: 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
}

.layout-content-main {
    padding: 20px 10px;
}

.layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
}

.layout-menu-left {
    background: #464c5b;
    /*min-width: 100px;*/
}

.layout-header {
    height: 60px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
}

.layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
    line-height: 30px;
    color: white;
    text-align: center;
    vertical-align: middle;
    overflow: hidden;
}

.layout-ceiling-main a {
    color: #9ba7b5;
}

.layout-hide-text .layout-text {
    display: none;
}

.ivu-col {
    transition: width .2s ease-in-out;
}

</style>

<template>

<div class="layout" :class="{'layout-hide-text': spanLeft < 4}">

    <Row type="flex">
        <i-col :span="spanLeft" class="layout-menu-left">
            <Menu :active-name="setActive" theme="dark" width="auto" @on-select="routeTo">
                <div class="layout-logo-left">
                    <h3>后台管理</h3></div>
                <Menu-item v-for="(item,index) in page" :key="item.id" :name="item.route">
                  <Icon :type="item.icon" :size="iconSize"></Icon>
                  <span class="layout-text">{{ item.value }}</span>
                </Menu-item>
            </Menu>
        </i-col>
        <i-col :span="spanRight">
            <div class="layout-header">
                <i-button type="text" @click.native="toggleClick">
                    <Icon type="navicon" size="32"></Icon>
                </i-button>
                <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown" style="float: right;margin-right: 15px;margin-top: 20px;">
                  <a href="javascript:void(0)">
                    <span class="main-user-name" >{{ this.$route.params.username }}</span>
                    <Icon type="arrow-down-b"></Icon>
                  </a>
                  <DropdownMenu slot="list">
                    <DropdownItem name="ownSpace">个人中心</DropdownItem>
                    <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                  </DropdownMenu>
                </Dropdown>

            </div>
            <div class="layout-breadcrumb">
                <Breadcrumb>
                    <Breadcrumb-item>首页</Breadcrumb-item>
                    <Breadcrumb-item>页面</Breadcrumb-item>
                    <Breadcrumb-item>{{this.$route.path.replace('/','')}}</Breadcrumb-item>
                </Breadcrumb>
            </div>
            <div class="layout-content">
                <div class="layout-content-main">
                    <transition mode="out-in">
                        <router-view></router-view>
                    </transition>
                </div>
            </div>
            <div class="layout-copy">
                2011-2017 &copy; 天成信宇
            </div>
        </i-col>
    </Row>
</div>

</template>

<script>

import Menu from "iview/src/components/menu/menu";

export default {

  components: {Menu},
  data() {
    return {
      spanLeft: 4,
      spanRight: 20,
      page: []
    }
  },
  computed: {
    iconSize() {
      return this.spanLeft === 4 ? 14 : 24;
    },
    setActive() {
      return this.$route.path.replace('/', '');
    },
    page() {
      return [];
    }
  },
  methods: {
    toggleClick() {
      if (this.spanLeft === 4) {
        this.spanLeft = 2;
        this.spanRight = 22;
        this.$http.get('http://localhost:8080/user/login?username=admin&password=123456').then(function(response){
          console.log(response);
        },);
      } else {
        this.spanLeft = 4;
        this.spanRight = 20;
      }
    },
    routeTo(e) {
      console.log(e);
      this.$router.push(e);

    }
  },
  mounted: function () {
    var menus = mainPage.mainMenu;
    var showMenus = [];
    this.$http.post(URL.showMenu,null).then(function(response){
      var responseData = response.data;
      console.log(responseData.length);
      console.log(menus.length);
      for(var i=0;i< responseData.length; i++){
        for(var j=0;j<menus.length;j++){
          if(responseData[i].name == menus[j].value){

            showMenus.push(menus[j]);
          }
        }
      }
      this.page =  showMenus;
    });
  }
}

</script>
