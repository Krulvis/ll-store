import {MedusaService} from "@medusajs/framework/utils"
import Measurement from "./models/measurement"

class MeasurementService extends MedusaService({
    Measurement,
}) {

}

export default MeasurementService