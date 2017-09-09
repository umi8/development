'use strict';

var hfc = require('fabric-client');
var path = require('path');

var options = {
    wallet_path: path.join(__dirname, './creds'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'coin',
    network_url: 'grpc://localhost:7051',
};

var channel = {};
var client = null;

Promise.resolve().then(() => {
    client = new hfc();
    return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
}).then((wallet) => {
    client.setStateStore(wallet);
    return client.getUserContext(options.user_id, true);
}).then((user) => {
    if (user === undefined || user.isEnrolled() === false) {
        console.error("User not defined, or not enrolled - error");
    }
    channel = client.newChannel(options.channel_id);
    channel.addPeer(client.newPeer(options.network_url));
    return;
}).then(() => {
    var transaction_id = client.newTransactionID();

    const request = {
        chaincodeId: options.chaincode_id,
        txId: transaction_id,
        fcn: 'queryAll',
        args: ['']
    };
    return channel.queryByChaincode(request);
}).then((query_responses) => {
    if (!query_responses.length) {
        console.log("No payloads were returned from query");
    } else {
        console.log("Query result count = ", query_responses.length)
    }
    if (query_responses[0] instanceof Error) {
        console.error("error from query = ", query_responses[0]);
    }
    console.log(query_responses);
}).catch((err) => {
    console.error("Caught Error", err);
});
