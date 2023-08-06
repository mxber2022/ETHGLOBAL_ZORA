const { Web3 } = require('web3');
const express = require('express');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');
const { NFTStorage, File } = require('nft.storage');
const axios = require('axios');
require('dotenv/config');

const app = express();
const port = "8080";
app.use(bodyParser.json());

const ethereumNodeUrl = "https://base-mainnet.public.blastapi.io"; 
const web3 = new Web3(ethereumNodeUrl);

const botToken = process.env.BotToken;
const bot = new TelegramBot(botToken, { polling: true });
let chatId;

async function main() {
  
  bot.onText(/\/start/, (msg) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hello welcome to base bot, lets get rich together");
  });

  bot.onText(/\/rich/, (msg) => {
    chatId = msg.chat.id;
    bot.sendMessage(chatId, "Hold my beer");

    console.log("message"); // Print message to terminal
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

      console.log("metadata: ", metadata);
    
      // Send the IPFS hash to the user
      bot.sendMessage(msg.chat.id, `Your photo is now on IPFS!\nIPFS Hash: ${metadata.url}`);

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


