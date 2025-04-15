import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { ApplicationProps } from "../../../interfaces/applications";

export default function BarChart({ data }: ApplicationProps) {
	const options: ApexOptions = {
		colors: ["#465fff"],
		chart: {
			fontFamily: "Outfit, sans-serif",
			type: "bar",
			height: 180,
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				columnWidth: "39%",
				borderRadius: 5,
				borderRadiusApplication: "end",
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 4,
			colors: ["transparent"],
		},
		xaxis: {
			categories: [
				"Draft",
				"In Progress",
				"Submitted",
				"Interview",
				"Accepted",
				"Rejected",
			],
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},
		legend: {
			show: true,
			position: "top",
			horizontalAlign: "left",
			fontFamily: "Outfit",
		},
		yaxis: {
			title: {
				text: undefined,
			},
		},
		grid: {
			yaxis: {
				lines: {
					show: true,
				},
			},
		},
		fill: {
			opacity: 1,
		},

		tooltip: {
			x: {
				show: false,
			},
			y: {
				formatter: (val: number) => `${val}`,
			},
		},
	};
	const chart = [
		{ value: 0, name: "Draft" },
		{ value: 0, name: "In Progress" },
		{ value: 0, name: "Submitted" },
		{ value: 0, name: "Interview" },
		{ value: 0, name: "Accepted" },
		{ value: 0, name: "Rejected" },
	];
	if (data) {
		data.forEach((data) => {
			chart.forEach((i) => {
				if (data.status == i.name) {
					i.value += 1;
				}
			});
		});
	}
	const series = [
		{
			name: "Applications",
			data: [
				chart[0].value,
				chart[1].value,
				chart[2].value,
				chart[3].value,
				chart[4].value,
				chart[5].value,
			],
		},
	];
	return (
		<div className="max-w-full overflow-x-auto custom-scrollbar">
			<div id="chartOne" className="min-w-[500px]">
				<Chart options={options} series={series} type="bar" height={180} />
			</div>
		</div>
	);
}
