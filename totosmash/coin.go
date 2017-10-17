package main

/* Imports
 * 4 utility libraries for formatting, handling bytes, reading and writing JSON, and string manipulation
 * 2 specific Hyperledger Fabric specific libraries for Smart Contracts
 */
import (
	"bytes"
	"fmt"
	"strconv"

	"github.com/hyperledger/fabric/core/chaincode/shim"
	sc "github.com/hyperledger/fabric/protos/peer"
)

// Define the Smart Contract structure
type SmartContract struct {
}

/*
 * The Init method is called when the Smart Contract "fabcar" is instantiated by the blockchain network
 * Best practice is to have any Ledger initialization in separate function -- see initLedger()
 */
func (s *SmartContract) Init(APIstub shim.ChaincodeStubInterface) sc.Response {
	return shim.Success(nil)
}

/*
 * The Invoke method is called as a result of an application request to run the Smart Contract "fabcar"
 * The calling application program has also specified the particular smart contract function to be called, with arguments
 */
func (s *SmartContract) Invoke(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Retrieve the requested Smart Contract function and arguments
	function, args := APIstub.GetFunctionAndParameters()
	// Route to the appropriate handler function to interact with the ledger appropriately
	if function == "queryValue" {
		return s.queryValue(APIstub, args)
	} else if function == "queryAll" {
		return s.queryAll(APIstub)
	} else if function == "invoke" {
		return s.invoke(APIstub, args)
	} else if function == "settle" {
		return s.settle(APIstub)
	} else if function == "settle1" {
		return s.settle1(APIstub)
	} else if function == "settle2" {
		return s.settle2(APIstub)
	} else if function == "createUser" {
		return s.createUser(APIstub, args)
	} else if function == "reset" {
		return s.reset(APIstub)
	} else if function == "initBet" {
		return s.initBet(APIstub)
	} else if function == "initLedger" {
		return s.initLedger(APIstub)
	}

	return shim.Error("Invalid Smart Contract function name.")
}

func (s *SmartContract) queryValue(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	if len(args) != 1 {
		return shim.Error("Incorrect number of arguments. Expecting 1")
	}

	valAsBytes, _ := APIstub.GetState(args[0])
	return shim.Success(valAsBytes)
}

func (s *SmartContract) queryAll(APIstub shim.ChaincodeStubInterface) sc.Response {
	startKey := ""
	endKey := "~"

	resultsIterator, err := APIstub.GetStateByRange(startKey, endKey)
	if err != nil {
		return shim.Error(err.Error())
	}
	defer resultsIterator.Close()

	// buffer is a JSON array containing QueryResults
	var buffer bytes.Buffer
	buffer.WriteString("[")

	bArrayMemberAlreadyWritten := false
	for resultsIterator.HasNext() {
		queryResponse, err := resultsIterator.Next()
		if err != nil {
			return shim.Error(err.Error())
		}
		// Add a comma before array members, suppress it for the first array member
		if bArrayMemberAlreadyWritten == true {
			buffer.WriteString(",")
		}
		buffer.WriteString("{\"Key\":")
		buffer.WriteString("\"")
		buffer.WriteString(queryResponse.Key)
		buffer.WriteString("\"")

		buffer.WriteString(", \"Record\":")
		// Record is a JSON object, so we write as-is
		buffer.WriteString(string(queryResponse.Value))
		buffer.WriteString("}")
		bArrayMemberAlreadyWritten = true
	}
	buffer.WriteString("]")

	fmt.Printf("- queryAll:\n%s\n", buffer.String())

	return shim.Success(buffer.Bytes())
}

func (s *SmartContract) initLedger(APIstub shim.ChaincodeStubInterface) sc.Response {
	var alice = "Alice"
	var bob = "Bob"
	var aliceVal = 200
	var bobVal = 100
	var userA = "Beppu"
	var userAVal = 300

	APIstub.PutState(alice, []byte(strconv.Itoa(aliceVal)))
	APIstub.PutState(bob, []byte(strconv.Itoa(bobVal)))
	APIstub.PutState(userA, []byte(strconv.Itoa(userAVal)))

	// Player
	var player1 = "Nadal"
	var player1Val = 0
	APIstub.PutState(player1, []byte(strconv.Itoa(player1Val)))
	var player2 = "Nishikori"
	var player2Val = 0
	APIstub.PutState(player2, []byte(strconv.Itoa(player2Val)))
	
	// Game 
	var bookmaker = "Game20171117a" // 胴元
	var bookmakerVal = 0
	APIstub.PutState(bookmaker, []byte(strconv.Itoa(bookmakerVal)))

	// Bet
	//s.invoke(APIstub, []string{alice, player2, "100"}) // Nishikori
	//s.invoke(APIstub, []string{bob, player1, "100"})

	return shim.Success(nil)
}

func (s *SmartContract) initBet(APIstub shim.ChaincodeStubInterface) sc.Response {

	// Bet
	s.invoke(APIstub, []string{"Alice", "Nishikori", "100"}) // Nishikori
	s.invoke(APIstub, []string{"Bob"  , "Nadal"    , "100"})

	return shim.Success(nil)
}


func (s *SmartContract) settle(APIstub shim.ChaincodeStubInterface) sc.Response {
        APIstub.PutState("Alice"        , []byte("250"))
        APIstub.PutState("Bob"          , []byte("0"))
        APIstub.PutState("Beppu"        , []byte("350"))
        APIstub.PutState("Nadal"        , []byte("0"))
        APIstub.PutState("Nishikori"    , []byte("0"))
        APIstub.PutState("Game20171117a", []byte("0"))
	return shim.Success(nil)
}


