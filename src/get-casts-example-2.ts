import { getSSLHubRpcClient } from '@farcaster/hub-nodejs'

const hubRpcEndpoint = 'your-hub-id.hubs.neynar.com:2283'
const client = getSSLHubRpcClient(hubRpcEndpoint)

client.subscribe({ eventTypes: [1] }).then((hubResult) => {
    hubResult.map((stream) => {
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