import type {AuthenticatedMedusaRequest, MedusaResponse,} from "@medusajs/framework/http"
import {z} from "zod"
import createMeasurementWorkflow from "../../../workflows/create-measurement";
import {PostStoreMeasurementSchema} from "./validators";
import {ContainerRegistrationKeys} from "@medusajs/utils";

type PostStoreMeasurementBody = z.infer<typeof PostStoreMeasurementSchema>

export async function GET(
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const customerId = req.auth_context?.actor_id

    const {
        data: measurements,
        metadata: {count, take, skip} = {},
    } = await query.graph({
        entity: "measurement",
        fields: ["*"],
        pagination: {
            take: 5,
            skip: 0,
        },
        filters: {
            customer_id: customerId,
        },
        withDeleted: false,
    }, {
        cache: {
            enable: true,
            // optional extras:
            // ttl: 60, // seconds
            // key: async (args, cachingModule) => await cachingModule.computeKey({ ...args, prefix: "measurement" }),
            // tags: ["Measurement:list:*"],
        },
    })
    res.json({
        measurements,
        count,
        limit: take,
        offset: skip,
    })
}

export async function POST(
    req: AuthenticatedMedusaRequest<PostStoreMeasurementBody>,
    res: MedusaResponse
) {
    const customerId = req.auth_context?.actor_id

    const {result: post} = await createMeasurementWorkflow(req.scope)
        .run({
            input: {
                customer_id: customerId,
                name: req.validatedBody.name,
                forehead: req.validatedBody.forehead,
                mouth: req.validatedBody.mouth,
                neck: req.validatedBody.neck,
            },
        })
    res.json({
        post,
    })
}