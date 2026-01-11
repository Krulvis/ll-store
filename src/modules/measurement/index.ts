import {Module} from "@medusajs/framework/utils"
import MeasurementService from "./service";

export const MEASUREMENT_MODULE = "measurement"

export default Module(MEASUREMENT_MODULE, {
    service: MeasurementService,
})