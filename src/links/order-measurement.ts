import {defineLink} from "@medusajs/utils";
import OrderModule from "@medusajs/medusa/order";
import MeasurementModule from "../modules/measurement"

export default defineLink(
    OrderModule.linkable.order,
    MeasurementModule.linkable.measurement
)