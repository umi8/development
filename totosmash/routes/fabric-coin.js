'use strict';
/*
 * Hyperledger Fabric Interface Program for coin
 */

var hfc = require('fabric-client');
var path = require('path');
var util = require('util');

var options = {
    wallet_path: path.join(__dirname, './creds'),
    user_id: 'PeerAdmin',
    channel_id: 'mychannel',
    chaincode_id: 'coin',
    peer_url: 'grpc://localhost:7051',
    event_url: 'grpc://localhost:7053',
    orderer_url: 'grpc://localhost:7050'
};

var channel = {};
var client = null;
var targets = [];
var tx_id = null;

/*
 * Query
 */
exports.query = function() {
  if (arguments.length < 1) {
    var msg = "Parameter error.";
    console.error(msg);
    throw new Error(msg);
  }
  var func = arguments[0];
  var paras = [];
  if (arguments.length > 1) {
    for (var i=1; i < arguments.length; i++) {
      paras.push(arguments[i]);
    }
  }
  console.log("function = ", func);
  console.log("args = ", paras);

  var promise =
    Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
    }).then((wallet) => {
      console.log("Set wallet path, and associate user ", options.user_id, " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
    }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
        var msg = "User not defined, or not enrolled - error";
        console.error(msg);
        throw msg;
      }
      channel = client.newChannel(options.channel_id);
      channel.addPeer(client.newPeer(options.peer_url));
      return;
    }).then(() => {
      console.log("Make query");
      var transaction_id = client.newTransactionID();
      console.log("Assigning transaction_id: ", transaction_id._transaction_id);
      const request = {
        chaincodeId: options.chaincode_id,
        txId: transaction_id,
        fcn: func,
        args: paras
      };

      return channel.queryByChaincode(request);
    }).then((query_responses) => {
      console.log("returned from query");
      if (!query_responses.length) {
        var msg = "No payloads were returned from query";
        console.log(msg);
        throw msg;
      } else {
        console.log("Query result count = ", query_responses.length)
      }
      if (query_responses[0] instanceof Error) {
        var response = query_responses[0].toString();
        var msg = "error from query = " + response;
        console.error(msg);
        throw response;
      }
      var response = query_responses[0].toString();
      console.log("Response is ", response);
      return response;
    }).catch((err) => {
      console.error("Caught Error = ", err);
      throw err;
    });

  return promise;
}

/*
 * Invoke
 */
