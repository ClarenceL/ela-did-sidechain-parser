
export $(grep -v '^#' .env | xargs)

# requires jq: "sudo apt-get install jq"

BLOCKS=()

# iterate through args, each arg is a block number
for BLOCK_NUM in $@
do
    # getblock only accepts blockhashes not height, so retrieve the blockhash for the height
    BLOCK_HASH=$(curl -s -H 'Content-Type: application/json' -H 'Accept:application/json' --data "{\"method\":\"getblockhash\", \"params\":{\"height\":$BLOCK_NUM}}" http://$ELASTOS_DID_RPC | jq -c '.result')

    BLOCK_DATA=$(curl -s -H 'Content-Type: application/json' -H 'Accept:application/json' --data "{\"method\":\"getblock\", \"params\":{\"blockhash\":$BLOCK_HASH,\"verbosity\":2}}" http://$ELASTOS_DID_RPC | jq -c '.result')

    BLOCKS+=("$BLOCK_DATA")
done

# debug length
# echo "${#BLOCKS[@]}"

# join array on ,
ALL_BLOCKS=$(printf ",%s" "${BLOCKS[@]}")
ALL_BLOCKS=${ALL_BLOCKS:1}

# we are wrapping the objects with [ ] and piping to jq
echo "[$ALL_BLOCKS]" | jq '.' >> "./raw_dump/$BLOCK_NUM.json"
