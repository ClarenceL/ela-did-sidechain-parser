# Get the current height of the blockchain and post json to stdout.
#
#
#      Example:
#      > bash get_height.sh
#      > {"height": 3000000}
#
#
# Put command to run here:

export $(grep -v '^#' .env | xargs)

# requires jq: "sudo apt-get install jq"
curl -s -H 'Content-Type: application/json' -H 'Accept:application/json' --data '{"method":"getcurrentheight"}' http://$ELASTOS_DID_RPC | jq -M 'del(.error, .id, .jsonrpc) | {height: .result}'

