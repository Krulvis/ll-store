import {createStep, createWorkflow, StepResponse, WorkflowResponse} from "@medusajs/framework/workflows-sdk";
import MeasurementService from "../modules/measurement/service";
import {MEASUREMENT_MODULE} from "../modules/measurement";
import {useQueryGraphStep} from "@medusajs/core-flows";

type DeleteMeasurementInput = {
    customer_id: string
    id: string
}

const deleteMeasurementStep = createStep(
    "delete-measurement",
    async ({id}: DeleteMeasurementInput, {container}) => {
        const measurementService: MeasurementService = container.resolve(MEASUREMENT_MODULE)

        const measurement = await measurementService.softDeleteMeasurements(id)
        console.log("Deleted measurement", measurement)
        return new StepResponse(measurement, id)
    },
    async (measurement, {container}) => {
        if (!measurement) {
            return
        }
        const measurementService: MeasurementService = container.resolve(MEASUREMENT_MODULE)
        return await measurementService.restoreMeasurements(measurement)
    }
)

export const deleteMeasurementWorkflow = createWorkflow(
    "delete-measurement",
    (input: DeleteMeasurementInput) => {
        // 1. Load customer with their linked measurement
        useQueryGraphStep({
            entity: "measurement",
            fields: [
                "id",
            ],
            filters: {
                id: input.id,
                customer_id: input.customer_id
            },
            options: {
                throwIfKeyNotFound: true,
            },
        })

        // 2. Delete the measurement via the service
        const measurement = deleteMeasurementStep(input)

        return new WorkflowResponse(measurement)
    }
)
