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

※チェーンコードを更新する場合は 2)は実行せず、3)を実行する

 3) チェーンコードを更新する
　引数にはチェーンコードのバージョン番号を指定してください
　更新するたびにバージョン番号を変える必要があるようです
cd development/totosmash
./updateCoin.sh 1.2.0


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
http://localhost:3000/TS/query/Beppu

invokeを実行
http://localhost:3000/test-cc/send/10



