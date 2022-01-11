<template>
   <div class="msa-items">
     <slot></slot>
   </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Card extends Vue {
}
</script>

<style scoped lang="scss">
.msa-items {
  display: flex;
  justify-content: center;
  align-content: center;
  margin: 5px;
  padding: 5px;
  border: solid 1px;

  .msa-item-info {
    width: 85%;
    text-align: left;
  }
  .delte-btn {
    display: flex;
    align-content: center;
    width: 15%;
  }
}
</style>
