<template>
  <el-footer>
    Copyright @ 2018 xxx科技有限公司 | <a href="http://www.baidu.com" target="_blank">www.yoorstore.com</a>
  </el-footer>
</template>

<script>
  import { mapGetters } from 'vuex';

  export default {
    data() {
        return {
        };
    },
    computed: {
    },
    methods: {
    },
    created () {
    }
  };

</script>

<style rel="stylesheet/scss" lang="scss">
  .el-container {
    .el-footer {
      color: #b0b6bd;
      text-align: center;
      height: 60px;
      line-height: 60px;
      a {
        text-decoration:underline !important
      }
    }
  }
</style>
