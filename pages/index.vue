<template lang="pug">
main.home
  section.home__preview
    label {{$t('preview')}}
    tag-svg(
      ref="content"
      v-bind="options"
      :sort="sort"
      :iconScale.sync="options.iconScale")
  section.home__options
    el-form(
      ref="options"
      :model="options"
      label-width="100px")
      //- 文字标题
      draggable(v-model="sort" :move="checkMove")
        transition-group.sort-group(tag="div")
          div.sort-group__item(
            v-for="item,index in sort"
            :class="item.name"
            :key="index")
            span(
              :class="{'el-icon-rank': item.name === 'icon'}"
              ) &nbsp;{{$t(item.title)}}
            el-select(
              v-if="item.name === 'icon'"
              v-model="iconIndex"
              :placeholder="$t('select')"
              clearable
              filterable)
              el-option(
                v-for="item,index in icons"
                :key="item.id"
                :label="item[nameKey]"
                :value="index")
            el-input(
              v-else-if="item.name === 'left'"
              v-model="options.leftText"
              clearable)
            el-input(
              v-else-if="item.name === 'right'"
              v-model="options.rightText"
              clearable)
      //- 图标路径和缩放
      div.options__row
        el-form-item.u-flex(
          v-show="iconIndex === ''"
          :label="$t('iconPath')")
          el-input(
            v-model="options.iconPath"
            clearable)
            el-popover(
              slot="append"
              placement="bottom-start"
              :title="$t('help')"
              width="200"
              trigger="hover"
              :content="$t('helpIconPath')"
            )
              i.el-icon-question(slot="reference")
        el-form-item(:label="$t('iconScale')")
          el-input(
            v-model="options.iconScale"
            type="number"
            step="0.001"
          )
      //- 图标位置微调
      div.options__row
        el-form-item(:label="$t('iconXOffset')")
          el-input(
            v-model="options.iconX"
            type="number"
            step="1"
          )
        el-form-item(:label="$t('iconYOffset')")
          el-input(
            v-model="options.iconY"
            type="number"
            step="1"
          )
      el-form-item.u-flex(:label="$t('roundedAngle')")
        el-radio-group(v-model="options.angle")
          el-radio-button(label="square") {{$t('square')}}
          el-radio-button(label="rounded") {{$t('rounded')}}
          el-radio-button(label="circle") {{$t('circle')}}
      //- 阴影和渐变
      div.options__row
        div.options__switch
          label {{$t('textShadow')}}
          el-switch(v-model="options.textShadow")
        div.options__switch
          label {{$t('gradient')}}
          el-switch(v-model="options.gradient")
      //- 图标颜色
      el-form-item(
        :label="$t('iconColor')"
        v-show="options.iconPath")
        color-pick(
          v-model="options.iconColor"
          :colors="['#FFFFFF', ...colors]"
        )
      //- 左边文字和背景颜色
      pick-color(
        :textTitle="$t('leftTextColor')"
        :backgroundTitle="$t('leftBgColor')"
        :text.sync="options.leftTextColor"
        :background.sync="options.leftBgColor"
      )
      //- 右边文字和背景颜色
      pick-color(
        :textTitle="$t('rightTextColor')"
        :backgroundTitle="$t('rightBgColor')"
        :text.sync="options.rightTextColor"
        :background.sync="options.rightBgColor"
      )
      //- 链接
      link-copy(:link="link")
      //- 按钮
      div.options__button
        el-button(
          @click="downloadImg"
        ) {{$t('download')}}
        el-button(
          @click="createLink"
          :loading="loading"
        ) {{$t('createLink')}}
</template>

<script>
import Draggable from 'vuedraggable'
import axios from '~/plugins/axios'
import TagSvg from '~/components/tag-svg.vue'
import NpmerFoot from '~/components/npmer-foot.vue'
import LinkCopy from '~/components/home/link-copy.vue'
import PickColor from '~/components/home/pick-color.vue'
import ColorPick from '~/components/color-pick.vue'

