import { Table1Type } from '../models/crmapp-data/table1-type';
import { MeetingsTasksType } from '../models/crmapp-data/meetings-tasks-type';

class CRMAppDataService {
	public getTable1List = async (): Promise<Table1Type[]> => {
		const response = await fetch('https://excel2json.io/api/share/7c450fc9-b631-4529-e668-08dab79fa5b4');
		if (!response.ok) {
			return Promise.resolve([]);
		}
		return response.json();
	}

	public getMeetingsTasksList = async (): Promise<MeetingsTasksType[]> => {
		const response = await fetch('https://excel2json.io/api/share/2fd4ecd6-da6c-4e37-e666-08dab79fa5b4');
		if (!response.ok) {
			return Promise.resolve([]);
		}
		return response.json();
	}
}
export const cRMAppDataService: CRMAppDataService = new CRMAppDataService();
