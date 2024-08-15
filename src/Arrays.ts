
export namespace Arrays {

    export function deleteItem<T>(arr : T[], item : T) : boolean {
        const index = arr.indexOf(item);
        if (index !== -1) {
            arr.splice(index, 1);
            return true;
        } else {
            return false;
        }
    }

    export function pushAll<T>(dst : T[], src: T[]) : T[] {
        for (const item of src) {
            dst.push(item);
        }
        return dst;
    }

    export function shuffle<T>(arr : T[]) : T[] {
        for (let index = arr.length - 1; index > 0; index--) {
            const randomIndex = Math.floor(Math.random() * (index - 1));
            const temp = arr[index];
            arr[index] = arr[randomIndex];
            arr[randomIndex] = temp;
        }
        return arr;
    }
}
