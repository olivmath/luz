#!/bin/bash
# Stellar Ledger Header XDR Decoder — pure bash
# Uso: bash decode_ledger.sh <header_xdr_base64>

HEADER_XDR="$1"
[ -z "$HEADER_XDR" ] && { echo "Uso: bash decode_ledger.sh <header_xdr>"; exit 1; }

HEX=$(echo "$HEADER_XDR" | base64 -d | od -A n -t x1 | tr -d ' \n')
TOTAL_BYTES=$((${#HEX}/2))
P=0  # position pointer (in bytes)

# Read N bytes as hex string, advance P
grab() { local n=$1; RESULT="${HEX:$((P*2)):$((n*2))}"; P=$((P+n)); }

# Read uint32, store in RESULT as decimal
grab_u32() { grab 4; RESULT=$(printf '%d' "0x${RESULT}"); }

# Read uint64, store in RESULT as decimal  
grab_u64() { grab 8; RESULT=$(printf '%d' "0x${RESULT}"); }

# Read 32-byte hash, store in RESULT as hex
grab_hash() { grab 32; }

echo "============================================================"
echo "  STELLAR LEDGER HEADER — Raw XDR Decode"
echo "============================================================"

# --- ledger_version (uint32) ---
grab_u32; VERSION=$RESULT

# --- previous_ledger_hash (Hash = opaque[32]) ---
grab_hash; PREV_HASH=$RESULT

# --- scp_value.tx_set_hash (Hash) ---
grab_hash; TX_SET_HASH=$RESULT

# --- scp_value.close_time (TimePoint = uint64) ---
grab_u64; CLOSE_TIME=$RESULT

# --- scp_value.upgrades (variable array of opaque<128>) ---
grab_u32; UPGRADES_LEN=$RESULT
for ((i=0; i<UPGRADES_LEN; i++)); do
  grab_u32; UPG_SIZE=$RESULT
  PADDED=$(( (UPG_SIZE+3)/4*4 ))
  P=$((P+PADDED))
done

# --- scp_value.ext (union) ---
grab_u32; EXT_TYPE=$RESULT
NODE_ID_STR=""
if [ "$EXT_TYPE" -eq 1 ]; then
  # STELLAR_VALUE_SIGNED → LedgerCloseValueSignature
  # nodeID = PublicKey (union: 4-byte type + 32-byte key)
  grab_u32  # PublicKey type discriminant (0=ED25519)
  grab_hash; NODE_ID_STR=$RESULT
  # signature = Signature (opaque<64>: 4-byte len + data)
  grab_u32; SIG_LEN=$RESULT
  SIG_PADDED=$(( (SIG_LEN+3)/4*4 ))
  P=$((P+SIG_PADDED))
fi

# --- Post SCP Value fields ---
grab_hash; TX_RESULT_HASH=$RESULT
grab_hash; BUCKET_LIST_HASH=$RESULT
grab_u32;  LEDGER_SEQ=$RESULT
grab_u64;  TOTAL_COINS=$RESULT
grab_u64;  FEE_POOL=$RESULT
grab_u32;  INFLATION_SEQ=$RESULT
grab_u64;  ID_POOL=$RESULT
grab_u32;  BASE_FEE=$RESULT
grab_u32;  BASE_RESERVE=$RESULT
grab_u32;  MAX_TX_SET=$RESULT

# --- Skip list (4 x Hash) ---
grab_hash; SKIP0=$RESULT
grab_hash; SKIP1=$RESULT
grab_hash; SKIP2=$RESULT
grab_hash; SKIP3=$RESULT

# --- Output ---
TC_XLM=$(echo "scale=7; $TOTAL_COINS / 10000000" | bc 2>/dev/null)
FP_XLM=$(echo "scale=7; $FEE_POOL / 10000000" | bc 2>/dev/null)
CLOSE_DATE=$(date -d @$CLOSE_TIME 2>/dev/null || echo "N/A")

echo ""
echo "--- Identification ---"
echo "Protocol Version:     $VERSION"
echo "Ledger Sequence:      $LEDGER_SEQ"
echo "Close Time:           $CLOSE_TIME ($CLOSE_DATE)"

echo ""
echo "--- Chain ---"
echo "Previous Ledger Hash: $PREV_HASH"

echo ""
echo "--- SCP Value ---"
echo "tx_set_hash:          $TX_SET_HASH"
[ -n "$NODE_ID_STR" ] && echo "Signed by node:       $NODE_ID_STR"

echo ""
echo "--- State Hashes ---"
echo "TX Set Result Hash:   $TX_RESULT_HASH"
echo "Bucket List Hash:     $BUCKET_LIST_HASH"

echo ""
echo "--- Economics ---"
echo "Total Coins:          $TC_XLM XLM"
echo "Fee Pool:             $FP_XLM XLM"
echo "Base Fee:             $BASE_FEE stroops"
echo "Base Reserve:         $BASE_RESERVE stroops"
echo "Max TX Set Size:      $MAX_TX_SET"

echo ""
echo "--- Skip List ---"
echo "  [0]: $SKIP0"
echo "  [1]: $SKIP1"
echo "  [2]: $SKIP2"
echo "  [3]: $SKIP3"

echo ""
echo "============================================================"
echo "  ZK PROOF ANCHORS"
echo "============================================================"
echo "  tx_set_hash:       $TX_SET_HASH"
echo "  bucket_list_hash:  $BUCKET_LIST_HASH"
echo "  prev_ledger_hash:  $PREV_HASH"
echo "  ledger_sequence:   $LEDGER_SEQ"
echo "============================================================"
echo "  Bytes parsed: $P / $TOTAL_BYTES"
