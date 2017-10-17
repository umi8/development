#!/bin/bash
#
set -e
if [ $# -ne 1 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "chaincodeのバージョンを指定してください ex: ./updateCoin.sh 1.2.0" 1>&2
  exit 1
fi

export VERSION=$1

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode install -n coin -v $VERSION -p github.com/coin

docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode upgrade -o orderer.example.com:7050 -C mychannel -n coin -v $VERSION -c '{"Args":[""]}' -P "OR ('Org1MSP.member','Org2MSP.member')"

sleep 10
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n coin -v $VERSION -c '{"function":"initLedger","Args":[""]}'
sleep 5 
docker exec -e "CORE_PEER_LOCALMSPID=Org1MSP" -e "CORE_PEER_MSPCONFIGPATH=/opt/gopath/src/github.com/hyperledger/fabric/peer/crypto/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp" cli peer chaincode invoke -o orderer.example.com:7050 -C mychannel -n coin -v $VERSION -c '{"function":"initBet","Args":[""]}'
