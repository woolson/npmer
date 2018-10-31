<template lang="pug">
div(id="app")
  header {{TEXT.title}}
    div.header__left
    div.header__right
  main
    section.preview
      div
        label {{TEXT.preview}}
        TagSvg(
          ref="content"
          :iconPath="iconPath"
          :iconScale="iconScale"
          :iconWidth="iconWidth"
          :roundedAngle="options.roundedAngle"
          :textShadow="options.textShadow"
          :gradient="options.gradient"
          :leftText="options.leftText"
          :leftWidth="leftWidth"
          :rightText="options.rightText"
          :rightWidth="rightWidth"
          :bgColor="colors[options.bgColor].value"
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
        el-form-item(:label="TEXT.leftText")
          el-input(v-model="options.leftText" clearable)
        el-form-item(:label="TEXT.rightText")
          el-input(v-model="options.rightText" clearable)
        el-form-item(:label="TEXT.icon")
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
        el-form-item(:label="TEXT.bgColor")
          ul.options__color
            li(
              v-for="color,index in colors"
              :class="{active: options.bgColor === index}"
              :style="{background: color.value}"
              @click="$set(options, 'bgColor', index)"
            )
        el-form-item(:label="TEXT.roundedAngle")
          el-switch(
            v-model="options.roundedAngle"
            active-color="#13ce66"
            inactive-color="#ff4949"
          )
        el-form-item(:label="TEXT.textShadow")
          el-switch(
            v-model="options.textShadow"
            active-color="#13ce66"
            inactive-color="#ff4949"
          )
        el-form-item(:label="TEXT.gradient")
          el-switch(
            v-model="options.gradient"
            active-color="#13ce66"
            inactive-color="#ff4949"
          )
        el-form-item(:label="TEXT.link")
          el-input(v-model="link" readonly)
            template(slot="append")
              el-button(
                v-clipboard="link"
                @success="$notify.success({title: TEXT.copy + TEXT.success})"
              ) {{TEXT.copy}}
        el-form-item(:label="TEXT.markdown")
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
  footer
    a(href="https://github.com/woolson/npmer-page" target="_blank")
      img(src="../public/images/github.svg")
</template>

<script>
import 'whatwg-fetch';
import TagSvg from './tag-svg.vue';
import Icons from './icons';

const lang = window.navigator.language === 'zh-CN' ? 'zh' : 'en';
const TEXT = {
  en: {
    bgColor: 'Background Color',
    copy: 'Copy ',
    createLink: 'Create Link ',
    download: 'Download',
    errorMsg: 'Error, Try again later!',
    fileSaver: 'File Saver',
    gradient: 'Gradient',
    icon: 'Icon',
    leftText: 'Left Text',
    link: 'Link',
    linkConvertor: 'Link Convertor',
    markdown: 'Markdown',
    preview: 'Preview',
    result: 'Result',
    rightText: 'Right Text',
    roundedAngle: 'Rounded',
    select: 'Select',
    success: 'Success',
    textShadow: 'Text Shadow',
    title: 'Customize NPM Badge',
  },
  zh: {
    bgColor: '标签底色',
    copy: '复制',
    createLink: '生成链接',
    download: '下载',
    errorMsg: '请求出错，稍后重试！',
    fileSaver: '文件存储',
    gradient: '渐变底色',
    icon: '图标',
    leftText: '左边文字',
    link: '链接',
    linkConvertor: '链接转换',
    markdown: 'Markdown',
    preview: '预览',
    result: '结果',
    rightText: '右边文字',
    roundedAngle: '使用圆角',
    select: '请选择',
    success: '成功',
    textShadow: '文字阴影',
    title: '在生成NPM徽标链接',
  },
}[lang];

export default {
  name: 'app',

  components: {
    TagSvg,
  },

  data: () => ({
    TEXT,
    icons: Icons,
    options: {
      roundedAngle: true,
      textShadow: true,
      gradient: true,
      leftText: 'build',
      rightText: 'passing',
      bgColor: 0,
    },
    generated: '',
    colors: [
      { name: 'gray', value: '#666666' },
      { name: 'lightgray', value: '#9F9F9F' },
      { name: 'red', value: '#E05D44' },
      { name: 'orange', value: '#FE7D37' },
      { name: 'green', value: '#97CA00' },
      { name: 'yellow', value: '#DFB317' },
      { name: 'lightgreen', value: '#44CC11' },
      { name: 'blue', value: '#007EC6' },
      { name: 'purple', value: '#7289DA' },
    ],
    link: '',
    markdownLink: '',
    leftWidth: 0,
    rightWidth: 0,
    iconWidth: 0,
    iconPath: '',
    iconScale: 0,
    loading: false,
  }),

  mounted() {
    this.$github.authenticate({
      type: 'token',
      token: '4bce9d1b5cd068cbcce2b693cbfec38225122433',
    });
  },

  watch: {
    'options.leftText': {
      handler() {
        this.$nextTick(() => {
          const $leftText = document.querySelector('.tag__left');
          this.leftWidth = $leftText.offsetWidth;
        });
      },
      immediate: true,
    },
    'options.rightText': {
      handler() {
        this.$nextTick(() => {
          const $rightWidth = document.querySelector('.tag__right');
          this.rightWidth = $rightWidth.offsetWidth;
        });
      },
      immediate: true,
    },
    'options.iconIndex': {
      handler(newValue) {
        const {
          scale,
          path,
        } = this.icons[newValue] || {};
        this.iconPath = path || '';
        this.iconScale = scale || 0;
      },
      immediate: true,
    },
    options: {
      handler() {
        this.link = '';
      },
      deep: true,
    },
  },

  methods: {
    async downloadImg() {
      const dataUrl = this.$refs.content.$el.outerHTML;
      const link = document.createElement('a');
      link.download = 'npm-logo.svg';
      link.href = `data:image/svg+xml;charset=utf-8,${dataUrl}`;
      link.click();
    },
    async createLink() {
      try {
        this.loading = true;
        const {
          bgColor,
          rounded,
          leftText,
          rightText,
          gradient,
          textShadow,
          iconIndex,
        } = this.options;
        const names = [
          this.colors[bgColor].name,
          rounded ? 'rounded' : 'square',
          gradient ? 'gradient' : 'flat',
          textShadow ? 'shadow' : 'plain',
          leftText,
          rightText,
        ];
        if (iconIndex) names.push(this.icons[iconIndex].name.toLowerCase());
        const response = await fetch('https://woolson.cn/npmer/api/fetch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: encodeURI(`${names.join('-')}.svg`),
            content: this.$refs.content.$el.outerHTML,
          }),
        }).then(res => res.json());
        this.link = response.url;
        this.markdownLink = `![${leftText}](${response.url})`;
        this.loading = false;
        this.$notify.success({
          title: TEXT.createLink + TEXT.success,
        });
      } catch (err) {
        // eslint-disable-next-line
        console.error(err);
        this.$notify.error({
          title: TEXT.errorMsg,
        });
      }
    },
  },
};
</script>

