import Category from "./category";
import RedBoxStream from "./stream";

export default interface Channel {
    id: number,
    name: string,
    iconUrl: string,
    category: Category,
    streams: RedBoxStream[]
}