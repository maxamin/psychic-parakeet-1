import { useState } from 'react'
import { useRouter } from 'next/router'
import { Table, Button, Message } from 'semantic-ui-react'
import web3 from 'utils/ethereum/web3'
import Campaign from 'utils/ethereum/campaign'

const RequestRow = ({ id, request, address, approversCount }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [approveErrorMag, setApproveErrorMag] = useState('')
  const [finalizeErrorMag, setFinalizeErrorMag] = useState('')
  const readyToFinalize = !request.complete && request.approvalCount > (approversCount / 2)

  const handleApprove = async () => {
    setLoading(true)
    setApproveErrorMag('')
    
    try {
      const accounts = await web3.eth.getAccounts()
      const campaign = Campaign(address)
      await campaign.methods.approveRequest(id).send({
        from: accounts[0]
      })

      router.replace(`/campaigns/${address}/requests`)
    } catch(err) {
      console.log(err)
      setApproveErrorMag(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleFinalize = async () => {
    setLoading(true)
    setFinalizeErrorMag('')
    
    try {
      const accounts = await web3.eth.getAccounts()
      const campaign = Campaign(address)
      await campaign.methods.finalizeRequest(id).send({
        from: accounts[0]
      })

      router.replace(`/campaigns/${address}/requests`)
    } catch(err) {
      console.log(err)
      setFinalizeErrorMag(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Table.Row positive={readyToFinalize}>
      <Table.Cell>{id + 1}</Table.Cell>
      <Table.Cell>{request.description}</Table.Cell>
      <Table.Cell>{web3.utils.fromWei(request.value, 'ether')}</Table.Cell>
      <Table.Cell>{request.recipient}</Table.Cell>
      <Table.Cell>{`${request.approvalCount}/${approversCount}`}</Table.Cell>
      <Table.Cell>
        <Button color="green" basic onClick={handleApprove} loading={loading} disabled={request.complete}>Approve</Button>
        {approveErrorMag && <Message header="Oops!" error={!!approveErrorMag} content={approveErrorMag} />}
      </Table.Cell>
      <Table.Cell>
        <Button color="red" basic onClick={handleFinalize} loading={loading} disabled={request.complete}>Finalize</Button>
        {finalizeErrorMag && <Message header="Oops!" error={!!finalizeErrorMag} content={finalizeErrorMag} />}
      </Table.Cell>
    </Table.Row>
  )
}

export default RequestRow
