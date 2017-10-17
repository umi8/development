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
 Alice から Bob に 10 送金する。

http://localhost:3000/test-cc/bet/Nishikori
 Beppu が Nishikori に 10 べットする。

http://localhost:3000/test-cc/settle1
 Nadal と Nishikori の全額を Bookmaker に送金する。

http://localhost:3000/test-cc/settle2
 Boookmaker の全額を２等分して Alice と Beppu に送金する。

http://localhost:3000/test-cc/settle
 試合結果を確定し、AliceとBeppuにBookmakerから送金する 
 settle1,settle2の処理を一括で行なう（ハードコード）

http://localhost:3000/test-cc/reset
 初期状態に戻すメソッド（ポイント無くなったら呼び出せばOK）

