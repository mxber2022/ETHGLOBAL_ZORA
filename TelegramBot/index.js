const { Web3 } = require('web3');
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { NFTStorage, File } = require('nft.storage');
const axios = require('axios');
const {abi} = require('./abi.js')
const { ethers } = require('ethers');
require('dotenv/config');

const app = express();
const port = "8080";
app.use(bodyParser.json());

const rpc_url = "https://testnet.rpc.zora.co"; 
//const rpc_url_optimism = "https://goerli.optimism.io/"; 
//const rpc_url_base = "https://base-goerli.public.blastapi.io/"; 
const web3 = new Web3(rpc_url);

const botToken = process.env.BotToken;
const bot = new TelegramBot(botToken, { polling: true });
let chatId;









const userState = {};
let CHAIN;

bot.onText(/\/mint/, (msg) => {
  const chatId = msg.chat.id;

  // Define the inline keyboard buttons
  const keyboard = [
    [{ text: 'MINT ON ZORA', callback_data: 'zora' }],
    [{ text: 'MINT ON BASE 🛡️', callback_data: 'base' }],
    [{ text: 'MINT ON OPTIMISM ✨🔴_🔴✨', callback_data: 'optimism' }]
  ];

  const replyMarkup = {
    reply_markup: {
      inline_keyboard: keyboard,
    },
  };

  bot.sendMessage(chatId, 'Please choose an option:', replyMarkup);
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  const selectedNetwork = query.data;

  if (selectedNetwork === 'optimism') {
    CHAIN = "optimism";
    bot.sendMessage(chatId, 'Send NFT and address to mint on optimism');
  }
  if (selectedNetwork === 'base') {
    CHAIN = "base";
    bot.sendMessage(chatId, 'Send NFT and address to mint on base');
  }
  if (selectedNetwork === 'zora'){
    CHAIN = "zora";
    bot.sendMessage(chatId, 'Send NFT and address to mint on zora');
  }
  
});













async function main() {
  
  bot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello welcome to ZORA bot, let makes minting easy");
  });

  bot.onText(/\/rich/, (msg) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hold my beer");
  });

  bot.onText(/\/contract/, (msg) => {
    
    const interval = setInterval(findNewlyDeployedContracts, 9000);
    //findNewlyDeployedContracts();

  });


  bot.on('photo', async (msg) => {
    //console.log("msg", msg);
    try {
      const apiKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVGYzA0NTUyMzI5ODA5NDI4NDkzY0VDYjdmZkY4RkUxNGY5YkQzOTQiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4OTk2NjA0NzY5NiwibmFtZSI6IlBhcmlzIn0.9CxIio0ygPmcf8onnQcFrZurTQACHiB8qOgO6tcHEWs"; 
      const client1 = new NFTStorage({ token: apiKey });
      
      // Get the array of photo sizes
      const photo = msg.photo;
      // Get the largest photo available
      const largestPhoto = photo[photo.length - 1];
      const fileId = largestPhoto.file_id;
      
      // Get photo info to download
      const photoInfo = await bot.getFile(fileId);
      const photoUrl = `https://api.telegram.org/file/bot${botToken}/${photoInfo.file_path}`;
     // console.log("photoUrl", photoUrl);
      // Download the photo buffer
      const photoBuffer = await downloadFileBuffer(photoUrl);
      console.log(photoBuffer);
      // Upload the photo buffer to IPFS
      const file = new File([photoBuffer], "zora.jpg", { type: 'image' });
      const metadata = await client1.store({
        name: "My NFT Image",
        description: "Description of the image",
        image: file,
      });
      bot.sendMessage(msg.chat.id, `IPFS Hash: ${metadata.url}`);

      /* 
        Mint nft logic using web3.js
      */

      const words = msg.caption.split(' ');
      let temp = words.filter(word => word.trim() !== '');



      let rpc_url_z;
      let contractAddress;
      let CHIN_ID;
      const MINT_TO = temp.at(0);
      //const CHAIN = temp.at(1);
      const ZORA_CONTRACT = "0x2E61762970Ed685ae91c8aCa27D7E926C67f1662";
      const OPTIMISM_CONTRACT = "0xb5dD8f6770593bC05Dc5B336F809695Ee481c991";
      const BASE_CONTRACT = "0xb5dD8f6770593bC05Dc5B336F809695Ee481c991";
      const rpc_url_zora = "https://testnet.rpc.zora.co"; 
      const rpc_url_optimism = "https://goerli.optimism.io"; 
      const rpc_url_base = "https://base-goerli.public.blastapi.io/"; 

      if(CHAIN == "zora"){
        rpc_url_z = rpc_url_zora;
        contractAddress = ZORA_CONTRACT;
        CHIN_ID = 999;
      }

      if(CHAIN == "optimism"){
        rpc_url_z = rpc_url_optimism;
        contractAddress = OPTIMISM_CONTRACT;
        CHIN_ID = 420;
      }

      if(CHAIN == "base"){
        rpc_url_z = rpc_url_base;
        contractAddress = BASE_CONTRACT;
        CHIN_ID = 84531;
      }


    
      const PRIVATE_KEY = process.env.PRIVATE_KEY;
      const provider = new ethers.providers.JsonRpcProvider(rpc_url_z);
      const contract = new ethers.Contract( contractAddress , abi , provider );
      const senderWallet = new ethers.Wallet(PRIVATE_KEY, provider);
      const nonce = await provider.getTransactionCount(senderWallet.address);

      const tx = await contract.populateTransaction.safeMint(MINT_TO, metadata.url, {
          nonce: nonce, 
          gasPrice:50000000000, 
          gasLimit: 1000000
        }); 
      console.log(tx);
      tx.chainId = CHIN_ID;
      
      
      const signedTx = await senderWallet.signTransaction(tx);
      
      const txResponse = await provider.sendTransaction(signedTx);

      console.log('Transaction hash:', txResponse.hash);
      const receipt = await txResponse.wait();
      console.log('Transaction receipt:', receipt);
      bot.sendMessage(msg.chat.id, `Your NFT is Minted: ${receipt.transactionHash}`);



    } catch (error) {
      console.error(error);
      bot.sendMessage(msg.chat.id, 'An error occurred while processing the photo.');
    }
  });





  app.listen(port, () => {
    console.log(`Bot started on ${port}`);
  });
}

async function downloadFileBuffer(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return response.data;
}


async function findNewlyDeployedContracts() {
  try 
  {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    console.log("Latest block number: ", latestBlockNumber);

    // Set the block range to search for newly deployed contracts (e.g., last 1000 blocks)
    const startBlockNumber = BigInt(latestBlockNumber) - BigInt(100);
    const endBlockNumber = BigInt(latestBlockNumber);

    const newlyDeployedContracts = [];

    // Loop through the blocks in the specified range
    for (let blockNumber = startBlockNumber; blockNumber <= endBlockNumber; blockNumber++) {
      const block = await web3.eth.getBlock(Number(blockNumber), true); // Convert BigInt to Number
      //console.log("Block: ", block);

      // Loop through the transactions in the block
      if (block && block.transactions) 
      {
        for (const transaction of block.transactions) {
          if (transaction.to === null) {
            bot.sendMessage(chatId, transaction.hash);
            newlyDeployedContracts.push(transaction.hash);
          }
        }
      }
    }

    // Log the newly deployed contract addresses
    console.log('Newly Deployed Contracts:', newlyDeployedContracts);
    return newlyDeployedContracts;
  } catch (error) {
    console.error('Error finding newly deployed contracts:', error);
  }
}

main();


