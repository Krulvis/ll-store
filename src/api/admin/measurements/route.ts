import {MedusaRequest, MedusaResponse} from "@medusajs/framework/http";
import {ContainerRegistrationKeys} from "@medusajs/utils";

export const GET = async (
    req: MedusaRequest,
    res: MedusaResponse
) => {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    // Extract filters from validated query
    const { customer_id, customer, name, q, ...restQuery } = req.validatedQuery || {}

    // Build filters object
    const filters: Record<string, any> = {}

    // Apply customer_id filter
    if (customer_id) {
        filters.customer_id = customer_id
    }

    // Apply measurement name filter
    if (name) {
        filters.name = name
    }

    // Apply general search filter (you can customize this based on your needs)
    if (q) {
        filters.$or = [
            { name: { $ilike: `%${q}%` } },
            { customer: { email: { $ilike: `%${q}%` } } }
        ]
    }

    console.log('Applied filters:', filters)

    // We use the query utility to fetch measurements and potentially link them to customers/orders
    const {data: measurements, metadata} = await query.graph({
        entity: "measurement",
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        ...req.queryConfig,
    })

    res.json({
        measurements,
        count: metadata!.count,
        offset: metadata!.skip,
        limit: metadata!.take,
    })
}