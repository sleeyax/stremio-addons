import Category from "./category";
import Stream from "./stream";

export default interface Channel {
    id: number,
    name: string,
    iconUrl: string,
    category: Category,
    streams: Stream[]
}