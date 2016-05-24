/**
 * Created by zhangyatao on 16/5/24.
 */
var Color = {
    RED: '红', BLACK: '黑'
};
function Node(color, value) {
    var argLen = arguments.length;
    this.color = Color.RED;
    this.left = RBTree.NIL;
    this.right = RBTree.NIL;
    if (argLen === 2) {
        this.color = color;
        this.value = value;
    }
    if (argLen === 1) {
        this.value = color;
    }
    this.id = Node.obtainId();
}
Node.obtainId = (function () {
    var i = -1;
    return function () {
        return i++;
    }
})();
Node.prototype = {
    constructor: Node,
    getLeft: function () {
        return this.left;
    },
    setLeft: function (left) {
        this.left = left;
    },
    getRight: function () {
        return this.right;
    },
    setRight: function (right) {
        this.right = right;
    },
    getParent: function () {
        return this.parent;
    },
    setParent: function (parent) {
        this.parent = parent;
    },
    getColor: function () {
        return this.color;
    },
    setColor: function (color) {
        this.color = color;
    },
    getValue: function () {
        return this.value;
    },
    setValue: function (value) {
        this.value = value;
    },
    getId: function () {
        return this.id;
    }
};
function RBTree(root) {
    this.root = null;
    if (root) {
        this.root = root;
    } else {
        this.root = RBTree.NIL;
    }
}
RBTree.prototype = {
    constructor: RBTree,
    //插入节点
    insertNode: function (value) {
        var node = new Node(value);
        var NIL = RBTree.NIL;
        var previous = NIL;
        var temp = this.root;
        while (temp != NIL) {
            previous = temp;
            if (temp.getId() < node.getId()) {
                temp = temp.getRight();
            } else {
                temp = temp.getLeft();
            }
        }
        node.setParent(previous);
        if (previous == NIL) {
            this.root = node;
            this.root.setParent(NIL);
        } else if (previous.getId() > node.getId()) {
            previous.setLeft(node);
        } else {
            previous.setRight(node);
        }
        this.insertReBalance(node);
    },
//插入节点后的调整
    insertReBalance: function (node) {
        var parent = node.getParent(), grandParent, uncle;
        while (parent.getColor() == Color.RED) {
            grandParent = parent.getParent();
            if (parent == grandParent.getLeft()) {
                uncle = grandParent.getRight();
                if (uncle.getColor() == Color.RED) {         //Case 1
                    uncle.setColor(Color.BLACK);
                    parent.setColor(Color.BLACK);
                    grandParent.setColor(Color.RED);
                    node = grandParent;
                } else if (node == parent.getRight()) {  //case 2
                    node = parent;
                    this.leftRotate(node);
                } else {                                          //case 3
                    parent.setColor(Color.BLACK);
                    grandParent.setColor(Color.RED);
                    this.rightRotate(grandParent);
                }
            } else {
                uncle = grandParent.getLeft();
                if (uncle.getColor() == Color.RED) {     //case 4
                    uncle.setColor(Color.BLACK);
                    parent.setColor(Color.BLACK);
                    grandParent.setColor(Color.RED);
                    node = grandParent;
                } else if (node == parent.getLeft()) { //case 5
                    node = parent;
                    this.rightRotate(node);
                } else {                                          // case 6
                    parent.setColor(Color.BLACK);
                    grandParent.setColor(Color.RED);
                    this.leftRotate(grandParent);
                }
            }
        }
        this.root.setColor(Color.BLACK);
    },
    //删除节点
    removeNode: function (data) {
        var NIL = RBTree.NIL;
        var node = this.searchNode(data);
        var temp = NIL;
        var child = NIL;
        if (node == null) {
            return null;
        } else {
            if (node.getLeft() == NIL || node.getRight() == NIL) {
                temp = node;
            } else {
                temp = this.successor(node);
            }
            if (temp.getLeft() != NIL) {
                child = temp.getLeft();
            } else {
                child = temp.getRight();
            }
            child.setParent(temp.getParent());
            if (temp.getParent() == NIL) {
                this.root = child;
            } else if (temp == temp.getParent().getLeft()) {
                temp.getParent().setLeft(child);
            } else {
                temp.getParent().setRight(child);
            }
            if (temp != node) {
                node.setValue(temp.getId());
            }
            if (temp.getColor() == Color.BLACK) {
                this.removeReBalance(child);
            }
            return temp;
        }
    },
//删除节点后的调整
    removeReBalance: function (node) {
        var parent = node.getParent();
        while (node != this.root && node.getColor() == Color.BLACK) {
            if (node == parent.getLeft()) {
                var rightBrother = parent.getRight();
                if (rightBrother.getColor() == Color.RED) {          //case 1 node节点为左孩子，node节点的兄弟为RED
                    rightBrother.setColor(Color.BLACK);
                    parent.setColor(Color.RED);
                    this.leftRotate(parent);
                    rightBrother = parent.getRight();
                }
                if (rightBrother.getLeft().getColor() == Color.BLACK && rightBrother.getRight().getColor() == Color.BLACK) {
                    rightBrother.setColor(Color.RED);
                    node = parent;
                } else if (rightBrother.getRight().getColor() == Color.BLACK) {
                    rightBrother.getLeft().setColor(Color.BLACK);
                    rightBrother.setColor(Color.RED);
                    this.rightRotate(rightBrother);
                    rightBrother = parent.getRight();
                } else {
                    rightBrother.setColor(parent.getColor());
                    parent.setColor(Color.BLACK);
                    rightBrother.getRight().setColor(Color.BLACK);
                    this.leftRotate(parent);
                    node = this.root;
                }
            } else {
                var leftBrother = parent.getLeft();
                if (leftBrother.getColor() == Color.RED) {
                    leftBrother.setColor(Color.BLACK);
                    parent.setColor(Color.RED);
                    this.rightRotate(parent);
                    leftBrother = parent.getLeft();
                }
                if (leftBrother.getLeft().getColor() == Color.BLACK && leftBrother.getRight().getColor() == Color.BLACK) {
                    leftBrother.setColor(Color.RED);
                    node = parent;
                } else if (leftBrother.getLeft().getColor() == Color.BLACK) {
                    leftBrother.setColor(Color.RED);
                    leftBrother.getRight().setColor(Color.BLACK);
                    this.leftRotate(leftBrother);
                    leftBrother = parent.getLeft();
                } else {
                    leftBrother.setColor(parent.getColor());
                    parent.setColor(Color.BLACK);
                    leftBrother.getLeft().setColor(Color.BLACK);
                    this.rightRotate(parent);
                    node = this.root;
                }
            }
        }
        node.setColor(Color.BLACK);
    },
//查找节点node的后继节点
    successor: function (node) {
        var rightChild = node.getRight();
        if (rightChild != RBTree.NIL) {
            var previous = null;
            while (rightChild != RBTree.NIL) {
                previous = rightChild;
                rightChild = rightChild.getLeft();
            }
            return previous;
        } else {
            var parent = node.getParent();
            while (parent != RBTree.NIL && node != parent.getLeft()) {
                node = parent;
                parent = parent.getParent();
            }
            return parent;
        }
    },
//查找节点
    searchNode: function (data) {
        var temp = this.root;
        while (temp != RBTree.NIL) {
            if (temp.getId() == data) {
                return temp;
            } else if (data < temp.getId()) {
                temp = temp.getLeft();
            } else {
                temp = temp.getRight();
            }
        }
        return null;
    },
//左转函数
    leftRotate: function (node) {
        var rightNode = node.getRight();
        node.setRight(rightNode.getLeft());
        if (rightNode.getLeft() != RBTree.NIL) {
            rightNode.getLeft().setParent(node);
        }
        rightNode.setParent(node.getParent());
        if (node.getParent() == RBTree.NIL) {
            this.root = rightNode;
        } else if (node == node.getParent().getLeft()) {
            node.getParent().setLeft(rightNode);
        } else {
            node.getParent().setRight(rightNode);
        }
        rightNode.setLeft(node);
        node.setParent(rightNode);
    },
//右转函数
    rightRotate: function (node) {
        var leftNode = node.getLeft();
        node.setLeft(leftNode.getRight());
        if (leftNode.getRight() != null) {
            leftNode.getRight().setParent(node);
        }
        leftNode.setParent(node.getParent());
        if (node.getParent() == RBTree.NIL) {
            this.root = leftNode;
        } else if (node == node.getParent().getLeft()) {
            node.getParent().setLeft(leftNode);
        } else {
            node.getParent().setRight(leftNode);
        }
        leftNode.setRight(node);
        node.setParent(leftNode);
    },
//中序遍历红黑树
    printTree: function () {
        this.inOrderTraverse(this.root);
    },
    inOrderTraverse: function (node, dir) {
        if (node && node !== RBTree.NIL) {
            arguments.callee(node.getLeft(), 'left');
            console.log(" 节点：" + node.getId() + "的颜色为：" + node.getColor() + ' dir:' + dir+' value:'+node.getValue());
            arguments.callee(node.getRight(), 'right');
        }
    }
};
RBTree.NIL = new Node(Color.BLACK, -1);
