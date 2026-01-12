import {model} from "@medusajs/framework/utils";

const LatexProduct = model.define("latexproduct", {
    id: model.id().primaryKey(),
    m2m: model.boolean().default(false),
    color_slot_names: model.array(),
})


export default LatexProduct