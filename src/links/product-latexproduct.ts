import {defineLink} from "@medusajs/utils";
import ProductModule from "@medusajs/medusa/product";
import LatexProductModule from "../modules/latexproduct";

export default defineLink(
    ProductModule.linkable.product,
    LatexProductModule.linkable.latexproduct
)