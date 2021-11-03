export default {
    data() {
        return {
            selectItems: [],
            selectActive: false,
        }
    },
    methods: {
        selectClear() {
            this.selectItems = [];
        },
        selectToggle() {
            this.selectActive = !this.selectActive;
            this.selectClear();
        },
        selectItemSelected(id) {
            return this.selectItems.indexOf(id) !== -1;
        },
        selectItemToggle(id) {
            if (this.selectItems.indexOf(id) === -1) {
                this.selectItems.push(id);
            } else {
                this.selectItems.splice(this.selectItems.indexOf(id), 1);
            }
        },
    }
}