export default {
  head () {
    return {
      title: this.$t('home') + ' - NPMer'
    }
  },

  components: {
    TagSvg,
    NpmerFoot,
    LinkCopy,
    PickColor,
    ColorPick,
    Draggable
  },

  data: () => ({
    icons: [],
    iconIndex: '',
    options: {
      angle: 'square',
      textShadow: false,
      gradient: false,
      leftText: 'welcome',
      leftTextColor: '#FFFFFF',
      leftBgColor: '#555555',
      rightText: 'programmer',
      rightTextColor: '#FFFFFF',
      rightBgColor: '#44CC11',
      iconColor: '#FFFFFF',
      iconPosition: 'left',
      iconY: 3,
      iconX: 5
    },
    link: '',
    markdownLink: '',
    loading: false,
    customPath: '',
    customScale: 0.13,
    sort: [
      { name: 'icon', title: 'icon' },
      { name: 'left', title: 'leftText' },
      { name: 'center', title: 'center' },
      { name: 'right', title: 'rightText' }
    ]
  }),

  computed: {
    nameKey () {
      return this.$i18n.locale === 'zh'
        ? 'nameZH'
        : 'nameEN'
    }
  },

  watch: {
    iconIndex: {
      handler (newValue) {
        if (newValue === '') {
          this.$set(this.options, 'iconPath', '')
          this.$set(this.options, 'iconScale', 1)
        } else {
          const { content } = this.icons[newValue]
          this.$set(this.options, 'iconPath', content)
        }
      },
      immediate: true
    },
    options: {
      handler () {
        this.link = ''
      },
      deep: true
    }
  },

  mounted () {
    this.fetchIcons()
  },

  methods: {
    async fetchIcons () {
      this.icons = await axios('/npmer/api/icon')
    },
    checkMove ({ draggedContext }) {
      return draggedContext.element.name === 'icon'
    },
    downloadImg () {
      const dataUrl = this.$refs.content.$el.outerHTML
      const link = document.createElement('a')
      link.download = 'npm-logo.svg'
      link.href = `data:image/svg+xmlcharset=utf-8,${dataUrl}`
      link.click()
    },
    async createLink () {
      try {
        this.loading = true
        const {
          leftText,
          leftTextColor,
          leftBgColor,
          rightText,
          rightTextColor,
          rightBgColor,
          gradient,
          textShadow,
          angle,
          iconIndex,
          iconColor,
          iconPath,
          iconPosition
        } = this.options
        const names = [
          leftText,
          leftTextColor.replace('#', '').toLowerCase(),
          leftBgColor.replace('#', '').toLowerCase(),
          rightText,
          rightTextColor.replace('#', '').toLowerCase(),
          rightBgColor.replace('#', '').toLowerCase(),
          angle,
          gradient ? 'gradient' : 'flat',
          textShadow ? 'shadow' : 'plain'
        ]
        // 名称格式
        // 左文字-左文字色-左底色-右文字-右文字色-右底色-图标名称-图标颜色-是否渐变-是否文字阴影-是否圆角
        // eslint-disable-next-line
        // leftText-leftColor-rightText-rightColor-iconName-iconColor-iconPosition-rounded-gradient-textShadow
        if (iconIndex !== '' && iconPath !== '') {
          let name = ''
          if (iconIndex === 0) {
            name = `custom${Date.now()}`
          } else {
            name = this.icons[iconIndex].name.toLowerCase()
          }
          names.splice(4, 0, name, iconColor.replace('#', '').toLowerCase(), iconPosition)
        }
        // console.log('[name]', `${names.join('-')}.svg`)
        const badgeLink = await axios({
          url: '/npmer/api/badge',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          data: {
            name: encodeURI(`${names.join('-')}.svg`),
            content: this.$refs.content.$el.outerHTML
          }
        })
        this.link = badgeLink
        this.loading = false
        this.$message.success(this.$t('createLink') + this.$t('success'))
      } catch (err) {
        // eslint-disable-next-line
        console.log(err)
        this.loading = false
        this.$message.error(this.$t(err.message))
      }
    },
    createTemplate () {
      if (!(this.options.leftText + this.options.rightText).includes('$VAR$')) {
        this.$message.warning(this.$t('pleaseInputVariable'))
        // return
      }
      // await axios({
      //   method: 'POST',
      //   url: '/npmer/api/template',
      //   data: {
      //     name:
      //   }
      // })
    }
  }
}
</script>

<style lang="stylus">
main
  display flex
  flex-direction column
  justify-content flex-start
  align-items center
  padding-bottom 20px
  border-radius 20px
  box-sizing border-box
  background $background-color
  padding-top 100px
  min-height 100vh
  > section
    width 680px
    background white
    padding 10px 0
    border-radius 10px
    margin-bottom 20px
    box-shadow 0 0 2px $color-border

.home__preview
  display flex
  flex-direction column
  align-items center
  justify-content center
  padding-bottom 20px
  box-sizing border-box
  label
    margin-bottom 15px
    font-size 20px

.preview__tag
  display flex
  // height 0px
  overflow hidden
  // color transparent
  background red
  font-family DejaVu Sans,Verdana,Geneva,sans-serif
  div
    user-select none
    font-size 12px
    color white
    padding 3px 7px
  .tag__left
    margin-right -1px

.home__options
  box-sizing border-box
  .el-select
    width 100%
  .el-form-item
    padding 10px 20px

.sort-group
  display flex
  padding 10px 20px

.sort-group__item
  display flex
  flex-direction column
  background $background-color
  padding 5px
  border-radius 5px
  border 1px solid $background-color
  &:not(.center)
    flex 1
  &:not(:last-child)
    margin-right 5px
  > span
    margin-bottom 10px
    text-align center
  &.icon span
    cursor move

.options__row > .el-form-item
  padding 0 !important

.options__row
  padding 10px 20px
  display flex
  > span
    flex 1
    text-align center
    font-size 14px
  .el-select input
    border-top-right-radius 0
    border-bottom-right-radius 0
  > .el-input
    &:nth-child(2) > input
      border-radius 0
    &:last-child > input
      border-top-left-radius 0
      border-bottom-left-radius 0
  .el-form-item
    flex 1

.options__color
  flex 1

.options__switch
  flex 1
  display flex
  align-items center
  // justify-content space-between
  padding 10px
  label
    font-size 14px
    margin-right 10px
  > div
    margin-right 15px

.options__button
  text-align center
  display flex
  padding 10px 20px
  button
    flex 1
</style>
