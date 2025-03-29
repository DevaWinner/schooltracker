import Button from "../../ui/button/Button";
import Input from "../../form/input/InputField";
import Label from "../../form/Label";
import { countries } from "../../../utils/countries";

interface UserAddressModalProps {
	userAddress: {
		address: string;
		city: string;
		state: string;
		country: string;
		zip: string;
	};
	selectedCountry: string;
	onSave: () => void;
	onClose: () => void;
	onCountryChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function UserAddressModal({
	userAddress,
	selectedCountry,
	onSave,
	onClose,
	onCountryChange,
}: UserAddressModalProps) {
	return (
		<div className="relative w-full p-4 overflow-y-auto bg-white no-scrollbar rounded-3xl dark:bg-gray-900 lg:p-11">
			<div className="px-2 pr-14">
				<h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
					Edit Address
				</h4>
				<p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
					Update your address information.
				</p>
			</div>
			<form className="flex flex-col">
				<div className="px-2 overflow-y-auto custom-scrollbar">
					<div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
						<div>
							<Label>Country</Label>
							<select
								value={selectedCountry}
								onChange={onCountryChange}
								className="w-full px-3 py-2 border rounded-lg border-gray-200 focus:outline-none focus:border-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
							>
								<option value="">Select a country</option>
								{countries.map((country) => (
									<option key={country.code} value={country.name}>
										{country.name}
									</option>
								))}
							</select>
						</div>

						<div>
							<Label>City</Label>
							<Input type="text" value={userAddress.city} />
						</div>

						<div>
							<Label>State</Label>
							<Input type="text" value={userAddress.state} />
						</div>

						<div>
							<Label>Postal Code</Label>
							<Input type="text" value={userAddress.zip} />
						</div>

						<div className="col-span-2">
							<Label>Address</Label>
							<Input type="text" value={userAddress.address} />
						</div>
					</div>
				</div>
				<div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
					<Button size="sm" variant="outline" onClick={onClose}>
						Cancel
					</Button>
					<Button size="sm" onClick={onSave}>
						Save Changes
					</Button>
				</div>
			</form>
		</div>
	);
}
