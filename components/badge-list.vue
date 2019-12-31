<template lang="pug">
div.badge__list
  ul.badge__list__content(v-if="data.length")
    slot(
      v-for="item in data"
      v-bind="{item, canLike}"
    )
  div.badge__list__empty(v-if="!loading && !data.length")
    img(src="~assets/img/empty.svg")
    span {{$t('empty')}}
</template>

<script>
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
  }
}
</script>

<style lang="stylus" scoped>
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
