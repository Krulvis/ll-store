import {Module} from "@medusajs/framework/utils";
import LatexProductService from "./service";

export const LATEX_PRODUCT_MODULE = "latexproduct"

export default Module(LATEX_PRODUCT_MODULE, {
    service: LatexProductService,
})