<style lang="stylus">
$main = #C43030
$font = "Source Sans Pro", "Helvetica Neue", Arial, sans-serif

html
body
  padding 0
  margin 0

#app
  font-family $font
  color #2c3e50
  width 100vw
  max-width 500px
  min-width 300px
  min-height 100vh
  box-sizing border-box
  margin 0 auto
  display flex
  flex-direction column
  justify-content flex-start
  align-items center
  border 10px solid $main
  border-radius 38px
  overflow hidden
  padding-bottom 20px

input:focus
  border-color $main!important

.el-select-dropdown__item
  font-family $font
  &.selected
    color $main

header
  padding 4px 40px 12px 40px
  background $main
  color white
  line-height 1
  text-align center
  border-radius 0 0 18px 18px
  position relative

.header__left
.header__right
  position absolute
  width 10px
  height 10px
  top 0
  background $main
  &:after
    display block
    content ' '
    height 10px
    width 10px
    border-radius 0 6px 0 0
    background white
.header__left
  margin-left -10px
  left 0

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
    padding 20px

.preview
  display flex
  label
    margin-bottom 10px
  > div
    display flex
    flex-direction column
    justify-content center
    align-items center
    flex 1
    text-align center

.tag
  display flex
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

.options__color
  padding 0
  margin 0
  display flex
  list-style none
  padding 8px 0
  li
    width 20px
    height 20px
    transition transform .2s
    border-left none
    border-right none
    cursor pointer
    &:not(.active):hover
      transform scale(1.1)
    &.active
      border: 2px solid transparent

.options__button
  text-align center
  display flex
  button
    flex 1

.copy
.download
  min-width 120px
  &:hover
    border-color $main
    color $main
    background #F3D6D6

footer
  img
    width 30px
//   margin-top -5px
//   box-sizing border-box
//   width 100%
//   background #F3D6D6
//   border-radius 5px
//   padding 10px 10px 10px
//   display flex
//   flex-wrap wrap
//   color $main
//   font-size 13px
//   > div
//     flex 1
//     padding 5px 0
//     white-space nowrap
//   a
//     color $main
</style>
