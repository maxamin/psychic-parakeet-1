import { useState } from 'react'
import { useRouter } from 'next/router'
import { Form, Input, Button, Message } from 'semantic-ui-react'
import Campaign from 'utils/ethereum/campaign'
import web3 from 'utils/ethereum/web3'

const ContributeForm = ({ address }) => {
  const router = useRouter()
  const [value, setValue] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errorMag, setErrorMag] = useState('')

  const handleOnChange = (e) => {
    setValue(e.target.value)
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMag('')
    try {
      const campaign = Campaign(address)
      const accounts = await web3.eth.getAccounts()
      await campaign.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(value, 'ether')
      })
      afterSubmit()
    } catch(err) {
      console.log(err)
      setErrorMag(err.message)
    } finally {
      setLoading(false)
      setValue(0)
    }
  }

  const afterSubmit = () => {
    router.replace(`/campaigns/${address}`)
  }
  return (
    <Form onSubmit={handleOnSubmit} loading={loading} error={!!errorMag}>
      <Form.Field>
        <label>Amount to Contribute</label>
        <Input
          type="number"
          label="ether"
          labelPosition="right"
          placeholder="Amount to Contribute"
          value={value}
          onChange={handleOnChange}
        />
      </Form.Field>
      <Message error header="Oops!" content={errorMag} />
      <Button loading={loading} primary type='submit'>Contribute!</Button>
    </Form>
  )
}

export default ContributeForm