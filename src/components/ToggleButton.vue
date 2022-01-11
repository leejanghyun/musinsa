<template>
  <div class="toggle-wrapper">
    <div v-bind:style="styleObject"> {{ text }} </div>
    <div>
      <label class="switch">
        <input type="checkbox" @click="onClick()">
        <span class="slider round"></span>
      </label>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class ToggleButton extends Vue {
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
.toggle-wrapper {
  display: flex;
  justify-content: center;
  align-content: center;
  > div {
    margin: 3px;
    color: #b2b2b2;
    font-size: 7px;
  }

 .switch {
    position: relative;
    display: inline-block;
    width: 38px;
    height: 16px;
    line-height: 16px;
  }

  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }

  .slider:before {
    position: absolute;
    content: "";
    height: 8px;
    width: 8px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }

  input:checked + .slider {
    background-color: #2196F3;
  }

  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }

  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }

  .slider.round {
    border-radius: 34px;
  }

  .slider.round:before {
    border-radius: 50%;
  }
}
</style>
