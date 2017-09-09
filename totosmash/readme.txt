(1) fabcar を起動する。
cd fabric-samples/fabcar
./startFabric.sh

(2) git clone する 。
git clone https://github.com/totosmash/development.git

(3) チェーンコード(coin.go)を登録する。
 1) coin.goを置く
mkdir ~/fabric-samples/chaincode/coin
cd development/totosmash
cp coin.go ~/fabric-samples/chaincode/coin

 2) チェーンコードをインストール
cd development/totosmash
./installCoin.sh

(4) アプリを起動する。
cd development/totosmash
npm install
npm start

(5) ブラウザからチェーンコードをテストする。
queryAllを実行
http://localhost:3000/test-cc/query

queryValueを実行
http://localhost:3000/test-cc/query/Alice
http://localhost:3000/test-cc/query/Bob

invokeを実行
http://localhost:3000/test-cc/send/10

