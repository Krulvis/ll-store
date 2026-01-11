import type {AuthenticatedMedusaRequest, MedusaResponse} from "@medusajs/framework/http";
import {deleteMeasurementWorkflow} from "../../../../workflows/delete-measurement";
import {ContainerRegistrationKeys} from "@medusajs/utils";

export const GET = async (
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const measurementId = req.params.id

    const {data: [measurement]} = await query.graph({
        entity: "measurement",
        fields: [
            "*",
        ],
        filters: {
            id: measurementId,
        },
    })
    res.json({measurement: measurement})
}

export async function DELETE(
    req: AuthenticatedMedusaRequest,
    res: MedusaResponse
) {
    const customerId = req.auth_context?.actor_id
    const measurementId = req.params.id

    const {result: post} = await deleteMeasurementWorkflow(req.scope)
        .run({
            input: {
                customer_id: customerId,
                id: measurementId,
            },
        })
    res.json({
        post,
    })
}