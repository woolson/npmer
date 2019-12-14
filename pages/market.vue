<template lang="pug">
div.market
  el-input.market__search(
    v-model="keyword"
    clearable
    :placeholder="$t('search')"
    @keyup.native.13="pageNum = 1; fetchData()"
    @clear="pageNum = 1; fetchData()"
  )
  h1.market__title
  badge-list(:data="data" :loading="loading")
  el-pagination(
    background
    :hide-on-single-page="true"
    layout="prev, pager, next"
    :page-size="pageSize"
    :total="totalNum"
    :current-page="pageNum"
    @current-change="pageNum = $event"
  )
  //- npmer-foot
</template>

<script>
import axios from '~/plugins/axios'
import NpmerFoot from '~/components/npmer-foot.vue'
import BadgeList from '~/components/badge-list.vue'

export default {
  head () {
    return {
      title: this.$t('market') + ' - NPMer'
    }
  },

  components: {
    NpmerFoot,
    BadgeList
  },

  data () {
    return {
      keyword: '',
      pageNum: 1,
      pageSize: 50,
      totalNum: 0,
      data: [],
      loading: false
    }
  },

  watch: {
    pageNum: 'fetchData'
  },

  mounted () {
    this.fetchData()
  },

  methods: {
    async fetchData () {
      try {
        this.loading = true
        const resData = await axios({
          url: '/npmer/api/badge',
          params: {
            pageNum: this.pageNum,
            pageSize: this.pageSize,
            keyword: this.keyword
          }
        })
        this.loading = true
        this.data = resData.data
        this.totalNum = resData.total
      } catch {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.market
  display flex
  flex-direction column
  align-items center
  padding 0 50px 50px
  background $background-color

.market__search
  max-width 600px
  width 100%
  margin 100px 20px 0 20px
  font-size 16px
  >>> input
    text-align center

.market__title
  width 100%
  margin-top 30px
  font-size 24px
  font-weight bold
  border-bottom 1px solid darken($background-color, 4)
  line-height 50px

</style>
