// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'cpphs0bnr7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev--v1efso4.us.auth0.com',            // Auth0 domain
  clientId: 'UucBtpByurw4vI4SB8GV3pm3iSK9MmDI',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
