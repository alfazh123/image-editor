// "use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { useState } from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

interface LogTableProps<TData, TValue> {
	data: TData[];
	columns: ColumnDef<TData, TValue>[];
}

export default function LogTable<TData, TValue>({
	data,
	columns,
}: LogTableProps<TData, TValue>) {
	const [filter, setFilter] = useState("no-latency");

	function handleFilterChange(value: string) {
		setFilter(value);
	}

	const table = useReactTable({
		data: data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			<div>
				<Select onValueChange={handleFilterChange} value={filter}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select option" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="latency">Depends on Latency</SelectItem>
						<SelectItem value="no-latency">No Latency</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="overflow-hidden rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}