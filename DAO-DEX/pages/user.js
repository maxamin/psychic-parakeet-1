import { getSession, signOut } from 'next-auth/react'
import Moralis from 'moralis'
import { useState } from 'react'
import axios from 'axios'
import { useSendTransaction } from 'wagmi'
import Header from 'components/Layout/Header'
import { Container } from 'semantic-ui-react'

function User({ user, balance }) {
  const [fromToken] = useState('0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE')
  const [toToken, setToToken] = useState(
    '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
  ) //USDC ERC20 Contract
  const [value, setValue] = useState('1000000000000000000')
  const [valueExchanged, setValueExchanged] = useState('')
  const [valueExchangedDecimals, setValueExchangedDecimals] = useState(1e18)
  const [to, setTo] = useState('')
  const [txData, setTxData] = useState('')

  function changeToToken(e) {
    setToToken(e.target.value)
    setValueExchanged('')
  }

  function changeValue(e) {
    setValue(e.target.value * 1e18)
    setValueExchanged('')
  }

  async function get1inchSwap() {
    const tx = await axios.get(
      `https://api.1inch.io/v4.0/137/swap?fromTokenAddress=${fromToken}&toTokenAddress=${toToken}&amount=${value}&fromAddress=${user.address}&slippage=5`
    )
    console.log(tx.data)
    setTo(tx.data.tx.to)
    setTxData(tx.data.tx.data)
    setValueExchangedDecimals(Number(`1E${tx.data.toToken.decimals}`))
    setValueExchanged(tx.data.toTokenAmount)
  }

  return (
    <Container>
      <Header as="h3" style={{ width: '100px' }}></Header>
      <div>
        <select>
          <option value="0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE">
            MATIC
          </option>
        </select>
        <input
          onChange={e => changeValue(e)}
          value={value / 1e18}
          type="number"
          min={0}
        ></input>
        <br />
        <br />
        <select name="toToken" value={toToken} onChange={e => changeToToken(e)}>
          <option value="0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619">
            WETH
          </option>
          <option value="0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174">
            USDC
          </option>
        </select>
        <input
          value={
            !valueExchanged
              ? ''
              : (valueExchanged / valueExchangedDecimals).toFixed(5)
          }
          disabled={true}
        ></input>
        <br />
        <br />
        <button>Get Conversion</button>
        <button disabled={!valueExchanged}>Swap Tokens</button>
        <br />
        <br />
        <button onClick={() => signOut({ redirect: '/signin' })}>
          Sign out
        </button>
      </div>
    </Container>
  )
}

export default User
