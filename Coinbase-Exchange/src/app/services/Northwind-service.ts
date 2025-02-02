import { Northwind } from '../static-data/northwind';

class NorthwindService {
	public getData(tableName: string): any[] {
		return Northwind[tableName];
	}
}
export const northwindService: NorthwindService = new NorthwindService();
