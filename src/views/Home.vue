<template>
  <div>
    <div class="msa-wrapper" ref="wrapper" @scroll="onScroll">
      <h1 class="msa-title">
        MUSINSA Coding Test <span class="developer">By 이장헌</span>
      </h1>
      <div class="msa-items-wrapper">
        <div class="msa-items-filter">
          <div>
            <ToggleButton text="실존인물만" :styleObject="getFilterStyle(filterType.BORN)"
              @click="onFilter(filterType.BORN)"
            />
          </div>
          <div>
            <ToggleButton text="여자" :styleObject="getFilterStyle(filterType.FEMALE)"
              @click="onFilter(filterType.FEMALE)"
            />
          </div>
          <div>
            <ToggleButton text="tvSeries 없음" :styleObject="getFilterStyle(filterType.NO_TV_SERIES)"
              @click="onFilter(filterType.NO_TV_SERIES)"
            />
          </div>
          <div>
            <Button text="초기화" @click="init()" />
          </div>
        </div>
        <div class="msa-items-list">
          <template v-for="item in itemList">
            <Card v-if="isShowItem(item)" :key="item.id">
              <div class="msa-item-info">
                <div>
                  <span class="ellipsis-block"><span class="bold">name:</span> {{ item.name }}</span>
                </div>
                <div>
                  <span class="ellipsis-block"><span class="bold">aliases:</span> {{ item.aliases }}</span>
                </div>
                <div>
                  <span class="ellipsis-block"><span class="bold">title:</span> {{ item.title }}</span>
                </div>
                <div>
                  <span><span class="bold">books: </span>{{ item.books }}&nbsp;</span>
                  <span><span class="bold">tvSeries: </span>{{ item.tvSeries }}</span>
                </div>
              </div>
              <div class="delete-btn">
                <Button text="삭제" :styleObject="getDeleteBtnStyle"
                  @click="onDeleteItem(item.id)" />
              </div>
            </Card>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import ToggleButton from '@/components/ToggleButton.vue';
import Button from '@/components/Button.vue';
import Card from '@/components/Card.vue';
import { rootStore } from '@/store';

enum FilterTypeName {
  FEMALE = 'Female',
  BORN = 'Born',
  NO_TV_SERIES = 'no_tv_series',
}

interface Item {
  name: string,
  aliases: string,
  titles: string,
  gender: string,
  born: string,
  books: number,
  tvSeries: number,
  id: string,
  delete?: boolean,
}

@Component({
  components: {
    ToggleButton,
    Button,
    Card,
  }
})
export default class Home extends Vue {
  private filterType = FilterTypeName;
  private startPage!: string;
  private endPage!: string;
  private filterList: FilterTypeName[] = [];
  private itemList: Item[] = [];
  private isEnd = false;

  /**
   * 생성 Hook 발생 시
   */
  private async created() {
    let page = this.$route.query?.page as string || '1';
    this.startPage = page;
    this.endPage = page;
    const items = await rootStore.requestItemList(page);

    if (!items.length) {
      this.isEnd = true;
      return;
    }

    this.itemList = this.getItem(items);
  }

  /**
   * scroll이 생길때까지 데이터 로드
   */
  private async loadUntilScrollVisible() {
    while (!this.hasScroll()) {
      this.endPage = `${parseInt(this.endPage) + 1}`;
      const items = await rootStore.requestItemList(this.endPage);
      const res = this.getItem(items);

      if (!res?.length) {
        this.isEnd = true;
        break;
      }

      this.itemList = this.itemList.concat(res);
    }
  }

  /**
   * scroll 존재 유무 반환
   * @returns { Boolean } scroll 유무
   */
  private hasScroll() {
    const wrapper = this.$refs.wrapper as Element;
    return wrapper.scrollHeight > wrapper.clientHeight;
  }
  
  /**
   * Item을 반환
   * @param { Array } items Item 배열
   * @returns { Array } 화면에 표시할 Item 객체 배열
   */
  private getItem(items: any) {
    return items.map((item: any) => {
      const id = item?.url.split('/');
      return {
        name: item?.name,
        aliases: item?.aliases.join(''),
        titles: item?.titles.join(''),
        gender: item?.gender,
        born: item?.born,
        books: item?.books.filter((item: string) => item).length,
        tvSeries: item?.tvSeries.filter((item: string) => item).length,
        id: id[id.length - 1],
      };
    });
  }

