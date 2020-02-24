import { addonBuilder } from "stremio-addon-sdk";
import manifest from "./manifest";

const builder = new addonBuilder(manifest);

// do your thing! :)

export default builder.getInterface();