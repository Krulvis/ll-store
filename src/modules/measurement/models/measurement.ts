import {model} from "@medusajs/framework/utils"


const Measurement = model.define("measurement", {
    id: model.id().primaryKey(),
    customer_id: model.text(),
    name: model.text(),
    forehead: model.float(),
    mouth: model.float(),
    neck: model.float(),
}).indexes([
    {
        on: ["customer_id", "name"],
        unique: true,
    },
])


export default Measurement