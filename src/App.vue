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
          :gradient="options.gradient"
          :leftText="options.leftText"
          :leftWidth="leftWidth"
          :leftColor="colors[options.leftColor]"
          :rightText="options.rightText"
          :rightWidth="rightWidth"
          :rightColor="colors[options.rightColor]"
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
        el-form-item(:label="TEXT.leftColor")
          ul.options__color
            li(
              v-for="color,index in colors"
              :class="{active: options.leftColor === index}"
              :style="{background: color}"
              @click="$set(options, 'leftColor', index)"
            )
        el-form-item(:label="TEXT.rightText")
          el-input(v-model="options.rightText" clearable)
        el-form-item(:label="TEXT.rightColor")
          ul.options__color
            li(
              v-for="color,index in colors"
              :class="{active: options.rightColor === index}"
              :style="{background: color}"
              @click="$set(options, 'rightColor', index)"
            )
        el-form-item(:label="TEXT.roundedAngle")
          el-switch(
            v-model="options.roundedAngle"
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
          el-input(v-model="options.link" disabled)
            template(slot="append")
              el-button(
                ref="copyButton"
                v-clipboard="options.link"
                @success="$notify.success({title: TEXT.copy + TEXT.success})"
              ) {{TEXT.copy}}
        el-form-item
          el-button.download(
            @click="downloadImg"
          ) {{TEXT.download}}
          el-button.copy(
            @click="copyLink"
            :loading="loading"
          ) {{TEXT.createLink}}
  footer
    div
      span {{TEXT.fileSaver}}:&nbsp;
      a(href="https://gist.github.com/" target="_blank") gist.github.com
    div
      span {{TEXT.linkConvertor}}:&nbsp;
      a(href="http://raw.githack.com/" target="_blank") raw.githack.com
</template>

<script>
import TagSvg from './TagSvg.vue';
import uuid from 'uuid/v1'

const lang = window.navigator.language === 'zh-CN' ? 'zh' : 'en';
const TEXT = {
  en: {
    title: 'Customize NPM Logo',
    preview: 'Preview',
    result: 'Result',
    roundedAngle: 'Rounded',
    gradient: 'Gradient',
    leftText: 'Left Text',
    leftColor: 'Left Color',
    rightText: 'Right Text',
    rightColor: 'Right Color',
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
    leftColor: '左边底色',
    rightText: '右边文字',
    rightColor: '右边底色',
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
      gradient: true,
      leftText: 'build',
      rightText: 'passing',
      leftColor: 0,
      rightColor: 3,
      link: '',
    },
    generated: '',
    colors: [
      '#5F5F5F',
      '#E05D44',
      '#97CA00',
      '#44CC11',
      '#007EC6',
      '#7289DA',
    ],
    leftWidth: 0,
    rightWidth: 0,
    loading: false,
  }),

  mounted() {
    this.$github.authenticate({
      type: 'token',
      token: '7e61d5e0c33312b0d801bc22872d98243c944e69'
    })
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
        const newFileName = `${uuid()}.svg`;
        const { data } = await this.$github.gists.edit({
          gist_id: '49127a963e5ce752819f3579acb9fce8',
          description: 'npm customize logo',
          files: {
            [newFileName]: {
              content: this.$refs.content.$el.outerHTML,
            },
          },
        });
        const url = data.files[newFileName].raw_url || '';
        this.$set(this.options, 'link', url.replace('gist.githubusercontent.com', 'gistcdn.githack.com'));
        this.loading = false;
        this.$notify.success({title: TEXT.createLink + TEXT.success});
      } catch (err) {
        this.$notify.error({title: TEXT.errorMsg});
      }
    },
  },
};
</script>

<style lang="stylus">
body
  padding 0
  margin 0

#app
  font-family "DejaVu Sans", Verdana, Geneva, sans-serif
  color #2c3e50
  max-width 500px
  margin 0 auto
  display flex
  flex-direction column
  justify-content center
  align-items center
  border 1px solid #C43030
  border-radius 5px

input:focus
  border-color #C43030!important

header
  width 100%
  background #C43030
  color white
  line-height 50px
  text-align center

main
  width 100%
  box-sizing border-box
  // box-shadow 0 5px 10px rgba(black, .1)
  background white
  z-index 2
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
    padding 3px 5px

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
    &:hover
      transform scale(1.1)
    &.active
      border: 4px solid transparent

.copy
.download
  min-width 120px
  &:hover
    border-color #C43030
    color #C43030
    background #F3D6D6

footer
  margin-top -5px
  box-sizing border-box
  width 100%
  background #F3D6D6
  border-radius 5px
  padding 20px 20px 15px
  display flex
  color #C43030
  > div
    flex 1
  a
    color #C43030
</style>
