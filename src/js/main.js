import UI from './ui.js';

window.PLAYABLE_AREA = {
  x0: 3000, x1: 4000,
  y0: 3000, y1: 4000,
};

window.MAP_SIZE = 6000;
window.UNIT_SIZE = 40;

// init area
let area = '';
const AREA_NUM = 16;
const STARTING_AREA = 9;
for(let i = 0; i < AREA_NUM; i += 1) {
  // initial area
  if (i == STARTING_AREA) {
    area += '<div class="area playable';
  } else {
    area += '<div class="area';
  }
  area += ` area${i}"></div>`;
}
document.getElementById('field').innerHTML = area;

window.EventBus = new Vue({
  el: '#eb',
  template: '<div id="eb"></div>',
});

const MainGame = new Vue({
  el: '#objects',
  template: 
    `<div id="objects">
      <div id="grids">
        <div
          v-for="(area, idx) in areas"
          v-if="area && area.playable"
          class="gridArea"
          :style="getGridPosition(idx)"
        >
          <template v-for="(row, x) in area.grid" v-if="isRowOccuppied(row)">
            <template v-for="(col, y) in row" v-if="col && col.type">
              <div class="gridCol" :style="coordinateToCss(x, y)">
                <div
                  v-if="col && col.type == 'tree'"
                  :class="treeClass(col.variant)"
                >
                  <div class="base"></div>
                  <div class="object branch"></div>
                </div>
              </div>
            </template>
          </template>
        </div>
      </div>
    </div>`,
  data: {
    areas: Array(AREA_NUM),
    treeCount: 0,
    containerBoundRect: {},
  },
  mounted() {
    // init area
    this.containerBoundRect = document.getElementById('container').getBoundingClientRect();
    this.areas = this.areas.fill({}).map((_, index) => {
      const elem = window.document.querySelector(`#field .area${index}`);
      const elemRect = elem.getBoundingClientRect();
      const elemLeft = elemRect.left - this.containerBoundRect.left;
      const elemTop = elemRect.top - this.containerBoundRect.top;
      const grid = Array(75).fill([]).map(r => Array(75));
      return {
        playable: index == STARTING_AREA,
        elem,
        elemLeft,
        elemTop,
        grid,
      };
    });

    // generator
    this.generateTrees(STARTING_AREA, 100);

    // eventbus handlers
    window.EventBus.$on('uiClick', (payload) => console.log(payload));
  },
  methods: {
    isRowOccuppied(row) {
      return row.filter(col => typeof col !== 'undefined').length; 
    },
    getGridPosition(idx) {
      const { elemLeft, elemTop } = this.areas[idx];
      const magicNum ={
        x: 311,
        y: -220,
      }
      return `left: ${elemLeft + magicNum.x}px; top: ${elemTop + magicNum.y}px;`;
    },
    coordinateToCss(y, x) {
      const colSize = UNIT_SIZE / 2;
      return `left: ${x * colSize}px; top: ${y * colSize}px;`;
    },
    treeClass(variant) {
      return `tree ${variant}`;
    },
    generateTrees(area, num = 10) {
      const areaGrid = this.areas[area].grid;
      let localCount = 0;
      for(let x = 0; x < areaGrid.length; x += 1) {
        if (localCount >= num) break;
        for(let y = 0; y < areaGrid[x].length; y += 1 ) {
          if (localCount >= num) break;
          const isThereTree = Math.floor(Math.random() * 100) > 98;
          if (isThereTree) {
            localCount += 1;
            this.treeCount += 1;
            this.areas[area].grid[x][y] = {
              id: `tree${this.treeCount}`,
              type: 'tree',
              variant: ['normal', 'yellow', 'red', 'dark'][Math.floor(Math.random() * 4)],
            };
          }
        }
      }
    },
  }
});
