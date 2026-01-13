import {defineLink} from "@medusajs/utils";
import CustomerModule from "@medusajs/medusa/customer"
import Measurement from "../modules/measurement"

export default defineLink(
    {
        linkable: Measurement.linkable.measurement,
        field: "customer_id",
    },
    CustomerModule.linkable.customer,
    {
        readOnly: true,
    }
)