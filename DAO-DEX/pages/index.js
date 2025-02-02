// index.js (next's root route)

// Imports
import Link from 'next/link'
import { Container, Header, Button, Card } from 'semantic-ui-react'
import { useRouter } from 'next/router'
import campaignFactory from 'utils/ethereum/campaignFactory'
import HeadComps from 'components/Head/HeadComps'
import Layout from 'components/Layout/Layout'
import Logo from 'components/Logo'

export default function Home({ campaigns }) {
  const router = useRouter()

  const handleCreateCampaign = e => {
    e.preventDefault()
    //router.push('/campaigns/new')
  }

  const renderCampaigns = () => {
    const items = campaigns.map(address => {
      return {
        key: address,
        header: (
          <Header as="h3" style={{ wordBreak: 'break-all' }}>
            {address}
          </Header>
        ),
        description: (
          <Link href={`/campaigns/${address}`}>
            <a>View Campaign</a>
          </Link>
        ),
        fluid: true
      }
    })

    return <Card.Group centered items={items} />
  }

  return (
    <Layout>
      <HeadComps />
      <Container>
        <Header as="h3">Open Campaigns</Header>
        {renderCampaigns()}
        <Logo />
      </Container>
      <Button
        primary
        content="Create Campaign (Level 1 Users Only)"
        icon="add circle"
        onClick={handleCreateCampaign}
      />
    </Layout>
  )
}

export async function getServerSideProps() {
  const campaigns = await campaignFactory.methods.getDeployedCampaigns().call()
  return {
    props: {
      campaigns
    }
  }
}
