const UI = new Vue({
  el: '#ui',
  template: `
    <div id="ui">
      <div id="toolbar">
        <button @click="clickTest">Click Me</button>
      </div>
      <div id="topEdgeScroll" ref="upEdgeScroll"></div>
      <div id="bottomEdgeScroll" ref="downEdgeScroll"></div>
      <div id="leftEdgeScroll" ref="leftEdgeScroll"></div>
      <div id="rightEdgeScroll" ref="rightEdgeScroll"></div>
    </div>
  `,
  data: {
    isMoving: 'nowhere',
    zoomLevel: 40,
    maxZoom: 40,
    minZoom: 10,
  },
  mounted() {
    // make ticker
    setInterval(() => {
      this.edgeScroll(this.isMoving);
    }, 30);

    Object.keys(this.$refs).forEach(key => {
      const direction = key.split('EdgeScroll')[0];
      this.$refs[`${direction}EdgeScroll`].addEventListener('mouseenter',
        () => { this.isMoving = direction }
      );
      this.$refs[`${direction}EdgeScroll`].addEventListener('mouseleave',
        () => { this.isMoving = 'nowhere' }
      );

    })

    const zoom = ($event) => {
      this.zoom($event.deltaY * -1);
    };
    document.body.onwheel = _.debounce(zoom, 30);
  },
  methods: {
    clickTest() {
      window.EventBus.$emit('uiClick', 'hore');
    },
    edgeScroll(direction) {
      const container = document.getElementById('container');
      let top = container.style.top.split('px')[0] * 1;
      let left = container.style.left.split('px')[0] * 1;

      switch (direction) {
        case 'up': {
          top += window.UNIT_SIZE / 4;
          container.style.top = `${top}px`;
          break;
        }
        case 'down': {
          top -= window.UNIT_SIZE / 4;
          container.style.top = `${top}px`;
          break;
        }
        case 'left': {
          left += window.UNIT_SIZE / 4;
          container.style.left = `${left}px`;
          break;
        }
        case 'right': {
          left -= window.UNIT_SIZE / 4;
          container.style.left = `${left}px`;
          break;
        }
      }
    },
    zoom(delta) {
      this.zoomLevel += delta;
      if (this.zoomLevel > this.maxZoom) {
        this.zoomLevel = this.maxZoom;
      }
      if (this.zoomLevel < this.minZoom) {
        this.zoomLevel = this.minZoom;
      }
      // 40 scale 100%
      // 10 scale 25%
      const scale = this.zoomLevel / this.maxZoom;
      document.getElementById('container').style.transform = `scale(${scale})`;
    },
  }
});

export default UI;
