import {createStep, createWorkflow, StepResponse, WorkflowResponse,} from "@medusajs/framework/workflows-sdk"
import {MEASUREMENT_MODULE} from "../modules/measurement";
import MeasurementService from "../modules/measurement/service";
import {MedusaError} from "@medusajs/utils";

type CreateMeasurementInput = {
    customer_id: string
    name: string
    forehead: number
    mouth: number
    neck: number
}

export const upsertMeasurementStep = createStep(
    "upsert-measurement",
    async (input: CreateMeasurementInput, {container}) => {
        const measurementService: MeasurementService = container.resolve(MEASUREMENT_MODULE)
        const {customer_id, name, forehead, mouth, neck} = input
        const lowerName = name.toLowerCase()

        // 1. Seek existing record (including deleted)
        const [existing] = await measurementService.listMeasurements(
            {customer_id, name: lowerName},
            {withDeleted: true, take: 1}
        )

        // Case A: Exists and is active -> Error
        if (existing && !existing.deleted_at) {
            throw new MedusaError(
                MedusaError.Types.DUPLICATE_ERROR,
                `Measurement with name: ${lowerName} already exists`
            )
        }

        // Case B: Exists but is deleted -> Restore and Update
        if (existing && existing.deleted_at) {
            console.log(`Restoring deleted measurement with id: ${existing.id}`)
            await measurementService.restoreMeasurements({id: existing.id})
            const updated = await measurementService.updateMeasurements({
                id: existing.id,
                forehead: forehead,
                mouth: mouth,
                neck: neck,
            })
            console.log("Updated measurement", updated)
            return new StepResponse(updated, {action: "restored", id: existing.id})
        }

        // Case C: Doesn't exist -> Create new
        const newMeasurement = await measurementService.createMeasurements({
            name: lowerName,
            customer_id,
            forehead,
            mouth,
            neck,
        })

        return new StepResponse(newMeasurement, {action: "created", id: newMeasurement.id})
    },
    async (compensationData, {container}) => {
        if (!compensationData) return
        const measurementService: MeasurementService = container.resolve(MEASUREMENT_MODULE)

        // If we created it, delete it. If we restored it, soft-delete it again.
        await measurementService.deleteMeasurements(compensationData.id)
    }
)

const createMeasurementWorkflow = createWorkflow(
    "create-measurement",
    (input: CreateMeasurementInput) => {
        const result = upsertMeasurementStep(input)
        return new WorkflowResponse(result)
    }
)

export default createMeasurementWorkflow