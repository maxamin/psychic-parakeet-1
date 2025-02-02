import { AddressType } from './address-type';

export interface CustomersType {
	customerID: string;
	companyName: string;
	contactName: string;
	contactTitle: string;
	address: AddressType;
}
