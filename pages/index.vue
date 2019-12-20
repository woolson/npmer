<template lang="pug">
main.home
  section.home__preview
    label {{$t('preview')}}
    tag-svg(
      ref="content"
      v-bind="options"
      :iconScale.sync="options.iconScale")
  section.home__options
    el-form(
      ref="options"
      :model="options"
      label-width="100px")
      //- 文字标题
      div.options__row
        span {{$t('icon')}}
        span {{$t('leftText')}}
        span {{$t('rightText')}}
      //- 文字输入
      div.options__row
        el-select(
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
          v-model="options.leftText"
          clearable)
        el-input(
          v-model="options.rightText"
          clearable)
      //- 图标Path
      el-form-item.u-flex(
        v-show="iconIndex === ''"
        :label="$t('iconPath')")
        el-input(
          v-model="options.iconPath"
          clearable)
          el-popover(
            slot="append"
            placement="bottom-end"
            :title="$t('help')"
            width="200"
            trigger="hover"
            :content="$t('helpIconPath')"
          )
            i.el-icon-question(slot="reference")
      //- 图标位置和缩放
      div.options__row
        el-form-item(:label="$t('iconScale')")
          el-input(
            v-model="options.iconScale"
            type="number"
            step="0.001"
          )
        el-form-item(:label="$t('iconPosition')")
          el-radio-group(v-model="options.iconPosition" fill="#C43030")
            el-radio-button(label="left") {{$t('left')}}
            el-radio-button(label="right") {{$t('right')}}
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
      //- 圆角和渐变
      div.options__row
        div.options__switch
          label {{$t('roundedAngle')}}
          el-switch(
            v-model="options.roundedAngle"
            active-color="#13ce66"
            inactive-color="#ff4949"
          )
        div.options__switch
          label {{$t('textShadow')}}
          el-switch(
            v-model="options.textShadow"
            active-color="#13ce66"
            inactive-color="#ff4949"
          )
        div.options__switch
          label {{$t('gradient')}}
          el-switch(
            v-model="options.gradient"
            active-color="#13ce66"
            inactive-color="#ff4949"
          )
      //- 图标颜色
      el-form-item(
        :label="$t('iconColor')"
        v-show="options.iconPath")
        color-pick(
          v-model="options.iconColor"
          :colors="['#FFFFFF', ...colors]"
        )
      //- 左边文字和背景颜色
      div.options__row
        el-form-item.options__color(:label="$t('leftTextColor')")
          color-pick(
            v-model="options.leftTextColor"
            :colors="['#FFFFFF', '#444']"
          )
        el-form-item.options__color(:label="$t('leftBgColor')")
          color-pick(
            v-model="options.leftBgColor"
            :colors="['#555555', ...colors]"
          )
      //- 右边文字和背景颜色
      div.options__row
        el-form-item.options__color(:label="$t('rightTextColor')")
          color-pick(
            v-model="options.rightTextColor"
            :colors="['#FFFFFF', '#444']"
          )
        el-form-item.options__color(:label="$t('rightBgColor')")
          color-pick(
            v-model="options.rightBgColor"
            :colors="['#555555', ...colors]")
      //- 链接
      el-form-item(:label="$t('link')")
        el-input(v-model="link" readonly)
          template(slot="append")
            el-button(
              v-clipboard="link"
              @success="$notify.success({\
                title: $t('copy') + $t('success'),\
                position: 'bottom-right'\
              })"
            ) {{$t('copy')}}
          //- 链接markdown
      el-form-item(:label="$t('markdown')")
        el-input(v-model="markdownLink" readonly)
          template(slot="append")
            el-button(
              v-clipboard="markdownLink"
              @success="$notify.success({\
                title: $t('copy') + $t('success'),\
                position: 'bottom-right'\
              })"
            ) {{$t('copy')}}
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
import axios from '~/plugins/axios'
import TagSvg from '~/components/tag-svg.vue'
import ColorPick from '~/components/color-pick.vue'
// import Icons from '~/assets/js/icons'
import NpmerFoot from '~/components/npmer-foot.vue'

export default {
  head () {
    return {
      title: this.$t('home') + ' - NPMer'
    }
  },

  components: {
    TagSvg,
    ColorPick,
    NpmerFoot
  },

  data: () => ({
    icons: [],
    iconIndex: '',
    options: {
      roundedAngle: false,
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
        this.markdownLink = ''
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
        this.markdownLink = `![${leftText}](${badgeLink})`
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
