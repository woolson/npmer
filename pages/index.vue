<template lang="pug">
div.home
  main
    section.preview
      div
        label {{TEXT.preview}}
        tag-svg(
          ref="content"
          v-bind="options"
          :iconScale.sync="options.iconScale"
        )
        div.tag
          div.tag__left {{options.leftText}}
          div.tag__right {{options.rightText}}
    section.options
      el-form(
        ref="options"
        :model="options"
        label-width="100px"
      )
        div.options__row
          span {{TEXT.icon}}
          span {{TEXT.leftText}}
          span {{TEXT.rightText}}
        div.options__row.u-bb
          el-select(
            v-model="options.iconIndex"
            :placeholder="TEXT.select"
            clearable
          )
            el-option(
              v-for="item,index in icons"
              :key="item.name"
              :label="item.name"
              :value="index"
            )
          el-input(
            v-model="options.leftText"
            clearable
          )
          el-input(
            v-model="options.rightText"
            clearable
          )
        el-form-item.u-bb.u-flex(
          v-show="options.iconIndex === 0"
          :label="TEXT.iconPath"
        )
          el-input(v-model="options.iconPath" clearable)
            el-popover(
              slot="append"
              placement="bottom-end"
              :title="TEXT.help"
              width="200"
              trigger="hover"
              :content="TEXT.helpIconPath"
            )
              i.el-icon-question(slot="reference")
        div.options__row.u-bb
          el-form-item(:label="TEXT.iconScale")
            el-input(
              v-model="options.iconScale"
              type="number"
              step="0.001"
            )
          el-form-item(:label="TEXT.iconPosition")
            el-radio-group(v-model="options.iconPosition" fill="#C43030")
              el-radio-button(label="left") {{TEXT.left}}
              el-radio-button(label="right") {{TEXT.right}}
        div.options__row.u-bb
          el-form-item(:label="TEXT.iconXOffset")
            el-input(
              v-model="options.iconX"
              type="number"
              step="1"
            )
          el-form-item(:label="TEXT.iconYOffset")
            el-input(
              v-model="options.iconY"
              type="number"
              step="1"
            )
        div.options__row.u-bb
          div.options__switch
            label {{TEXT.roundedAngle}}
            el-switch(
              v-model="options.roundedAngle"
              active-color="#13ce66"
              inactive-color="#ff4949"
            )
          div.options__switch
            label {{TEXT.textShadow}}
            el-switch(
              v-model="options.textShadow"
              active-color="#13ce66"
              inactive-color="#ff4949"
            )
          div.options__switch
            label {{TEXT.gradient}}
            el-switch(
              v-model="options.gradient"
              active-color="#13ce66"
              inactive-color="#ff4949"
            )
        el-form-item.u-bb(
          :label="TEXT.iconColor"
          v-show="options.iconPath")
          color-pick(
            v-model="options.iconColor"
            :colors="['#FFFFFF', ...colors]"
          )
        div.options__row.u-bb
          el-form-item.options__color(:label="TEXT.leftTextColor")
            color-pick(
              v-model="options.leftTextColor"
              :colors="['#FFFFFF', '#444']"
            )
          el-form-item.options__color(:label="TEXT.leftBgColor")
            color-pick(
              v-model="options.leftBgColor"
              :colors="['#555555', ...colors]"
            )
        div.options__row.u-bb
          el-form-item.options__color(:label="TEXT.rightTextColor")
            color-pick(
              v-model="options.rightTextColor"
              :colors="['#FFFFFF', '#444']"
            )
          el-form-item.options__color(:label="TEXT.rightBgColor")
            color-pick(
              v-model="options.rightBgColor"
              :colors="['#555555', ...colors]"
            )
        el-form-item.u-bb(:label="TEXT.link")
          el-input(v-model="link" readonly)
            template(slot="append")
              el-button(
                v-clipboard="link"
                @success="$notify.success({title: TEXT.copy + TEXT.success})"
              ) {{TEXT.copy}}
        el-form-item.u-bb(:label="TEXT.markdown")
          el-input(v-model="markdownLink" readonly)
            template(slot="append")
              el-button(
                v-clipboard="markdownLink"
                @success="$notify.success({title: TEXT.copy + TEXT.success})"
              ) {{TEXT.copy}}
        div.options__button
          el-button.download(
            @click="downloadImg"
          ) {{TEXT.download}}
          el-button.copy(
            @click="createLink"
            :loading="loading"
          ) {{TEXT.createLink}}
</template>

<script>
// import 'whatwg-fetch'
import TagSvg from '~/components/tag-svg.vue'
import ColorPick from '~/components/color-pick.vue'
import Icons from '~/assets/js/icons'
import Text from '~/assets/js/text'

