const UI = new Vue({
  el: '#ui',
  template: `
    <div id="ui">
      <div id="toolbar">
        <button @click="clickTest">Click Me</button>
      </div>
    </div>
  `,
  methods: {
    clickTest() {
      window.EventBus.$emit('uiClick', 'hore');
    },
  }
});

export default UI;
