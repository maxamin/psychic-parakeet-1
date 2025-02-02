import { useRouter } from 'next/router'
import { Menu } from 'semantic-ui-react'

function Header() {
  const router = useRouter()

  const handleCampaignsClick = e => {
    e.preventDefault()
    router.push('/')
  }

  const handleSwapClick = e => {
    e.preventDefault()
    router.push('/signin')
  }
  return (
    <Menu style={{ margin: '20px 0', backgroundColor: 'lightSalmon' }}>
      <Menu.Item
        name="crowdcoin"
        style={{ backgroundColor: 'white' }}
        onClick={handleSwapClick}
      >
        DAOSwap
      </Menu.Item>
      <Menu.Menu style={{ backgroundColor: 'white' }} position="right">
        <Menu.Item name="campaigns" onClick={handleCampaignsClick}>
          Campaigns
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  )
}

export default Header
