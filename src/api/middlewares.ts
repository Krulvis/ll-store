import {defineMiddlewares, validateAndTransformBody, validateAndTransformQuery} from "@medusajs/framework/http"
import {PostStoreMeasurementSchema} from "./store/measurements/validators";
import {z} from "zod"
import {createFindParams} from "@medusajs/medusa/api/utils/validators";

const FindParams = createFindParams().merge(
    z.object({
        customer_id: z.string().optional(),
        name: z.string().optional(),
        q: z.string().optional(), // For general search
    })
)

export default defineMiddlewares({
    routes: [
        {
            // Add POST validation middleware for the measurement endpoint
            matcher: "/store/measurements",
            method: "POST",
            middlewares: [validateAndTransformBody(PostStoreMeasurementSchema)],
        },
        {
            matcher: "/admin/products",
            method: "POST",
            additionalDataValidator: {
                custom_name: z.string().optional(),
            },
        },
        {
            matcher: "/admin/measurements",
            method: "GET",
            middlewares: [
                validateAndTransformQuery(FindParams, {
                    defaults: [
                        "id",
                        "customer.email",
                        "name",
                    ],
                    isList: true,
                }),
            ],
        },
    ],
})