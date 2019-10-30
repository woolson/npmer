<template lang="pug">
div(id="app")
  header {{TEXT.title}}
  div.github-info
    iframe(
      src="https://ghbtns.com/github-btn.html?user=woolson&repo=npmer-page&type=star&count=true"
      frameborder="0"
      scrolling="0"
      width="100px"
      height="20px"
    )
    iframe(
      src="https://ghbtns.com/github-btn.html?user=woolson&repo=npmer-page&type=fork&count=true"
      frameborder="0"
      scrolling="0"
      width="100px"
      height="20px"
    )
  main
    section.preview
      div
        label {{TEXT.preview}}
        tag-svg(
          ref="content"
          v-bind="options"
          :leftWidth="leftWidth"
          :rightWidth="rightWidth"
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
        el-form-item.u-bb(
          v-show="options.iconIndex === 13"
          :label="TEXT.iconPath"
        )
          el-input(v-model="options.iconPath" clearable)
        div.options__row.u-bb(
          v-show="options.iconIndex === 13"
        )
          el-form-item.u-bb(:label="TEXT.iconScale")
            el-input(
              v-model="options.iconScale"
              type="number"
              step="0.001"
              min="0"
            )
          el-form-item.u-bb(:label="TEXT.iconPosition")
            el-radio-group(v-model="options.iconPosition")
              el-radio-button(label="left") {{TEXT.left}}
              el-radio-button(label="right") {{TEXT.right}}
        div.options__row.u-bb(v-show="options.iconIndex === 13")
          el-form-item.u-bb(:label="TEXT.iconXOffset")
            el-input(
              v-model="options.iconX"
              type="number"
              step="1"
              min="0"
            )
          el-form-item.u-bb(:label="TEXT.iconYOffset")
            el-input(
              v-model="options.iconY"
              type="number"
              step="1"
              min="0"
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
        el-form-item.options__color.u-bb(:label="TEXT.leftBgColor")
          color-pick(
            v-model="options.leftBgColor"
            :colors="['#555555', ...colors]"
          )
        el-form-item.options__color.u-bb(:label="TEXT.rightBgColor")
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
import 'whatwg-fetch';
import TagSvg from './tag-svg.vue';
import ColorPick from './color-pick.vue';
import Icons from './icons';
import Text from './text';

export default {
  name: 'app',

  components: {
    'tag-svg': TagSvg,
    'color-pick': ColorPick,
  },

  data: () => ({
    TEXT: Text,
    icons: [...Icons, { name: 'Custom' }],
    options: {
      roundedAngle: true,
      textShadow: true,
      gradient: true,
      leftText: 'welcome',
      rightText: 'programmer',
      iconIndex: 13,
      iconColor: '#E05D44',
      leftBgColor: '#555555',
      rightBgColor: '#44CC11',
      iconPosition: 'left',
      iconY: 3,
      iconX: 5,
    },
    colors: [
      '#E05D44',
      '#DFB317',
      '#44CC11',
      '#46BC99',
      '#007EC6',
      '#7289DA',
    ],
    link: '',
    markdownLink: '',
    leftWidth: 0,
    rightWidth: 0,
    iconPath: '',
    iconScale: 0,
    loading: false,
    customPath: '',
    showCustom: false,
    customScale: 0.13,
  }),

  mounted() {
    // setTimeout(() => {
    //   this.$set(this.options, 'iconIndex', null);
    //   this.$set(this.options, 'iconColor', '#FFFFFF');
    // }, 3000);
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
          name,
        } = this.icons[newValue] || {};

        if (name === 'Custom') {
          this.$set(this.options, 'iconScale', 0.013);
        } else {
          this.$set(this.options, 'iconPath', path || '');
          this.$set(this.options, 'iconScale', scale || 0);
        }
      },
      immediate: true,
    },
    options: {
      handler() {
        this.link = '';
        this.markdownLink = '';
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
    onCustom() {
      this.$set(this.options, 'iconPath', this.customPath || '');
      this.$set(this.options, 'iconScale', this.customScale / 10 || 0);
      this.showCustom = false;
    },
    async createLink() {
      try {
        this.loading = true;
        const {
          leftText,
          leftBgColor,
          rightText,
          rightBgColor,
          gradient,
          textShadow,
          rounded,
          iconIndex,
          iconColor,
        } = this.options;
        const names = [
          leftText,
          leftBgColor.replace('#', '').toLowerCase(),
          rightText,
          rightBgColor.replace('#', '').toLowerCase(),
          rounded ? 'rounded' : 'square',
          gradient ? 'gradient' : 'flat',
          textShadow ? 'shadow' : 'plain',
        ];
        // 名称格式
        // 左文字-左底色-右文字-右底色-图标名称-图标颜色-是否渐变-是否文字阴影-是否圆角
        // leftText-leftColor-rightText-rightColor-iconName-iconColor-gradient-textShadow-rounded
        if (iconIndex) {
          let name = '';
          if (iconIndex === 13) {
            name = `custom${Date.now()}`;
          } else {
            name = this.icons[iconIndex].name.toLowerCase();
          }
          names.splice(4, 0, name, iconColor.replace('#', '').toLowerCase());
        }
        // console.log('[name]', `${names.join('-')}.svg`)
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
          title: this.TEXT.createLink + this.TEXT.success,
        });
      } catch (err) {
        // eslint-disable-next-line
        console.error(err);
        this.$notify.error({
          title: this.TEXT.errorMsg,
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

.u-bb
  position relative
  &:after
    bottom 0
    content ' '
    position absolute
    left 0
    width 100%
    height 1px
    z-index 0
    transition all .2s
    background #EFEFEF
    transform scaleY(0.5)
    transform-origin 50%100%

.u-mb10
  margin-bottom 10px !important

.el-form-item
  margin-bottom 0
  padding 10px 0

#app
  font-family $font
  color #2c3e50
  width 100vw
  max-width 600px
  min-width 300px
  min-height 100vh
  box-sizing border-box
  margin 0 auto
  display flex
  flex-direction column
  justify-content flex-start
  align-items center
  // border 10px solid $main
  border-radius 38px
  padding-bottom 20px

.options__row
  padding 10px 0
  display flex
  span
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

.options__switch
  flex 1
  display flex
  align-items center
  justify-content space-between
  padding 10px
  label
    font-size 14px
  > div
    margin-right 15px

input:focus
  border-color $main!important

.el-select-dropdown__item
  font-family $font
  &.selected
    color $main

header
  margin-top 20px
  padding 15px 40px
  background $main
  color white
  line-height 1
  text-align center
  border-radius 5px
  position relative
  font-size 20px

.github-info
  margin-top 20px
  display flex

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
    border-color $main
    color $main
    background #F3D6D6

footer
  img
    width 30px
</style>
