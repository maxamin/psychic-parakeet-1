import { useState } from 'react'
import { useRouter } from 'next/router'
import { Container, Header, Form, Input, Button, Message } from 'semantic-ui-react'
import HeadComps from 'components/Head/HeadComps'
import Layout from 'components/Layout/Layout'
import campaignFactory from 'utils/ethereum/campaignFactory'
import web3 from 'utils/ethereum/web3'

export default function New() {
  const router = useRouter()
  const [minimumWei, setMinimumWei] = useState(0)
  const [loading, setLoading] = useState(false)
  const [errorMag, setErrorMag] = useState('')

  const handleOnChange = (e) => {
    e.preventDefault()
    setMinimumWei(e.target.value)
  }

  const handleOnSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMag('')
    console.log('submit minimumWei:', minimumWei)
    try {
      const accounts = await web3.eth.getAccounts()
      await campaignFactory.methods
        .createCampaign(minimumWei)
        .send({
          from: accounts[0],
        })
      router.push('/')
    } catch(err) {
      console.log(err)
      setErrorMag(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <HeadComps title="Create A Campaign"/>
      <Container>
        <Header as='h3'>Create A Campaign</Header>
        <Form onSubmit={handleOnSubmit} loading={loading} error={!!errorMag}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              type="number"
              label="wei"
              labelPosition="right"
              placeholder='Minimum Contribution'
              value={minimumWei}
              onChange={handleOnChange}
            />
          </Form.Field>
          <Message error header="Oops!" content={errorMag} />
          <Button loading={loading} primary type='submit'>Create!</Button>
        </Form>
      </Container>
    </Layout>
  )
}
