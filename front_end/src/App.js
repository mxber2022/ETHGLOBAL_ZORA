function App() {

  let headers = new Headers();
    headers.set('Authorization', "Bearer cqt_rQPbw93kTRvKV9tXdqHd8YPQpPJr")


fetch("https://api.covalenthq.com/v1/base-testnet/address/0x7199D548f1B30EA083Fe668202fd5E621241CC89/balances_v2/?nft=true", {method: 'GET', headers: headers})
  .then((resp) => resp.json())
  .then((data) => console.log(data));

  return(
    <div className="TokenHolders">
      Hello
    </div>
  )
}


export default App;