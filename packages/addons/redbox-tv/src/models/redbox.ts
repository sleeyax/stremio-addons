import Channel from "./channel";
import Category from "./category";

export default class RedBox {
    constructor (public categories: Category[], public channels: Channel[]) {}
}