import { TokenHolders } from '@covalenthq/web3-components';

function App() {
  return(
    <div className="TokenHolders">
      <TokenHolders
        tokenAddress="0xD417144312DbF50465b1C641d016962017Ef6240"
        chainId="1"
      />
    </div>
  )
}


export default App;