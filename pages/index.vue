<template lang="pug">
main.home
  section.home__preview
    label {{$t('base.preview')}}
    tag-svg(
      ref="content"
      v-bind="options"
      :sort="sort"
      :iconScale.sync="options.iconScale"
      :iconWidth.sync="options.iconWidth"
    )
    div.preview__mock
      span(ref="leftText") {{options.leftText}}
      span(ref="rightText") {{options.rightText}}
  section.home__options
    el-form(
      ref="options"
      :model="options"
      label-width="100px")
      //- 文字排序
      draggable.sort-group(v-model="sort" :move="checkMove")
        div.sort-group__item(
          v-for="item,index in sort"
          :class="item.name"
          :key="item.name")
          span(
            :class="{'el-icon-rank': item.name === 'icon'}"
            ) {{$t(item.title)}}
          el-select(
            v-if="item.name === 'icon'"
            v-model="iconIndex"
            :placeholder="$t('base.select')"
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
      el-form-item.u-flex(
        v-show="iconIndex === 0"
        :label="$t('iconPath')"
      )
        el-input(
          v-model="options.iconPath"
          disabled
          size="small"
          clearable)
          el-button(
            slot="append"
            @click="iconMarketVisible = true"
          ) {{$t('base.select')}}
      //- 图标位置微调
      div.options__row(v-show="options.iconPath")
        el-form-item(:label="$t('iconXOffset')")
          el-input-number(
            v-model="options.iconX"
            size="small"
            :step="0.5"
          )
        el-form-item(:label="$t('iconYOffset')")
          el-input-number(
            v-model="options.iconY"
            size="small"
            :step="0.5"
          )
      //- 图标颜色和重置
      div.options__row(v-show="options.iconPath")
        el-form-item(:label="$t('iconColor')")
          color-pick(
            v-model="options.iconColor"
            :colors="['#FFFFFF', ...colors]"
          )
        el-form-item(:label="$t('iconPosition')")
          el-button(
            type="primary"
            size="small"
            @click="iconPositionReset"
          ) {{$t('base.reset')}}
      //- 阴影和渐变
      div.options__row
        el-form-item(:label="$t('textShadow')")
          el-switch(v-model="options.textShadow")
      //- 圆角
      div.options__row
        el-form-item(:label="$t('bgGradient')")
          el-switch(v-model="options.gradient")
        el-form-item.u-flex(:label="$t('bgAngle')")
          el-radio-group(v-model="options.angle" size="mini")
            el-radio-button(label="square")
              i.iconfont.icon-square
            el-radio-button(label="rounded")
              i.iconfont.icon-rounded
            el-radio-button(label="circle")
              i.iconfont.icon-circle
      //- 左边文字和背景颜色
      pick-color(
        :textTitle="$t('leftTextColor')"
        :backgroundTitle="$t('leftBgColor')"
        :text.sync="options.leftTextColor"
        :background.sync="options.leftBgColor"
        backgroundDefault="#555555"
      )
      //- 右边文字和背景颜色
      pick-color(
        :textTitle="$t('rightTextColor')"
        :backgroundTitle="$t('rightBgColor')"
        :text.sync="options.rightTextColor"
        :background.sync="options.rightBgColor"
        backgroundDefault="#C43030"
      )
      //- 链接
      link-copy(:link="link")
      //- 按钮
      div.options__button(v-if="editTemplateId")
        el-button(
          type="primary"
          @click=""
        ) {{$t('base.cancel')}}
        el-button(
          type="primary"
          @click="updateTemplate"
        ) {{$t('updateTemplate')}}
      div.options__button(v-else)
        el-button(
          type="primary"
          @click="downloadImg"
        ) ↓ {{$t('base.download')}}
        el-button(
          type="primary"
          @click="createLink"
        ) + {{$t('base.link')}}
        el-button(
          type="primary"
          @click="createTemplate"
        ) + {{$t('base.template')}}
        el-popover(
          placement="top"
          :title="$t('base.tip')"
          width="200"
          trigger="hover"
          :content="$t('message.useTemplate')"
        )
          i.el-icon-info(slot="reference")
      el-alert(
        :title="$t('base.warn')"
        type="warning"
        :description="$t('message.accessLater')"
        :closable="false"
        show-icon)
  icon-market(
    v-model="iconMarketVisible"
    @change="options.iconPath = $event; iconMarketVisible= false"
  )
</template>

<script>
import { mapState } from 'vuex'
import Draggable from 'vuedraggable'
import axios from '~/plugins/axios'
import TagSvg from '~/components/home/tag-svg.vue'
import NpmerFoot from '~/components/npmer-foot.vue'
import LinkCopy from '~/components/home/link-copy.vue'
import PickColor from '~/components/home/pick-color.vue'
import ColorPick from '~/components/color-pick.vue'
import IconMarket from '~/components/home/icon-market.vue'

const DEFAULT_OPTION = {
  angle: 'square',
  textShadow: false,
  gradient: false,
  leftText: 'welcome',
  leftTextWidth: 0,
  leftTextColor: '#FFFFFF',
  leftBgColor: '#555555',
  rightText: 'programmer',
  rightTextWidth: 0,
  rightTextColor: '#FFFFFF',
  rightBgColor: '#C43030',
  iconColor: '#FFFFFF',
  iconPosition: 'left',
  iconPath: '',
  iconScale: 0,
  iconWidth: 0,
  iconY: 3,
  iconX: 5
}

export default {
  head () {
    return {
      title: this.$t('base.home') + ' | NPMer'
    }
  },

  components: {
    TagSvg,
    NpmerFoot,
    LinkCopy,
    PickColor,
    ColorPick,
    Draggable,
    IconMarket
  },

  data: () => ({
    editTemplateId: false,
    iconMarketVisible: false,
    icons: [],
    iconIndex: '',
    options: {},
    link: '',
    markdownLink: '',
    customPath: '',
    customScale: 0.13,
    sort: [
      { name: 'icon', title: 'base.icon' },
      { name: 'left', title: 'leftText' },
      { name: 'center', title: 'base.center' },
      { name: 'right', title: 'rightText' }
    ]
  }),

  computed: {
    ...mapState(['account']),
    nameKey () {
      return this.$i18n.locale === 'zh'
        ? 'nameZH'
        : 'nameEN'
    }
  },

  watch: {
    iconIndex (newValue) {
      if (newValue === 0) {
        this.$set(this.options, 'iconPath', '')
      } else {
        const { content } = this.icons[newValue] || {}
        this.$set(this.options, 'iconPath', content)
      }
    },
    'options.leftText' () {
      const $leftText = this.$refs.leftText
      this.$nextTick(() => {
        this.$set(this.options, 'leftTextWidth', $leftText.offsetWidth)
      })
    },
    'options.rightText' () {
      const $rightText = this.$refs.rightText
      this.$nextTick(() => {
        this.$set(this.options, 'rightTextWidth', $rightText.offsetWidth)
      })
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
    this.enterEdit()
    this.options = { ...DEFAULT_OPTION }
  },

  activated () {
    this.enterEdit()
  },

  methods: {
    async fetchIcons () {
      this.icons = [
        { nameEN: 'Customize', nameZH: '自定义' },
        ...await axios('/npmer/api/icon')
      ]
    },
    iconPositionReset () {
      this.options.iconX = 5
      this.options.iconY = 3
    },
    checkMove ({ draggedContext }) {
      return draggedContext.element.name === 'icon'
    },
    checkExist (url) {
      return new Promise((resolve, reject) => {
        const img = document.createElement('img')
        img.onload = () => resolve(true)
        img.onerror = () => resolve(false)
        img.src = url
      })
    },
    downloadImg () {
      const dataUrl = this.$refs.content.$el.outerHTML.replace(/<!---->/g, '')
      const link = document.createElement('a')
      link.download = 'npm-logo.svg'
      link.href = `data:image/svg+xmlcharset=utf-8,${encodeURIComponent(dataUrl)}`
      link.click()
    },
    getSortName () {
      let items = [...this.sort]
      if (this.iconIndex === '') {
        items = items.filter(item => item.name !== 'icon')
      }
      return items
        .reduce((p, n) => (p += n.name[0]), '')
        .toLowerCase()
    },
    getIconName () {
      let name = ''
      switch (this.iconIndex) {
        case '':
          name = 'none'
          break
        case 0:
          if (this.iconPath) {
            name = `custom${Date.now()}`
          } else {
            name = 'none'
          }
          break
        default:
          name = '' + this.icons[this.iconIndex].id
          break
      }
      return name.toLowerCase()
    },
    async createLink () {
      try {
        /**
         * 名称格式
         * 排序-图标名-左字-左字色-左底色-右字-右字色-右底色-图标颜色-是否渐变-是否文字阴影-是否圆角
         */
        const iconName = this.getIconName()
        const name = [
          this.getSortName(),
          iconName,
          iconName === 'none'
            ? 'none'
            : this.options.iconColor.toLowerCase(),
          this.options.leftText,
          this.options.leftTextColor.toLowerCase(),
          this.options.leftBgColor.toLowerCase(),
          this.options.rightText,
          this.options.rightTextColor.toLowerCase(),
          this.options.rightBgColor.toLowerCase(),
          this.options.angle[0].toLowerCase(),
          this.options.gradient ? 't' : 'f',
          this.options.textShadow ? 't' : 'f'
        ].join('-').replace(/#/g, '') + '.svg'

        const iconLink = 'https://woolson.gitee.io/npmer-badge/' + name
        const iconExist = await this.checkExist(iconLink)

        if (iconExist) {
          this.link = iconLink
        } else {
          const badgeLink = await axios({
            responseType: 'json',
            url: '/npmer/api/badge',
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            data: {
              name: encodeURI(name),
              content: this.$refs.content.$el.outerHTML
            }
          })
          this.link = badgeLink
        }
        this.$message.success(this.$t('createLink') + this.$t('base.success'))
      } catch (err) {
        // eslint-disable-next-line
        console.log(err)
        this.$message.error(this.$t(err.message))
      }
    },
    async createTemplate () {
      try {
        if (!this.account) {
          this.$alert(this.$t('message.shouldLogin'), this.$t('base.tip'), {
            confirmButtonText: this.$t('base.login')
          }).then(() => {
            location.href = 'https://github.com/login/oauth/authorize?client_id=c03fba868563cbf34940&redirect_uri=https://woolson.cn/npmer/api/github/callback&state=123123sadh1as12'
          })
          return
        }
        const config = {
          ...this.options,
          sort: this.sort
        }
        const templateId = await axios({
          method: 'POST',
          url: '/npmer/api/template',
          data: {
            config: JSON.stringify(config)
          }
        })
        this.$router.push({
          path: '/template/my?page=1',
          query: { id: templateId }
        })
      } catch (err) {
        this.$message.error(this.$t(err.message))
      }
    },
    enterEdit () {
      const editTemplate = localStorage.getItem('template-edit')
      if (editTemplate) {
        const templateData = JSON.parse(editTemplate)
        const config = JSON.parse(templateData.config)
        this.editTemplateId = templateData.id
        this.sort = config.sort
        Object.keys(this.options).forEach((key) => {
          this.$set(this.options, key, config[key])
        })
        localStorage.removeItem('template-edit')
      } else {
        this.editTemplateId = ''
      }
    },
    async updateTemplate () {
      try {
        const config = {
          ...this.options,
          sort: this.sort
        }
        await axios({
          method: 'PUT',
          url: `/npmer/api/template/${this.editTemplateId}`,
          data: {
            config: JSON.stringify(config)
          }
        })
        this.$router.push('/template/my?page=1')
      } catch (err) {
        this.$message.error(this.$t(err.message))
      }
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
  box-sizing border-box
  background var(--background-color)
  padding-top 100px
  > section
    width 680px
    background var(--background-color-mid)
    padding 15px 0
    border-radius 10px
    margin-bottom 20px
    box-shadow 0 0 2px $color-border
  .el-form-item
    flex 1
    display flex
    align-items center
  .el-form-item__content
    margin-left 0 !important
  .el-input-number--small
    width 215px
  .el-form-item__label
    flex-shrink 0
    color var(--text-color)
  .el-input__inner
    background var(--background-color-light)
    border-color var(--border-color)

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

.preview__mock
  font-family Verdana,sans-serif
  font-size 12px
  height 0
  overflow hidden

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
  background var(--background-color)
  padding 5px
  border-radius 5px
  border 1px solid transparent
  transition all .3s
  &:not(.center)
    flex 1
  &:not(:last-child)
    margin-right 5px
  > span
    margin-bottom 10px
    line-height 24px
    text-align center
  &.icon
    transition all .2s
    span
      cursor move
    &:hover
      box-shadow 0 0 3px rgba(black, .15)
  &.sortable-ghost
    border 1px solid $color-main
  input
    text-align center
    background var(--background-color-mid) !important

.options__row
  .el-switch
    height 40px
  > .el-form-item
    padding 0 !important
    align-items center

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
  justify-content center
  padding 10px 20px
  button
    min-width 100px
  .el-icon-info
    color var(--text-color)
    margin-right -30px
    cursor help
    opacity .6
</style>
