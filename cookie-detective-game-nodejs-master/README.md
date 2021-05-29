# Actions on Google: Cookie Detective Game

**NOTE**

This is an experimental project and will receive minimal maintenance. Only bugs for security issues will be accepted. No feature requests will be accepted. Pull requests will be acknowledged and reviewed as soon as possible. There is no associated SLAs.

Some of the projects in this experimental org might mature to a more stable state and move into the main [Actions on Google GitHub org](https://github.com/actions-on-google).

---
![Cookie Detective](/view/static/image/cookiedetective.png?raw=true "Cookie Detective")

This is the full source code for the Google Assistant game, [Cookie Detective](https://assistant.google.com/services/invoke/uid/00000099ed26bbda?hl=en).

Have your kids become kitchen sleuths as they locate their cookie friend under 10 guesses. Make sure the mouse doesn't get to the cookie first!

After cracking the case, do the celebratory cookie dance before journeying to harder levels in space and under the sea.

This game supports both single and multiplayer modes.

This game has been designed for Nest Hub and Nest Hub Max smart displays and implemented using [Interactive Canvas](https://developers.google.com/assistant/interactivecanvas).

### Prerequisites
1. Yarn
    + Make sure [yarn](https://yarnpkg.com/) is installed on your system
1. Install the [Firebase CLI](https://firebase.google.com/docs/cli)
    + We recommend using MAJOR version `8` with `8.3.0` or above, `npm install -g firebase-tools@^8.3.0`
    + Run `firebase login` with your Google account
1. Install [gsutil](https://cloud.google.com/storage/docs/gsutil_install)
    + Run `gcloud init` and log in
1. For Windows developers, the projects scripts rely on Unix-like scripts, so we recommend installing Ubuntu on Windows Subsystem for Linux.

### Installing dependencies
1. Download the following [GSAP](https://greensock.com/gsap/) plugins and place their `.js` files in the `/view/src/vendor/gsap` directory:
   * CustomBounce
   * CustomEase
   * CustomWiggle
   * DrawSVGPlugin
   * GSDevTools
   * MorphSVGPlugin
   * Physics2DPlugin
   * PhysicsPropsPlugin
   * ScrambleTextPlugin
   * SplitText
   * ThrowPropsPlugin

### Setup
#### Actions Console
1. From the [Actions on Google Console](https://console.actions.google.com/), **New project** > **Create project** > **Game** > **Blank Project for Smart Display**
1. Enable the `For Families` option under  **Deploy** > **Directory information** > **Additional information** and save the information.

#### Configuration
1. Run Yarn from the project root directory and the `agent/` and `view/` directories: `yarn && cd agent/ && yarn && cd ../view/ && yarn && cd ../`.
1. Run `firebase use --add {PROJECT_ID}` in the project root directory.
1. Edit `PROJECT_ID` file and and replace `{PROJECT_ID}` with your project ID.

### Google Cloud setup
The game TTS is generated using the Google Cloud TTS service and the generated audio files is persisted in Google Storage. The Canvas web app is also hosted in Cloud Storage.
- Enable the Text-to-Speech service for your project
- Create a service account for the TTS service, without any roles
- Generate a JSON key file for the TTS service account and put it in `/agent/config/tts.json`
- Generate an API key for the TTS service and put it in `/view/src/config/config.js` (`environments.variables[VariableNames.TTS_API_KEY].development`)
- Create a Storage Bucket with the same name as the project ID and [enable public access](https://cloud.google.com/storage/docs/access-control/making-data-public#buckets)
- Create a service account with the role "Storage Object Admin"
- Generate a JSON key file for the Storage bucket service account and put it in `/agent/config/storage.json`

#### Actions CLI
1. Install the [Actions CLI](https://developers.google.com/assistant/actionssdk/gactions)
1. Navigate to `agent/action/settings/settings.yaml`, and replace `{PROJECT_ID}` with your project ID.
1. Navigate to `agent/action/settings/en/settings.yaml`, and replace `{Game Name}` your own name.
1. Navigate to `agent/action/webhook/AssistantStudioFulfillment.yaml`, and replace `{PROJECT_ID}` with your project ID
1. Navigate to the `agent/` directory by running `cd agent` from the root directory of this project.
1. Run `gactions login` to login to your account.
1. Run `yarn push` to push the whole project.

### Build and deploy
#### First time deployment
- Enable CORS on your bucket: `cd view/ && yarn cors`
- Deploy the view: `cd view/ && yarn build && yarn deploy`
- Obtain the public URL of the view's index.html file from the Cloud Console and put the public URL in `/agent/config/config.json` (`default.viewUrl`).
- Deploy the agent config & webhook: `cd agent/ && yarn build && yarn deploy`
- Put the public URL to the webhook endpoint in `/agent/config/config.json` (`default.webhookUrl`) and replace the version number in the path with `{VERSION}`
- Put the public URL to the TTS cache endpoint in `/view/src/config/config.js` (`environments.variables[VariableNames.TTS_URL].production`)
- Re-deploy the view: `cd view/ && yarn build && yarn deploy`
#### Future deployments
- From the project root: `yarn build && yarn deploy` (this will bump the minor version automatically)

### Running this Sample
+ You can test your Action on any Google Assistant-enabled device on which the Assistant is signed into the same account used to create this project. Just say or type, “OK Google, talk to my test app”.
+ You can also use the Actions on Google Console simulator to test most features and preview on-device behavior.

## References & Issues
+ Questions? Go to [StackOverflow](https://stackoverflow.com/questions/tagged/actions-on-google) or the [Assistant Developer Community on Reddit](https://www.reddit.com/r/GoogleAssistantDev/).
+ For bugs, please report an issue on Github.
+ Actions on Google [Documentation](https://developers.google.com/assistant)
+ Actions on Google [Codelabs](https://codelabs.developers.google.com/?cat=Assistant)

## Contributing
Please read and follow the steps in the [CONTRIBUTING.md](CONTRIBUTING.md).

## License
See [LICENSE](LICENSE).
