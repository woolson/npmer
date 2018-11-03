<template lang="pug">
div(id="app")
  header {{TEXT.title}}
    div.header__left
    div.header__right
  main
    section.preview
      div
        label {{TEXT.preview}}
        tag-svg(
          ref="content"
          :gradient="options.gradient"
          :roundedAngle="options.roundedAngle"
          :textShadow="options.textShadow"
          :iconPath="options.iconPath"
          :iconScale="options.iconScale"
          :iconColor="options.iconColor"
          :leftText="options.leftText"
          :rightText="options.rightText"
          :leftWidth="leftWidth"
          :rightWidth="rightWidth"
          :leftBgColor="options.leftBgColor"
          :rightBgColor="options.rightBgColor"
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
          el-input(
            v-model="options.leftText"
            clearable
          )
        el-form-item(:label="TEXT.rightText")
          el-input(
            v-model="options.rightText"
            clearable
          )
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
        el-form-item(
          :label="TEXT.iconColor"
          v-show="options.iconPath"
        )
          color-pick(
            v-model="options.iconColor"
            :colors="['#FFFFFF', ...colors]"
          )
        el-form-item.options__color(:label="TEXT.leftBgColor")
          color-pick(
            v-model="options.leftBgColor"
            :colors="['#555555', ...colors]"
          )
        el-form-item.options__color(:label="TEXT.rightBgColor")
          color-pick(
            v-model="options.rightBgColor"
            :colors="['#555555', ...colors]"
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
    icons: Icons,
    options: {
      roundedAngle: true,
      textShadow: true,
      gradient: true,
      leftText: 'build',
      rightText: 'passing',
      iconColor: '#FFFFFF',
      leftBgColor: '#555555',
      rightBgColor: '#555555',
    },
    colors: [
      '#666666',
      '#9F9F9F',
      '#E05D44',
      '#FE7D37',
      '#97CA00',
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
  }),

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
        this.$set(this.options, 'iconPath', path || '');
        this.$set(this.options, 'iconScale', scale || 0);
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
          const name = this.icons[iconIndex].name.toLowerCase();
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
