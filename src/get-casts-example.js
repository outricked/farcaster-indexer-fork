import { getSSLHubRpcClient } from '@farcaster/hub-nodejs'

;(async () => {
  let hubRpcEndpoint = 'your-hub-id.hubs.neynar.com:2283'
  let client = getSSLHubRpcClient(hubRpcEndpoint)

  client.$.waitForReady(Date.now() + 10000, async (e) => {
    if (e) {
      console.error(`Failed to connect to ${hubRpcEndpoint}:`, e)
      process.exit(1)
    } else {
      console.log(`Connected to ${hubRpcEndpoint}`)

      client.subscribe({ eventTypes: [1] }).then((hubResult) => {
        hubResult.andThen((stream) => {
          stream.on('data', (event) => {
            console.log('event', event)
            console.log('event properties: ', Object.keys(event))
            console.log(
              'event mergeMessageBody',
              event.mergeMessageBody?.message?.data?.castAddBody
            )
          })
        })
      })
      // console.log('grabbing user information for fid3')
      // const result = await client.getLinksByFid({ fid: 9802 })
      // result.map((messagesResponse) =>
      //   console.log(messagesResponse.messages.length)
      // )
      // result.map((messagesResponse) =>
      //   messagesResponse.messages.map((message) =>
      //     console.log(message.data?.linkBody)
      //   )
      // )
      // console.log(result.map)

      // console.log('grabbing casts by parent request')
      // const castsResult = await client.getCastsByParent({
      //   parentUrl:
      //     'chain://eip155:7777777/erc721:0x4f86113fc3e9783cf3ec9a552cbb566716a57628',
      // })
      // castsResult.map((messageResponse) =>
      //   messageResponse.messages.map((cast) =>
      //     console.log(cast.data?.castAddBody?.text)
      //   )
      // )
      client.close()
    }
  })
})()
