class Selection {
    constructor(fragments) {
        this.fragments = fragments;
        this.start = 0,
            this.end = Object.values(fragments)[0].stmtIds.length - 1;
    }

    removeLast() {
        if (this.end > this.start) {
            this.end = this.end - 1;
        }
    }

    addToLast() {
        if (this.end < Object.values(this.fragments)[0].stmtIds.length - 1) {
            this.end = this.end + 1;
        }
    }

    moveDown() {
        if (this.end < Object.values(this.fragments)[0].stmtIds.length - 1) {
            this.start = this.start + 1;
            this.end = this.end + 1;
        }
    }

    moveUp() {
        if (this.start > 0) {
            this.start = this.start - 1;
            this.end = this.end - 1;
        }
    }

    getUpdatedFragments() {
        const outputFragments = {};
        Object.keys(this.fragments).forEach(k => {
            outputFragments[k] = { stmtIds: this.fragments[k].stmtIds.slice(this.start, this.end + 1) };
        });
        return outputFragments;
    }
}

export default Selection;