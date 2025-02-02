import pinataSDK, {
    PinataPinResponse,
    PinataTestAuthenticationResponse
} from "@pinata/sdk"
import { PINATA_API_KEY, PINATA_SECRET_API_KEY } from "@/constants"

const pinata = new pinataSDK({
    pinataApiKey: PINATA_API_KEY,
    pinataSecretApiKey: PINATA_SECRET_API_KEY
});

export const checkPinata = async (): Promise<PinataTestAuthenticationResponse> => {
    return await pinata.testAuthentication()
}

export const saveMetadataToIPFS = async (fileName: string, data: any) => {
    const body: any = data
    const options: any = {
        pinataMetadata: {
            name: fileName,
        },
        pinataOptions: {
            cidVersion: 0
        }
    }

    const res: PinataPinResponse = await pinata.pinJSONToIPFS(body, options)
    console.log(res)
    return res
}

export const getMetadataFromIPFS = async (fileName: string) => {
    const filters: any = {
        metadata: {
            name: fileName
        }
    }

    return await pinata.pinList(filters)
}