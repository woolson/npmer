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
        el-form-item(:label="TEXT.roundedAngle")
          el-switch(
            v-model="options.roundedAngle"
            active-color="#13ce66"
            inactive-color="#ff4949"
            active-text="ON"
            inactive-text="OFF"
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
        el-form-item
          el-button.download(
            @click="downloadImg"
          ) {{TEXT.download}}
          el-button.copy(
            @click="copyLink"
          ) {{TEXT.copyLink}}
</template>

<script>
import TagSvg from './TagSvg.vue'

const lang = window.navigator.language === 'zh-CN' ? 'zh' : 'en';
const TEXT = {
  en: {
    title: 'Customize NPM Logo',
    preview: 'Preview',
    result: 'Result',
    roundedAngle: 'Rounded',
    leftText: 'Left Text',
    leftColor: 'Left Color',
    rightText: 'Right Text',
    rightColor: 'Right Color',
    copyLink: 'Copy Link',
    download: 'Download',
  },
  zh: {
    title: '自定义 NPM 徽标',
    preview: '预览',
    result: '结果',
    roundedAngle: '使用圆角',
    leftText: '左边文字',
    leftColor: '左边底色',
    rightText: '右边文字',
    rightColor: '右边底色',
    copyLink: '复制链接',
    download: '下载',
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
      leftText: 'build',
      rightText: 'passing',
      leftColor: 0,
      rightColor: 3,
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
  }),

  watch: {
    'options.leftText': {
      handler: function() {
        this.$nextTick(() => {
          const $leftText = document.querySelector('.tag__left')
          this.leftWidth = $leftText.offsetWidth
        })
      },
      immediate: true,
    },
    'options.rightText': {
      handler: function() {
        this.$nextTick(() => {
          const $rightWidth = document.querySelector('.tag__right')
          this.rightWidth = $rightWidth.offsetWidth
        })
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

header
  width 100%
  background #C43030
  color white
  line-height 50px
  text-align center

main
  padding 20px
  width 100%
  box-sizing border-box

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

.options
  margin-top 10px

.tag
  display flex
  div
    user-select none
    font-size 12px
    color white
    padding 3px 5px

.tag__left
  margin-right -1px

.options
  margin 20px 0

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

.start
.download
  width 100px
</style>
