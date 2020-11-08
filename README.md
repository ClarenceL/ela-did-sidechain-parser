# Elastos DID Sidechain Chainwalker

This parser communicates with Elastos DID Sidechain node's RPC interface to extract and decode blocks & transactions.

Elastos and FCAS Encompasses 3 Parsers

1. Elastos Mainchain - UTXO-based - https://blockchain.elastos.org
2. Elastos ETH Sidechain - EVM (Account-based) - https://explorer.elaeth.io
3. Elastis DID Sidechain - JSON-based - https://idchain.elastos.org

### Running Directly

You can run the parsers without docker, this is a NodeJS based parser:

1. Ensure you are on NodeJS v12+, we recommend you use **nvm** - https://github.com/nvm-sh/nvm
2. `nvm use lts/erbium` - this is the LTS v12 NodeJS 
3. `npm install`
4. Build `dist/app.js` - this is written in Typescript which must be transpiled to JS
    `npm run tsc`
4. This also requires **jq** - a lightweight and flexible command-line JSON processor.
    `sudo apt-get install jq` - https://stedolan.github.io/jq
5. Ensure the `.env` file is in the root directory with entries for ELASTOS_RPC, ELASTOS_RPC_PORT
6. Your IP needs to be whitelisted by whichever Elastos RPC node you are connecting to, ensure its `config.json` 
    has `EnableRPC` set to true and your IP whitelisted, e.g:
    ```json
    {
      "Configuration": {
        "DPoSConfiguration": {
          "EnableArbiter": true,
          "IPAddress": "[YOUR NODE IP]"
        },
        "PrintLevel":1,
        "HttpInfoStart": true,
        "EnableRPC": true,
        "RpcConfiguration": {
          "WhiteIPList": [
            "127.0.0.1",
            "[YOUR IP]"
          ]
        }
      }
    }
    ```   

#### Usage

##### `get_height.sh`

`sh get_height.sh`

### Running Tests

Do the above for "Running Directly" to setup the environment then run

`mocha test/index.js --timeout 10000`

## Running in Docker

1. Initialize the image, by running `sh build_docker_image.sh` to build the image. This will create an image with the tag `chainwalkers_elastos_mainchain:latest`.

2. With the docker container built you should be able to run (YOU MUST USE BASH NOT SH):

```shell

# Get the current height.
> docker run chainwalkers_elastos_mainchain:latest bash get_height.sh

# Parse an array of blocks.
> docker run chainwalkers_elastos_mainchain:latest bash parse_blocks.sh 553991 636680

```

3. Each `run` creates a new container, after you're done make sure to `rm` it to reduce clutter or run it in detached mode.