export default {
  components: {
    'tag-svg': TagSvg,
    'color-pick': ColorPick
  },

  data: () => ({
    TEXT: Text,
    icons: [{ name: 'Custom' }, ...Icons],
    options: {
      roundedAngle: false,
      textShadow: false,
      gradient: false,
      leftText: 'welcome',
      leftTextColor: '#FFFFFF',
      leftWidth: 0,
      leftBgColor: '#555555',
      rightText: 'programmer',
      rightTextColor: '#FFFFFF',
      rightWidth: 0,
      rightBgColor: '#44CC11',
      iconIndex: 0,
      iconColor: '#FFFFFF',
      iconPosition: 'left',
      iconY: 3,
      iconX: 5
    },
    colors: [
      '#E05D44',
      '#DFB317',
      '#44CC11',
      '#46BC99',
      '#007EC6',
      '#7289DA'
    ],
    link: '',
    markdownLink: '',
    loading: false,
    customPath: '',
    customScale: 0.13
  }),

  watch: {
    'options.leftText': {
      handler () {
        this.$nextTick(() => {
          let { offsetWidth } = document.querySelector('.tag__left')
          if (this.options.leftText === '') {
            offsetWidth = 0
          }
          this.$set(this.options, 'leftWidth', offsetWidth)
        })
      },
      immediate: true
    },
    'options.iconPosition': 'updateRightWidth',
    'options.iconPath': 'updateRightWidth',
    'options.rightText': {
      handler () {
        this.$nextTick(() => {
          this.updateRightWidth()
        })
      },
      immediate: true
    },
    'options.iconIndex': {
      handler (newValue) {
        const {
          scale,
          path,
          name
        } = this.icons[newValue] || {}

        if (name === 'Custom') {
          this.$set(this.options, 'iconPath', '')
          this.$set(this.options, 'iconScale', 1)
        } else {
          this.$set(this.options, 'iconPath', path || '')
          this.$set(this.options, 'iconScale', scale || 0)
        }
      },
      immediate: true
    },
    options: {
      handler () {
        this.link = ''
        this.markdownLink = ''
      },
      deep: true
    }
  },

  methods: {
    updateRightWidth () {
      const { rightText, iconPath, iconPosition } = this.options
      let { offsetWidth } = document.querySelector('.tag__right')
      if (rightText === '') {
        offsetWidth = 0
        if (iconPosition === 'right' && iconPath !== '') {
          offsetWidth = 7
        }
      }

      this.$set(this.options, 'rightWidth', offsetWidth)
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
          rounded,
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
          rounded ? 'rounded' : 'square',
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
        const response = await fetch('https://woolson.cn/npmer/api/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: encodeURI(`${names.join('-')}.svg`),
            content: this.$refs.content.$el.outerHTML
          })
        }).then(res => res.json())
        this.link = response.url
        this.markdownLink = `![${leftText}](${response.url})`
        this.loading = false
        this.$notify.success({
          title: this.TEXT.createLink + this.TEXT.success
        })
      } catch (err) {
        // eslint-disable-next-line
        console.error(err)
        this.$notify.error({
          title: this.TEXT.errorMsg
        })
      }
    }
  }
}
</script>

<style lang="stylus">
.el-form-item
  margin-bottom 0 !important
  padding 10px 0

.el-form-item__content
  display flex

.el-radio-button__inner:hover
  color $color-main

.options__row > .el-form-item
  padding 0 !important

.home
  max-width $body-width
  min-width 300px
  box-sizing border-box
  margin 0 auto
  display flex
  flex-direction column
  justify-content flex-start
  align-items center
  // border 10px solid $color-main
  border-radius 38px
  padding-bottom 20px

.options__row
  padding 10px 0
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

input:focus
  border-color $color-main !important

.el-select-dropdown__item
  font-family $font
  &.selected
    color $color-main

.header__right
  margin-right -10px
  right 0
  &:after
    border-radius 6px 0 0 0

main
  width 100%
  box-sizing border-box
  z-index 2
  background white
  border-radius 20px
  > section
    background #F8F8FA
    padding 10px 20px
    border-radius 10px
    margin-top 20px
    // box-shadow 0 0 15px rgba(black, .1)

.preview
  padding 20px 0
  label
    margin-bottom 15px
    font-size 20px
  > div
    display flex
    flex-direction column
    justify-content center
    align-items center
    flex 1
    text-align center
    svg
      transform scale(1.1)

.tag
  display flex
  height 0px
  overflow hidden
  color transparent
  font-family DejaVu Sans,Verdana,Geneva,sans-serif
  div
    user-select none
    font-size 12px
    color white
    padding 3px 7px

.tag__left
  margin-right -1px

.options .el-select
  width 100%

.options__button
  text-align center
  display flex
  padding 10px 0
  button
    flex 1

.copy
.download
  min-width 120px
  &:hover
    border-color $color-main
    color $color-main
    background #F3D6D6

footer
  img
    width 30px
</style>
