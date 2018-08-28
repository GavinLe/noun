<template>
  <div class="ysd-aside">
    左边菜单
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';

  export default {
    components: {},
    data () {
      return {
        defaultActive: ''
      };
    },
    computed: {
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      },
      toHome: function () {
        this.$router.push({path: '/home'});
      }
    },
    created() {
    },
    mounted() {
      this.defaultActive = this.$route.path;
    }
  };
</script>

<style rel="stylesheet/scss" scoped lang="scss">
  .noun-aside {
    flex: 0 0 1;
    background-color: #393a41;
    .el-menu--collapse {
      width: 57px;
    }
    .el-menu-vertical:not(.el-menu--collapse) {
      width: 177px;
    }
  }
</style>
