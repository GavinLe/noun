<template>
  <el-container>
    <aside-bar></aside-bar>
    <el-container>
      <el-header>
        <header-bar @initMainDone="handleInitMainDone"></header-bar>
      </el-header>
      <el-main>
        <div class="el-main-wrapper">
          <breadcrumb></breadcrumb>
          <transition>
            <router-view :initDone="initDone"></router-view>
          </transition>
        </div>
        <footer-bar></footer-bar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>

  import HeaderBar from './HeaderBar';
  import AsideBar from './AsideBar';
  import FooterBar from './FooterBar';
  import Breadcrumb from 'components/breadcrumb/Breadcrumb';

  export default {
    components: {
      HeaderBar,
      FooterBar,
      AsideBar,
      Breadcrumb
    },
    data () {
      return {
        initDone: false
      };
    },
    methods: {
      handleInitMainDone() {
        this.initDone = true;
      }
    },
    created() {
    },
    mounted() {
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss">
  .el-container {
    min-height: 100%;
    // background-color: #f6f7fb;
    background-color: #f5f7f9;
    .el-header {
      padding: 0;
    }
    .el-main {
      padding: 0 20px;
      display: flex;
      flex-direction: column;
      .el-main-wrapper {
        flex:1;
      }
      .el-footer {
        flex: 0 0 60px;
      }
    }
    .breadcrumb-inner {
      height: 20px;
      line-height: 20px;
      margin: 10px 0;
    }

  }
  .el-breadcrumb__inner {
    color: #979fa6;
  }

  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: #979fa6;
  }
</style>
