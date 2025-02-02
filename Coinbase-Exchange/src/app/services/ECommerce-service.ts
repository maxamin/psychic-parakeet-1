import { RevenueType } from '../models/e-commerce/revenue-type';

class ECommerceService {
	public getRevenueList = async (): Promise<RevenueType[]> => {
		const response = await fetch('https://excel2json.io/api/share/03e74dde-d2e1-4fee-437d-08da496bf5f2');
		if (!response.ok) {
			return Promise.resolve([]);
		}
		return response.json();
	}
}
export const eCommerceService: ECommerceService = new ECommerceService();
