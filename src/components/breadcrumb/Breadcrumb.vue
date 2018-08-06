<template>
  <el-breadcrumb class="app-breadcrumb" separator=">">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item v-for="(item, index) in levelList" :key="index">
        <router-link :to="item.path" v-if="item.path && item.meta.isRoute !=false">{{item.name}}</router-link>
        <span v-else>{{item.name}}</span>
      </el-breadcrumb-item>
    </transition-group>
  </el-breadcrumb>
</template>

<script>
  export default {
    data() {
      return {
        levelList: null
      };
    },
    watch: {
      $route() {
        this.getBreadcrumb();
      }
    },
    methods: {
      getBreadcrumb() {
        this.levelList = this.$route.matched.filter(item => item.name);
      }
    },
    created() {
      this.getBreadcrumb();
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .app-breadcrumb.el-breadcrumb {
    display: inline-block;
    font-size: 14px;
    line-height: 50px;
    margin-left: 10px;
    .no-redirect {
      color: #97a8be;
      cursor: text;
    }
  }
</style>