  /**
   * Update 발생 시
   */
  private updated() {
    this.loadUntilScrollVisible();
  }

  /**
   * 아이템 보여줄지 유무
   * @param { Object } item 아이템 객체
   * @returns { Boolean } 보여줄지 유무
   */
  private isShowItem(item: Item) {
    const filterList = this.filterList;
    let isShow = !item.delete;

    if (!isShow || !filterList.length) {
      return isShow;
    }

    for (const filterType of filterList) {
      if(((filterType === FilterTypeName.FEMALE) && (item.gender !== 'Female')) ||
        ((filterType === FilterTypeName.BORN) && (!item.born)) ||
        ((filterType === FilterTypeName.NO_TV_SERIES) && (item.tvSeries))) {
        isShow = false;
        break;
      }
    }

    return isShow;
  }

  /**
   * Filter Button 스타일 반환
   * @param { String } type Filter Type
   * @returns { Object } style 객체 반환
   */
  private getFilterStyle(type: FilterTypeName) {
    let idx = this.filterList.findIndex((filterKind: FilterTypeName) => filterKind === type);
    return (idx >= 0) ? { color: '#000000' } : {};
  }

  /**
   * 초기화 버튼 Style 반환
   * @returns { Object } style 객체 반환
   */
  private get getDeleteBtnStyle() {
    return {
      color: '#FF0000',
      height: '20px',
      width: '50px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #cccccc',
      borderRadius: '10px',
    };
  }

  /**
   * Scroll 이벤트 발생 시
   * @param { Event } event 이벤트
   */
  private async onScroll(event: Event) {
    if (this.isEnd) {
      return;
    }
    const target = event.target as Element;
    const isBottom = target ? this.isBottom(target) : false;

    if (!isBottom) {
      return;
    }

    this.endPage = `${parseInt(this.endPage) + 1}`;
    const items = await rootStore.requestItemList(this.endPage);
    const res = this.getItem(items);

    if (!res?.length) {
      this.isEnd = true;
      return;
    }

    this.itemList = this.itemList.concat(res);
    target.scrollTop -= 10; // scroll 살짝 뒤로 이동
  }

  /**
   * 스크롤이 바닥인 경우
   * @param { Element } el element
   * @returns { Boolean } 바닥인지 유무
   */
  private isBottom(el: Element) {
    const clientHeight = el.clientHeight;
    const scrollHeight = el.scrollHeight;
    return clientHeight >= Math.round(scrollHeight - el.scrollTop);
  }

  /**
   * 삭제 버튼 클릭시
   * @param { Strin } id 아이디 명
   */
  private onDeleteItem(id: string) {
    const removeItem = this.itemList.find((item: any) => (item.id === id)) as any;
    this.$set(removeItem, 'delete', true)
  }

  /**
   * 초기화 버튼 클릭시
   */
  private init() {
    this.itemList.forEach((item: Item) => {
      if (item.delete) {
        this.$delete(item, 'delete');
      }
    })
  }

  /**
   * Filter 버튼 클릭시
   * @param { String } type Filter Type 명
   */
  private onFilter(type: FilterTypeName) {
    const filterList = this.filterList;
    let idx = filterList.findIndex((filterKind: FilterTypeName) => filterKind === type);

    if (idx < 0) {
      filterList.push(type);
      return;
    }

    filterList.splice(idx, 1);
  }
}
</script>
<style lang="scss" scoped>
.msa-wrapper {
  width: 100%;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: scroll;

  .msa-title {
    background: black;
    color: white;
    width: 100%;
    height: 100px;
    line-height: 100px;

    .developer {
      font-size: 10px;
    }
  }

  .msa-items-filter {
    display: flex;
    align-content: center;
    justify-content: space-around;
    background-color: #f3f3f3;
    width: 100%;
    line-height: 30px;
  }

  .ellipsis-block {
    display: inline-block;
    width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .bold {
    font-weight: 900;
  }
}
</style>