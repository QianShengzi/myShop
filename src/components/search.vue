<template>
  <div>
    <!-- 搜索栏 -->
    <form action="/">
      <van-search
        v-model="search"
        background="#ff4d5a"
        show-action
        placeholder="请输入搜索关键词"
        @search="onSearch"
      >
        <template #action>
          <div @click="onSearch">搜索</div>
        </template>
      </van-search>
    </form>
  </div>
</template>

<script>
export default {
  name: "Search"
};
</script>

<style lang="less" scoped>
.van-search {
  padding: 6px;
}

.van-search__content {
  border-radius: 10px;
  border: 1px solid #ff1527;
}
.van-search__action {
  color: #fff;
}
</style>