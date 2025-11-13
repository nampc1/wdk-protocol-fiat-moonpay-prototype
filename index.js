import { MoonPayProtocol } from "./src/moonpay-protocol.js";

async function main() {
  const moonPayHandler = new MoonPayProtocol({ secretKey: ''})

  const buyUrl = await moonPayHandler.buy('btc', 'usd', 1.2234, '0xabc')

  console.log(buyUrl)
}

main()