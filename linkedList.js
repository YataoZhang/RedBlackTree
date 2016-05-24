/**
 * Created by zhangyatao on 16/5/24.
 */
function Entry(next, data) {
    this.next = next;
    this.data = data;
    this.id = Entry.obtainId();
}
Entry.obtainId = (function () {
    var i = -2;
    return function () {
        return i++;
    }
})();
function LinkedList() {
    this.head = new Entry(null, null);
    this.end = new Entry(null, null);
}
LinkedList.prototype = {
    constructor: LinkedList,
    add: function (data) {
        var newentry = new Entry(null, data);
        if (this.head.data) {
            this.end.next = newentry;
            this.end = newentry;
        }
        else {
            this.head = newentry;
            this.end = newentry;
        }
        return data;
    },
    show: function (callback) {
        var temp = this.head;
        for (; temp != null; temp = temp.next) {
            if (callback(temp.data)) {
                //break;
            }
        }
    },
    searchNode: function (id) {
        var temp = this.head;
        for (; temp != null; temp = temp.next) {
            if (temp.id === id) {
                return temp.data;
            }
        }
        return null;
    },
    remove: function (data) {
        var temp = this.head;
        var ptemp = null;
        for (; temp != null; ptemp = temp, temp = temp.next) {
            if (temp.data === data) {
                ptemp.next = temp.next;
            }
        }
    }
};
