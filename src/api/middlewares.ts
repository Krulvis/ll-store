import {defineMiddlewares, validateAndTransformBody} from "@medusajs/framework/http"
import {PostStoreMeasurementSchema} from "./store/measurements/validators";

export default defineMiddlewares({
    routes: [
        {
            // Add POST validation middleware for the measurement endpoint
            matcher: "/store/measurements",
            method: "POST",
            middlewares: [validateAndTransformBody(PostStoreMeasurementSchema)],
        }
    ],
})