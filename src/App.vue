<template lang="pug">
div(id="app")
  header NPM Logo Customize
  main
    section.preview
      div
        label Preview
        div.tag(:class="options.angleType.toLowerCase()")
          div.tag__left(:style="leftBg") {{options.leftText}}
          div.tag__right(:style="rightBg") {{options.rightText}}
      div
        label Result
        img(:src="generated")
    section.options
      el-form(
        ref="options"
        :model="options"
        label-width="100px"
      )
        el-form-item(label="Angle Type")
          el-radio-group(v-model="options.angleType")
            el-radio(label="Rounded")
            el-radio(label="Right")
        el-form-item(label="Left Text")
          el-input(v-model="options.leftText" clearable)
        el-form-item(label="Left Color")
          ul.options__color
            li(
              v-for="color,index in colors"
              :class="{active: options.leftColor === index}"
              :style="{background: color}"
              @click="$set(options, 'leftColor', index)"
            )
        el-form-item(label="Right Text")
          el-input(v-model="options.rightText" clearable)
        el-form-item(label="Right Color")
          ul.options__color
            li(
              v-for="color,index in colors"
              :class="{active: options.rightColor === index}"
              :style="{background: color}"
              @click="$set(options, 'rightColor', index)"
            )
      el-button.start(
        @click="generateImg"
      ) Generate
</template>

<script>
import Dom2Image from 'dom-to-image'
import Color from 'color'

export default {
  name: 'app',

  data: () => ({
    options: {
      angleType: 'Rounded',
      leftText: 'leftText',
      rightText: 'rightText',
      leftColor: 0,
      rightColor: 3
    },
    generated: '',
    colors: ['#5F5F5F', '#E05D44', '#97CA00', '#44CC11', '#007EC6', '#7289DA']
  }),

  computed: {
    leftBg () {
      let color = this.colors[this.options.leftColor]
      let darkColor = Color(color).darken(0.1).hex()
      return {
        background: `linear-gradient(to bottom, ${color}, ${darkColor})`
      }
    },
    rightBg () {
      let color = this.colors[this.options.rightColor]
      let darkColor = Color(color).darken(0.1).hex()
      return {
        background: `linear-gradient(to bottom, ${color}, ${darkColor})`
      }
    }
  },

  methods: {
    async generateImg () {
      try {
        const $content = document.querySelector('.tag')
        this.generated = await Dom2Image.toSvg($content)
      } catch (err) {
        console.log(err)
      }
    }
  }
};
</script>

<style lang="stylus">
#app
  font-family "DejaVu Sans", Verdana, Geneva, sans-serif
  text-align center
  color #2c3e50
  width 500px
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
  overflow hidden
  div
    font-size 12px
    color white
    padding 3px 5px
    text-anchor middle
    font-size 110
    text-shadow 0 1px 0 rgba(black, .3)
  &.rounded
    border-radius 4px

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
    border: 2px solid white
    border-left none
    border-right none
    &:hover
      transform scale(1.2)
    &.active
      border: 2px solid #C43030

.start
  width 100px
</style>