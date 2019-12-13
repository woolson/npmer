<template lang="pug">
div.market
  el-input.market__search(
    v-model="keyword"
    clearable
    :placeholder="$t('search')"
    @keyup.native.13="pageNum = 1; fetchTrend()"
    @clear="pageNum = 1; fetchTrend()"
  )
  h1.market__title
  ul.market__list
    li.list__item(v-for="item,index in data")
      el-image.item__img(
        lazy
        :src="encode(baseUrl + item.name)"
      )
      div.item__option
        el-tooltip(:content="$t('copy')" placement="top")
          i.el-icon-link(
            v-clipboard="encode(baseUrl + item.name)"
            @click="$notify.success({\
              title: $t('copy') + $t('success'),\
              position: 'bottom-right'\
            })"
          )
            span {{$t('copy')}}
        //- el-tooltip(content="自定义" placement="top")
        //-   i.el-icon-set-up
        el-tooltip(
          :content="item.stared ? $t('stared') : $t('star')"
          placement="top"
        )
          i(
            :class="item.stared ? 'el-icon-star-on' : 'el-icon-star-off'"
            @click="star(index)"
          )
            span {{item.stared ? $t('stared') : $t('star')}}
            span(v-if="item.stars > 0") {{item.stars}}
  el-pagination(
    background
    layout="prev, pager, next"
    :page-size="pageSize"
    :total="totalNum"
    :current-page="pageNum"
    @current-change="pageNum = $event"
  )
  //- npmer-foot
</template>

<script>
import { mapState } from 'vuex'
import axios from '~/plugins/axios'
import NpmerFoot from '~/components/npmer-foot.vue'

export default {
  components: {
    NpmerFoot
  },

  data () {
    return {
      baseUrl: 'https://woolson.gitee.io/npmer-badge/',
      keyword: '',
      pageNum: 1,
      pageSize: 50,
      totalNum: 0,
      data: []
    }
  },

  computed: {
    ...mapState(['account'])
  },

  watch: {
    pageNum: 'fetchTrend'
  },

  mounted () {
    this.fetchTrend()
  },

  methods: {
    async fetchTrend () {
      const resData = await axios({
        url: '/npmer/api/badge',
        params: {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          keyword: this.keyword
        }
      })
      this.data = resData.data
      this.totalNum = resData.total
    },
    async star (index) {
      try {
        if (!this.account) {
          this.$message.error(this.$t('shouldLogin'))
          return
        }
        const badge = this.data[index]
        if (badge.stared) { return }
        await axios({
          url: '/npmer/api/badge/star',
          method: 'POST',
          data: {
            badgeId: this.data[index].id
          }
        })
        badge.stars += 1
        badge.stared = true
        this.$set(this.data, index, badge)
        this.$message.success(this.$t('success'))
      } catch (err) {
        this.$message.error(err.message)
      }
    },
    encode (value) {
      return encodeURI(value)
    }
  }
}
</script>

<style lang="stylus" scoped>
.market
  display flex
  flex-direction column
  align-items center
  min-height 100vh
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

.market__list
  width 100%
  list-style none
  // width $body-width
  display grid
  padding 0
  margin 10px 0 20px 0
  grid-column-gap 20px

@media screen and (max-width: 1909px)
  .market__list
    grid-template-columns repeat(5, 1fr)

@media screen and (max-width: 1539px)
  .market__list
    grid-template-columns repeat(4, 1fr)

@media screen and (max-width: 1169px)
  .market__list
    grid-template-columns repeat(3, 1fr)

@media screen and (max-width: 767px)
  .market__list
    grid-template-columns repeat(2, 1fr)

@media screen and (max-width: 620px)
  .market__list
    grid-template-columns repeat(1, 1fr)

.list__item
  display flex
  align-items center
  justify-content center
  flex-direction column
  background white
  padding 20px 0
  border-radius 5px
  margin-bottom 20px
  box-shadow 0 0 2px $color-shadow
  &:hover i
    opacity 1 !important
  .item__img
    height 100px
    display flex
    align-items center
    >>> img
      height auto
    >>> .el-image__error
      background white
  .item__option
    margin-bottom -10px
    width 100%
    padding 0 10px
    box-sizing border-box
    display flex
    align-items center
    justify-content flex-end
    cursor pointer
    i
      margin-left 15px
      transition all .3s
      opacity .3
      display flex
      align-items center
      &.el-icon-star-on
        cursor not-allowed
      &.el-icon-link
      &.el-icon-set-up
        opacity 0
      &:hover
        color $color-main
      span
        font-size 12px
        margin-left 3px
</style>
