const contractAddress = 'CONTRACT_ADDRESS'; // Replace with your deployed contract address
const abi = ABI_ARRAY; // Replace with your contract ABI array

const web3 = new Web3(window.ethereum);

const contract = new web3.eth.Contract(abi, contractAddress);

async function playMove(move) {
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    const account = accounts[0];

    try {
        const gas = await contract.methods.play(move).estimateGas({ from: account, value: web3.utils.toWei('0.0001', 'ether') });
        const result = await contract.methods.play(move).send({ from: account, value: web3.utils.toWei('0.0001', 'ether'), gas });
        displayResult(result.events.GameResult.returnValues);
        displayHistory(account);
    } catch (error) {
        console.error(error);
        alert('Error occurred during the transaction. Please check the console for details.');
    }
}

function displayResult(result) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `Player's move: ${result.playerMove}, Opponent's move: ${result.opponentMove}, 
                           ${result.playerWon ? 'You won!' : 'You lost!'}. Reward: ${web3.utils.fromWei(result.reward, 'ether')} ether`;
}

async function displayHistory(account) {
    const historyList = document.getElementById('history');
    historyList.innerHTML = '';

    const gameCount = await contract.methods.getGameCount(account).call();
    for (let i = 0; i < gameCount; i++) {
        const game = await contract.methods.gameHistory(account, i).call();
        const listItem = document.createElement('li');
        listItem.textContent = `Move: ${game.playerMove}, Opponent's move: ${game.opponentMove}, 
                               ${game.playerWon ? 'You won!' : 'You lost!'}. Bet: ${web3.utils.fromWei(game.betAmount, 'ether')} ether`;
        historyList.appendChild(listItem);
    }
}

window.ethereum.on('accountsChanged', function (accounts) {
    location.reload();
});

window.ethereum.on('chainChanged', function (networkId) {
    location.reload();
});
