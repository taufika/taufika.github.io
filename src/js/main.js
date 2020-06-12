import UI from './ui.js';

const PLAYABLE_AREA = {
  x0: 3000, x1: 4000,
  y0: 3000, y1: 4000,
};

window.UNIT_SIZE = 40;

// init grid
const rows = 6000 / 40;
const num = rows;
let grids = '<div class="grid"></div>';
for(let i = 0; i < num; i += 1) {
  grids += '<div class="grid"></div>';
  document.getElementById('field').innerHTML = grids;
}

window.EventBus = new Vue({
  el: '#eb',
  template: '<div id="eb"></div>',
});

const MainGame = new Vue({
  el: '#objects',
  template: 
    `<div id="objects">
      <div
        v-for="tree in trees"
        :key="tree.id"
        :class="treeClass(tree.variant)"
        :style="coordinateToCss(tree)">
        <div class="base"></div>
        <div class="object branch"></div>
      </div>
    </div>`,
  data: {
    trees: []
  },
  mounted() {
    // generator
    this.generateTrees(100);

    // eventbus handlers
    window.EventBus.$on('uiClick', (payload) => console.log(payload));
  },
  methods: {
    coordinateToCss(obj) {
      return `left: ${obj.x}px; top: ${obj.y}px;`;
    },
    treeClass(variant) {
      return `tree ${variant}`;
    },
    generateTrees(num = 10) {
      for(let i = 0; i < num; i += 1) {
        const x = Math.random() * (PLAYABLE_AREA.x1 - PLAYABLE_AREA.x0) + PLAYABLE_AREA.x0;
        const y = Math.random() * (PLAYABLE_AREA.y1 - PLAYABLE_AREA.y0) + PLAYABLE_AREA.y0;
        this.trees.push({
          id: `tree${i}`,
          variant: ['normal', 'yellow', 'red', 'dark'][Math.floor(Math.random() * 4)],
          x,
          y,
        });
      }
    },
  }
});