exports.invoke = function() {
  if (arguments.length < 1) {
    var msg = "Parameter error.";
    console.error(msg);
    throw new Error(msg);
  }
  var func = arguments[0];
  var paras = [];
  if (arguments.length > 1) {
    for (var i=1; i < arguments.length; i++) {
      paras.push(arguments[i]);
    }
  }
  console.log("function = ", func);
  console.log("args = ", paras);

  var promise =
    Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
    }).then((wallet) => {
      console.log("Set wallet path, and associate user ", options.user_id, " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
    }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
        var msg = "User not defined, or not enrolled - error";
        console.error(msg);
        throw msg;
      }
      channel = client.newChannel(options.channel_id);
      var peerObj = client.newPeer(options.peer_url);
      channel.addPeer(peerObj);
      channel.addOrderer(client.newOrderer(options.orderer_url));
      targets.push(peerObj);
      return;
    }).then(() => {
      tx_id = client.newTransactionID();
      console.log("Assigning transaction_id: ", tx_id._transaction_id);
      // send proposal to endorser
      var request = {
        targets: targets,
        chaincodeId: options.chaincode_id,
        fcn: func,
        args: paras,
        chainId: options.channel_id,
        txId: tx_id
      };
      return channel.sendTransactionProposal(request);
    }).then((results) => {
      var proposalResponses = results[0];
      var proposal = results[1];
      var header = results[2];
      let isProposalGood = false;
      if (proposalResponses && proposalResponses[0].response &&
        proposalResponses[0].response.status === 200) {
        isProposalGood = true;
        console.log('transaction proposal was good');
      } else {
        console.error('transaction proposal was bad');
      }
      if (isProposalGood) {
        console.log(util.format(
            'Successfully sent Proposal and received ProposalResponse: Status - %s, message - "%s", metadata - "%s", endorsement signature: %s',
            proposalResponses[0].response.status, proposalResponses[0].response.message,
            proposalResponses[0].response.payload, proposalResponses[0].endorsement.signature));
        var request = {
            proposalResponses: proposalResponses,
            proposal: proposal,
            header: header
        };
        // set the transaction listener and set a timeout of 30sec
        // if the transaction did not get committed within the timeout period,
        // fail the test
        var transactionID = tx_id.getTransactionID();
        var eventPromises = [];
        let eh = client.newEventHub();
        eh.setPeerAddr(options.event_url);
        eh.connect();

        let txPromise = new Promise((resolve, reject) => {
            let handle = setTimeout(() => {
                eh.disconnect();
                reject();
            }, 30000);

            eh.registerTxEvent(transactionID, (tx, code) => {
                clearTimeout(handle);
                eh.unregisterTxEvent(transactionID);
                eh.disconnect();

                if (code !== 'VALID') {
                    console.error(
                        'The transaction was invalid, code = ' + code);
                    reject();
                } else {
                    console.log(
                        'The transaction has been committed on peer ' +
                        eh._ep._endpoint.addr);
                    resolve();
                }
            });
        });
        eventPromises.push(txPromise);
        var sendPromise = channel.sendTransaction(request);
        return Promise.all([sendPromise].concat(eventPromises)).then((results) => {
            console.log(' event promise all complete and testing complete');
            return results[0]; // the first returned value is from the 'sendPromise' which is from the 'sendTransaction()' call
        }).catch((err) => {
            var msg = 'Failed to send transaction and get notifications within the timeout period.';
            console.error(msg);
            return msg;
        });
      } else {
        var msg = 'Failed to send Proposal or receive valid response. Response null or status is not 200. exiting...';
        console.error(msg);
        return msg;
      } // isProposalGood
    }, (err) => {
      var msg = 'Failed to send proposal due to error: ' + err.stack ? err.stack : err;
      console.error(msg);
      return msg;
    }).then((response) => {
      if (response.status === 'SUCCESS') {
        console.log('Successfully sent transaction to the orderer.');
        return tx_id.getTransactionID();
      } else {
        var msg = 'Failed to order the transaction. Error code: ' + response.status;
        console.error(msg);
        throw msg;
      }
    }, (err) => {
      var msg = 'Failed to send transaction due to error: ' + err.stack ? err.stack : err;
      console.error(msg);
      throw msg;
    }).catch((err) => {
      console.error("Caught Error = ", err);
      throw err;
    });

  return promise;
}

/*
 * Query BlockChain Information
 */
exports.queryBlock = function() {
  if (arguments.length < 2) {
    var msg = "Parameter error.";
    console.error(msg);
    throw new Error(msg);
  }
  var func = arguments[0];
  var id = null;
  if (func === 'queryTransaction') {
    id = arguments[1];
  } else if (func === 'queryBlock') {
    id = Number(arguments[1]);
  } else {
    var msg = "Parameter error.";
    console.error(msg);
    throw new Error(msg);
  }
  console.log("function = ", func);
  console.log("id = ", id);

  var promise =
    Promise.resolve().then(() => {
      console.log("Create a client and set the wallet location");
      client = new hfc();
      return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
    }).then((wallet) => {
      console.log("Set wallet path, and associate user ", options.user_id, " with application");
      client.setStateStore(wallet);
      return client.getUserContext(options.user_id, true);
    }).then((user) => {
      console.log("Check user is enrolled, and set a query URL in the network");
      if (user === undefined || user.isEnrolled() === false) {
        var msg = "User not defined, or not enrolled - error";
        console.error(msg);
        throw msg;
      }
      channel = client.newChannel(options.channel_id);
      var peerObj = client.newPeer(options.peer_url);
      //channel.addPeer(peerObj);
      //channel.addOrderer(client.newOrderer(options.orderer_url));
      if (func === 'queryTransaction') {
        return channel.queryTransaction(id, peerObj);
      } else if (func === 'queryBlock') {
        return channel.queryBlock(id, peerObj);
      } else {
        var msg = "Parameter error.";
        console.error(msg);
        throw new Error(msg);
      }
    }).catch((err) => {
      console.error("Caught Error = ", err);
      throw err;
    });

  return promise;
}

