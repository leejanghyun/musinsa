<template>
  <button v-bind:style="styleObject"
    @click="onClick()"
  >
    {{ text }}
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class Button extends Vue {
  @Prop({ type: String }) private text!: string;
  @Prop() private styleObject!: any;

  /**
   * 버튼 클릭 시
   * @param { Event } 이벤트 객체
   */
  private onClick(e: Event) {
    this.$emit('click', e)
  }
}
</script>

<style scoped lang="scss">
button {
  display: inline-block;
  cursor: pointer;
  background-color: #f3f3f3;
  border: none;
  color: #000000;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 10px;
  height: 100%;
  width: 100%;
}
</style>
