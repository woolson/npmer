<template lang="pug">
svg(
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink"
  height="20"
  :width="width"
)
  linearGradient(id="b" x2="0" y2="100%")
    stop(offset="0" stop-color="#bbb" stop-opacity=".1")
    stop(offset="1" stop-opacity=".1")
  clipPath(v-if="roundedAngle" id="a")
    rect(:width="width" height="20" rx="3" fill="#fff")
  g(:clip-path="roundedAngle ? 'url(#a)' : ''")
    path(:fill="leftBgColor" :d="leftPathD")
    path(:fill="rightBgColor" :d="rightPathD")
    path(v-if="gradient" fill="url(#b)" :d="bgPathD")
  g
    path(
      v-if="textShadow"
      id="icon"
      :d="iconPath"
      fill="#010101"
      fill-opacity=".3"
      :style="iconShadowStyle"
    )
    path(
      id="icon"
      :d="iconPath"
      :fill="iconColor"
      :style="iconStyle"
    )
  g(
    fill="#fff"
    text-anchor="middle"
    font-family="DejaVu Sans,Verdana,Geneva,sans-serif"
    font-size="12"
  )
    text(
      :x="leftWidth / 2 + (leftIcon ? iconWidth : 0)" y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{leftText}}
    text(
      :x="leftWidth / 2 + (leftIcon ? iconWidth : 0)" y="15"
    ) {{leftText}}
    text(
      :x="leftWidth + rightWidth / 2 + iconWidth" y="15"
      v-if="textShadow"
      fill="#010101"
      fill-opacity=".3"
    ) {{rightText}}
    text(
      :x="leftWidth + rightWidth / 2 + iconWidth" y="14"
    ) {{rightText}}
</template>

<script>
export default {
  name: 'tag-svg',

  props: {
    leftText: String,
    leftWidth: Number,
    leftColor: String,
    rightText: String,
    rightWidth: Number,
    leftBgColor: String,
    rightBgColor: String,
    roundedAngle: Boolean,
    gradient: Boolean,
    textShadow: Boolean,
    iconScale: [Number, String],
    iconPath: String,
    iconColor: String,
    iconPosition: String,
    iconX: [Number, String],
    iconY: [Number, String],
  },

  data: () => ({
    iconWidth: 15,
  }),

  watch: {
    iconPath: {
      handler(newValue) {
        if (newValue) this.iconWidth = this.leftText ? 15 : 10;
        else this.iconWidth = 0;
      },
      immediate: true,
    },
    leftText(newValue) {
      if (this.iconWidth) this.iconWidth = newValue ? 15 : 10;
      else this.iconWidth = 0;
    },
  },

  computed: {
    leftIcon() {
      return this.iconPosition === 'left';
    },
    leftPathD() {
      return `M0 0h${this.leftWidth + (this.leftIcon ? this.iconWidth : 0)}v20H0z`;
    },
    rightPathD() {
      return `M${this.leftWidth + (this.leftIcon ? this.iconWidth : 0)} 0h${this.rightWidth + (this.leftIcon ? 0 : this.iconWidth)}v20H${this.leftWidth + (this.leftIcon ? this.iconWidth : 0)}z`;
    },
    bgPathD() {
      return `M0 0h${this.width}v20H0z`;
    },
    width() {
      return this.leftWidth + this.rightWidth + this.iconWidth;
    },
    iconStyle() {
      return {
        transform: `scale(${this.iconScale})`,
        transformOrigin: `${this.iconX + (this.leftIcon ? 0 : this.leftWidth)}px ${this.iconY}px 0px`,
      };
    },
    iconShadowStyle() {
      return {
        transform: `scale(${this.iconScale})`,
        transformOrigin: `${this.iconX + (this.leftIcon ? 0 : this.leftWidth)}px ${this.iconY + 1}px 0px`,
      };
    },
  },
};
</script>