func (s *SmartContract) settle1(APIstub shim.ChaincodeStubInterface) sc.Response {
	var player1, player2 string    // Entities
	var player1Val, player2Val int // Asset holdings

	player1 = "Nadal"
	player1Valbytes, err := APIstub.GetState(player1)
	if err != nil {
		return shim.Error("Failed to get from Entity state")
	}
	if player1Valbytes == nil {
		return shim.Error("From Entity not found")
	}
	player1Val, _ = strconv.Atoi(string(player1Valbytes))
	
	player2 = "Nishikori"
	player2Valbytes, err := APIstub.GetState(player2)
	if err != nil {
		return shim.Error("Failed to get from Entity state")
	}
	if player2Valbytes == nil {
		return shim.Error("From Entity not found")
	}
	player2Val, _ = strconv.Atoi(string(player2Valbytes))
	
	fmt.Printf("%s : %d\n", player1, player1Val)
	fmt.Printf("%s : %d\n", player2, player2Val)

	var bookmaker = "Game20171117a"
	s.invoke(APIstub, []string{player1, bookmaker, strconv.Itoa(player1Val)})
	s.invoke(APIstub, []string{player2, bookmaker, strconv.Itoa(player2Val)})


	
	return shim.Success(nil)
}

func (s *SmartContract) settle2(APIstub shim.ChaincodeStubInterface) sc.Response {
	var bookmaker string // Entities
	var bookmakerVal int // Asset holdings

	bookmaker = "Game20171117a"
	bookmakerValbytes, err := APIstub.GetState(bookmaker)
	if err != nil {
		return shim.Error("Failed to get from Entity state")
	}
	if bookmakerValbytes == nil {
		return shim.Error("From Entity not found")
	}
	bookmakerVal, _ = strconv.Atoi(string(bookmakerValbytes))
	
	fmt.Printf("%s : %d\n", bookmaker, bookmakerVal)

	var settleVal = bookmakerVal / 2
	s.invoke(APIstub, []string{bookmaker, "Alice", strconv.Itoa(settleVal)})
	s.invoke(APIstub, []string{bookmaker, "Beppu", strconv.Itoa(settleVal)})

	return shim.Success(nil)
}

func (s *SmartContract) invoke(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {
	var sender, receiver string    // Entities
	var senderVal, receiverVal int // Asset holdings
	var txValue int                // Transaction value

	if len(args) != 3 {
		return shim.Error("Incorrect number of arguments. Expecting 3")
	}

	sender = args[0]
	receiver = args[1]

	senderValbytes, err := APIstub.GetState(sender)
	if err != nil {
		return shim.Error("Failed to get from Entity state")
	}
	if senderValbytes == nil {
		return shim.Error("From Entity not found")
	}
	senderVal, _ = strconv.Atoi(string(senderValbytes))

	receiverValbytes, err := APIstub.GetState(receiver)
	if err != nil {
		return shim.Error("Failed to get to Entity state")
	}
	if receiverValbytes == nil {
		return shim.Error("To Entity not found")
	}
	receiverVal, _ = strconv.Atoi(string(receiverValbytes))

	// Perform the execution
	txValue, err = strconv.Atoi(args[2])
	if err != nil {
		return shim.Error("Invalid transaction amount, expecting a integer value")
	}
	senderVal = senderVal - txValue
	if senderVal < 0 {
		return shim.Error("Invalid transaction amount,sender's value is short")
	}
	receiverVal = receiverVal + txValue

	fmt.Printf("%s から %s へ %d ポイント 送金します。\n", sender, receiver, txValue)
	fmt.Printf("%s = %d, %s = %d\n", sender, senderVal, receiver, receiverVal)

	// Write the state back to the ledger
	err = APIstub.PutState(sender, []byte(strconv.Itoa(senderVal)))
	if err != nil {
		return shim.Error(err.Error())
	}

	err = APIstub.PutState(receiver, []byte(strconv.Itoa(receiverVal)))
	if err != nil {
		return shim.Error(err.Error())
	}

	return shim.Success(nil)
}

func (s *SmartContract) createUser(APIstub shim.ChaincodeStubInterface, args []string) sc.Response {

	var newUser string // Entity
	var initialValue string
	//      var initialValue = 100
	newUser = args[0]
	initialValue = args[1]

	// APIstub.PutState(newUser, []byte(strconv.Itoa(initialValue)))
	APIstub.PutState(newUser, []byte(initialValue))

	return shim.Success(nil)
}

func (s *SmartContract) reset(APIstub shim.ChaincodeStubInterface) sc.Response {

	APIstub.PutState("Alice"        , []byte("100"))
	APIstub.PutState("Bob"          , []byte("0"))
	APIstub.PutState("Beppu"        , []byte("300"))
	APIstub.PutState("Nadal"        , []byte("100"))
	APIstub.PutState("Nishikori"    , []byte("100"))
	APIstub.PutState("Game20171117a", []byte("0"))
	return shim.Success(nil)

}


// The main function is only relevant in unit test mode. Only included here for completeness.
func main() {

	// Create a new Smart Contract
	err := shim.Start(new(SmartContract))
	if err != nil {
		fmt.Printf("Error creating new Smart Contract: %s", err)
	}
}
