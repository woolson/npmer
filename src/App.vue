<template lang="pug">
div(id="app")
  header {{TEXT.title}}
  main
    section.preview
      div
        label {{TEXT.preview}}
        TagSvg(
          ref="content"
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
          el-input(v-model="options.link" readonly)
            template(slot="append")
              el-button(
                ref="copyButton"
                v-clipboard="options.link"
                @success="$notify.success({title: TEXT.copy + TEXT.success})"
              ) {{TEXT.copy}}
        div.options__button
          el-button.download(
            @click="downloadImg"
          ) {{TEXT.download}}
          el-button.copy(
            @click="copyLink"
            :loading="loading"
          ) {{TEXT.createLink}}
  //- footer
  //-   div
  //-     span {{TEXT.fileSaver}}:&nbsp;
  //-     a(href="https://gist.github.com/" target="_blank") gist.github.com
  //-   div
  //-     span {{TEXT.linkConvertor}}:&nbsp;
  //-     a(href="http://raw.githack.com/" target="_blank") raw.githack.com
</template>

<script>
import 'whatwg-fetch';
import TagSvg from './TagSvg.vue';

const lang = window.navigator.language === 'zh-CN' ? 'zh' : 'en';
const TEXT = {
  en: {
    title: 'Customize NPM Logo',
    preview: 'Preview',
    result: 'Result',
    roundedAngle: 'Rounded',
    gradient: 'Gradient',
    leftText: 'Left Text',
    rightText: 'Right Text',
    textShadow: 'Text Shadow',
    bgColor: 'Background Color',
    createLink: 'Create Link ',
    download: 'Download',
    errorMsg: 'Error, Try again later!',
    success: 'Success',
    link: 'Link',
    copy: 'Copy ',
    fileSaver: 'File Saver',
    linkConvertor: 'Link Convertor',
  },
  zh: {
    title: '自定义 NPM 徽标',
    preview: '预览',
    result: '结果',
    roundedAngle: '使用圆角',
    gradient: '渐变底色',
    leftText: '左边文字',
    rightText: '右边文字',
    textShadow: '文字阴影',
    bgColor: '标签底色',
    createLink: '生成链接',
    download: '下载',
    errorMsg: '请求出错，稍后重试！',
    success: '成功',
    link: '链接',
    copy: '复制',
    fileSaver: '文件存储',
    linkConvertor: '链接转换',
  },
}[lang];

export default {
  name: 'app',

  components: {
    TagSvg,
  },

  data: () => ({
    TEXT,
    options: {
      roundedAngle: true,
      textShadow: true,
      gradient: true,
      leftText: 'build',
      rightText: 'passing',
      bgColor: 3,
      link: '',
    },
    generated: '',
    colors: [
      { name: 'gray', value: '#5F5F5F' },
      { name: 'red', value: '#E05D44' },
      { name: 'green', value: '#97CA00' },
      { name: 'lightgreen', value: '#44CC11' },
      { name: 'blue', value: '#007EC6' },
      { name: 'purple', value: '#7289DA' },
    ],
    leftWidth: 0,
    rightWidth: 0,
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
  },

  methods: {
    async downloadImg() {
      const dataUrl = this.$refs.content.$el.outerHTML;
      const link = document.createElement('a');
      link.download = 'npm-logo.svg';
      link.href = `data:image/svg+xml;charset=utf-8,${dataUrl}`;
      link.click();
    },
    async copyLink() {
      try {
        this.loading = true;
        const {
          bgColor,
          rounded,
          leftText,
          rightText,
          gradient,
          textShadow,
        } = this.options;
        const names = [
          this.colors[bgColor].name,
          rounded ? 'rounded' : 'square',
          gradient ? 'gradient' : 'flat',
          textShadow ? 'shadow' : 'plain',
          leftText,
          rightText,
        ];
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
        this.$set(this.options, 'link', response.url);
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
html
body
  padding 0
  margin 0

#app
  font-family "Source Sans Pro", "Helvetica Neue", Arial, sans-serif;
  color #2c3e50
  max-width 100vw
  min-height 100vh
  box-sizing border-box
  margin 0 auto
  display flex
  flex-direction column
  justify-content flex-start
  align-items center
  border 10px solid #C43030
  border-radius 35px
  // background #C43030
  overflow hidden

input:focus
  border-color #C43030!important

header
  width 50%
  background #C43030
  color white
  line-height 1
  padding-bottom 10px
  text-align center
  border-radius 0 0 10px 10px

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
  div
    user-select none
    font-size 12px
    color white
    padding 3px 7px

.tag__left
  margin-right -1px

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
    border-color #C43030
    color #C43030
    background #F3D6D6


// footer
//   margin-top -5px
//   box-sizing border-box
//   width 100%
//   background #F3D6D6
//   border-radius 5px
//   padding 10px 10px 10px
//   display flex
//   flex-wrap wrap
//   color #C43030
//   font-size 13px
//   > div
//     flex 1
//     padding 5px 0
//     white-space nowrap
//   a
//     color #C43030
</style>
