import { ref } from "vue";

export default {
  data: () => ({
    contextMenuItems: ref([]),
  }),
  methods: {
    cmBuild(data) {
      var menuItems = [];

      this.contextMenuItems.forEach((item) => {
        var disabled = item.disabled === undefined ? false : typeof item.disabled == 'function' ? item.disabled(data) : item.disabled;
        var visible = item.visible === undefined ? true : typeof item.visible == 'function' ? item.visible(data) : item.visible;
        var divided = item.divided === undefined ? false : typeof item.divided == 'function' ? item.divided(data) : item.divided;
        var icon = item.icon === undefined ? "" : typeof item.icon == 'function' ? item.icon(data) : item.icon;

        if (visible) {
          menuItems.push(
            {
              label: this.$t(item.label),
              disabled: disabled,
              divided: divided,
              icon: icon,
              onClick: () => item.onClick(data)
            }
          );
        }
      });

      return menuItems;
    },
    cmShow(e, data) {
      if (this.$device.isMobile) return;
      e.preventDefault();

      var items = this.cmBuild(data);

      if (items !== undefined && items.length > 0) {
        this.$contextmenu({
          x: e.x,
          y: e.y,
          items: items,
          iconFontClass: 'material-icons',
        });
      }
    }
  }
}
