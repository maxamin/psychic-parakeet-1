import { ILayoutEventLog } from "@/interfaces/intl"
import { IEventLog, ILayoutEventLogMapping, IhandleEventsResponse } from "@/interfaces/layout"
import { Log } from "viem"

export const handleEvents = (
    layoutEventLog: ILayoutEventLog,
    eventLogs: Iterable<Log>, 
    mapping: ILayoutEventLogMapping
): IhandleEventsResponse => {
    
    let handleEventsResponse: IhandleEventsResponse = {
        eventLog: undefined,
        ok: false
    }
    console.log(`handle events`, eventLogs)
    for (const log of eventLogs as Iterable<Log>) {
        // @ts-expect-error experimental
        const logArgs: any = log.args
        console.log('handleEvents mapping', mapping)
        console.log('handleEvents logArgs', logArgs)

        if (logArgs[mapping.addressAttribute] === mapping.addressValue) {
            const eventLog: IEventLog  = {
                blockTitle: layoutEventLog.blockTitle,
                blockData: [
                    {
                        title: layoutEventLog.smartContractAddress,
                        value: log.address
                    },
                    {
                        title: layoutEventLog.blockHash,
                        value: log.blockHash
                    },
                    {
                        title: layoutEventLog.transactionHash,
                        value: log.transactionHash
                    },
                    {
                        title: layoutEventLog.blockNumber,
                        value: log.blockNumber?.toString()
                    },
                ],
                title: layoutEventLog.title,
                data: []
            }
            
            handleEventsResponse = {eventLog: eventLog, ok: true}
            return handleEventsResponse
        }
    }
    console.log('handleEvents handleEventsResponse', handleEventsResponse)
    return handleEventsResponse
}