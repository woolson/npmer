<template lang="pug">
div.common-list(:class="account ? 'has-login' : ''")
  el-input.list__search(
    v-if="showSearch"
    v-model="keyword"
    clearable
    :placeholder="$t('base.search')"
    @keyup.native.13="pageNum = 1; fetchData()"
    @clear="pageNum = 1; fetchData()"
  )
  h1.list__title(v-if="showSearch")
  el-pagination(
    background
    :hide-on-single-page="true"
    layout="prev, pager, next"
    :page-size="pageSize"
    :total="total"
    :current-page="pageNum"
    @current-change="pageNum = $event"
  )
  div.badge__list
    ul.badge__list__content(v-if="data.length")
      slot(
        v-for="item in data"
        v-bind="item"
      )
    div.badge__list__empty(v-if="!loading && !data.length")
      img(src="~assets/img/empty.svg")
      span {{$t('base.empty')}}
  el-pagination(
    background
    :hide-on-single-page="true"
    layout="prev, pager, next"
    :page-size="pageSize"
    :total="total"
    :current-page="pageNum"
    @current-change="pageNum = $event"
  )
</template>

<script>
import { mapState } from 'vuex'
import axios from '~/plugins/axios'

export default {
  props: {
    showSearch: {
      type: Boolean,
      default: false
    },
    data: {
      type: Array,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    updateData: {
      type: Function,
      default: () => {}
    }
  },

  data () {
    const pageNum = +this.$route.query.page || 1
    return {
      keyword: '',
      pageNum,
      pageSize: 30,
      loading: false
    }
  },

  computed: {
    ...mapState(['account'])
  },

  watch: {
    pageNum: {
      handler: 'fetchData',
      immediate: true
    }
  },

  methods: {
    async fetchData () {
      this.$router.push({
        path: this.$route.fullPath,
        query: { page: this.pageNum }
      })
      try {
        this.loading = true
        await this.updateData(this.$data)
        this.loading = false
      } catch {
        this.loading = false
      }
    },
    async like (badge) {
      try {
        if (!this.account) {
          this.$message.error(this.$t('message.shouldLogin'))
          return
        }
        const index = this.data.findIndex(o => o.id === badge.id)
        if (badge.stared) { return }
        await axios({
          url: '/npmer/api/badge/star',
          method: 'POST',
          data: { badgeId: badge.id }
        })
        badge.stars += 1
        badge.stared = true
        this.$set(this.data, index, badge)
        this.$message.success(this.$t('base.success'))
      } catch (err) {
        this.$message.error(err.message)
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
.common-list
  display flex
  flex-direction column
  align-items center
  padding 100px 50px 50px
  background var(--background-color)
  &.has-login
    padding 130px 50px 50px

.list__search
  margin-top 10px
  max-width 600px
  width 100%
  font-size 16px
  >>> input
    text-align center
    background var(--background-color-mid) !important

.list__title
  width 100%
  margin-top 30px
  font-size 24px
  font-weight bold
  border-bottom 1px solid var(--border-color)
  line-height 50px

@media screen and (max-width: 1909px)
  .badge__list__content
    grid-template-columns repeat(5, 1fr) !important

@media screen and (max-width: 1539px)
  .badge__list__content
    grid-template-columns repeat(4, 1fr) !important

@media screen and (max-width: 1169px)
  .badge__list__content
    grid-template-columns repeat(3, 1fr) !important

@media screen and (max-width: 767px)
  .badge__list__content
    grid-template-columns repeat(2, 1fr) !important

@media screen and (max-width: 620px)
  .badge__list__content
    grid-template-columns repeat(1, 1fr) !important

.badge__list
  width 100%

.badge__list__content
  width 100%
  list-style none
  display grid
  padding 0
  margin 20px 0
  grid-column-gap 20px
  grid-template-columns repeat(5, 1fr)

.badge__list__empty
  display flex
  flex-direction column
  align-items center
  img
    width 8vw
    margin-top 100px
  span
    margin-top 10px
    color #cdcdcd
    font-size 20px
</style>
