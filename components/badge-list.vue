<template lang="pug">
div.badge__list
  ul.badge__list__content(v-if="data.length")
    li.list__item(v-for="item,index in data")
      el-image.item__img(
        lazy
        :src="encode(baseUrl + item.name)"
      )
      div.item__option
        el-tooltip(:content="$t('copy')" placement="top")
          i.el-icon-link(
            v-clipboard="encode(baseUrl + item.name)"
            @click="$message.success($t('copy') + $t('success'))"
          )
            span {{$t('copy')}}
        el-tooltip(
          v-if="canLike"
          :content="item.stared ? $t('stared') : $t('star')"
          placement="top"
        )
          i(
            :class="item.stared ? 'el-icon-star-on' : 'el-icon-star-off'"
            @click="star(index)"
          )
            span {{item.stared ? $t('stared') : $t('star')}}
            span(v-if="item.stars > 0") ({{item.stars}})
  div.badge__list__empty(v-if="!loading && !data.length")
    img(src="~assets/img/empty.svg")
    span {{$t('empty')}}
</template>

<script>
import { mapState } from 'vuex'
import axios from '~/plugins/axios'

export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
    canLike: {
      type: Boolean,
      default: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      baseUrl: 'https://woolson.gitee.io/npmer-badge/'
    }
  },

  computed: {
    ...mapState(['account'])
  },

  methods: {
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
.badge__list
  width 100%

@media screen and (max-width: 1909px)
  .badge__list__content
    grid-template-columns repeat(5, 1fr)

@media screen and (max-width: 1539px)
  .badge__list__content
    grid-template-columns repeat(4, 1fr)

@media screen and (max-width: 1169px)
  .badge__list__content
    grid-template-columns repeat(3, 1fr)

@media screen and (max-width: 767px)
  .badge__list__content
    grid-template-columns repeat(2, 1fr)

@media screen and (max-width: 620px)
  .badge__list__content
    grid-template-columns repeat(1, 1fr)

.badge__list__content
  width 100%
  list-style none
  display grid
  padding 0
  margin 10px 0 20px 0
  grid-column-gap 20px

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
        margin-left 2px
        margin-bottom -2px

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
