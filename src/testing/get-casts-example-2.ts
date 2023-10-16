import { getSSLHubRpcClient } from '@farcaster/hub-nodejs'

const hubRpcEndpoint = 'your-hub-id.hubs.neynar.com:2283'
const client = getSSLHubRpcClient(hubRpcEndpoint)

client.subscribe({ eventTypes: [1], fromId: 0 }).then((hubResult) => {
    hubResult.map((stream) => {
      stream.on('data', (event) => {
          if (event.mergeMessageBody?.message?.data?.castAddBody != undefined){
              console.log('event', event)
              console.log(
                  'event mergeMessageBody',
                  event.mergeMessageBody?.message?.data?.castAddBody
              )
          }
      })
    })
  })


// client.getCastsByParent({parentUrl:'chain://eip155:1/erc721:0x5a5ddb8a2d1ee3d8e9fd59785da88d573d1a84fe'}).then((result =>{
//     result.map((messagesResponse) => {
//         messagesResponse.messages.map(events => {
//             console.log(events)
//         })
//     })
// }))
