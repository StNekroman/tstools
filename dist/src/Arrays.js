"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Arrays = void 0;
var Arrays;
(function (Arrays) {
    function deleteItem(arr, item) {
        const index = arr.indexOf(item);
        if (index !== -1) {
            arr.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    }
    Arrays.deleteItem = deleteItem;
    function pushAll(dst, src) {
        for (const item of src) {
            dst.push(item);
        }
        return dst;
    }
    Arrays.pushAll = pushAll;
    function shuffle(arr) {
        for (let index = arr.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index - 1));
            var temp = arr[index];
            arr[index] = arr[randomIndex];
            arr[randomIndex] = temp;
        }
        return arr;
    }
    Arrays.shuffle = shuffle;
})(Arrays || (exports.Arrays = Arrays = {}));
