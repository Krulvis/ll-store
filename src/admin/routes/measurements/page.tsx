import {defineRouteConfig} from "@medusajs/admin-sdk"
import {DropCap} from "@medusajs/icons"
import {Container, Heading, Input, Table} from "@medusajs/ui"
import {useMemo, useState} from "react"
import {sdk} from "../../lib/sdk.ts";
import {useQuery} from "@tanstack/react-query"
import * as sea from "node:sea";
// Assuming you have a client setup or use standard fetch

type MeasurementsResponse = {
    measurements: { id: string; customer_id: string, name: string }[]
    count: number
    limit: number
    offset: number
}

const MeasurementsPage = () => {
    const [currentPage, setCurrentPage] = useState(0)
    const limit = 15
    const offset = useMemo(() => {
        return currentPage * limit
    }, [currentPage])
    const [searchTerm, setSearchTerm] = useState("")

    // Using React Query to fetch data from our new API route
    // Note: Adjust the fetcher function based on how you communicate with your Medusa backend
    const {data, isLoading} = useQuery({
        queryKey: ["measurements", searchTerm, limit, offset],
        queryFn: () =>
            sdk.client.fetch<MeasurementsResponse>(`/admin/measurements`, {
                query: {
                    fields: "id,customer,customer.*,name,forehead,mouth,neck",
                    limit,
                    offset,
                    name: searchTerm
                },
            }),
    })
    console.log(data)

    return (
        <Container className="divide-y p-0">
            <div className="flex items-center justify-between px-6 py-4">
                <Heading level="h2">Customer Measurements</Heading>
                <div className="flex gap-x-2">
                    <Input
                        placeholder="Search by Customer name"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Table>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell>Customer</Table.HeaderCell>
                        <Table.HeaderCell>Name</Table.HeaderCell>
                        <Table.HeaderCell>Forehead</Table.HeaderCell>
                        <Table.HeaderCell>Mouth</Table.HeaderCell>
                        <Table.HeaderCell>Neck</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {isLoading ? (
                        <Table.Row>
                            <Table.Cell className="text-center">Loading...</Table.Cell>
                        </Table.Row>
                    ) : data?.measurements?.map((m: any) => (
                        <Table.Row key={m.id}>
                            <Table.Cell>{m.customer.email}</Table.Cell>
                            <Table.Cell>{m.name}</Table.Cell>
                            <Table.Cell>{m.forehead}</Table.Cell>
                            <Table.Cell>{m.mouth}</Table.Cell>
                            <Table.Cell>{m.neck}</Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table>
        </Container>
    )
}

export const config = defineRouteConfig({
    label: "Measurements",
    icon: DropCap,
})

export default MeasurementsPage