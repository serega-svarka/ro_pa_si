pragma solidity ^0.8.0;

contract RockPaperScissors {
    enum Move { None, Rock, Paper, Scissors }
    
    struct Game {
        address player;
        Move playerMove;
        Move opponentMove;
        uint256 betAmount;
        bool isGameFinished;
        bool playerWon;
    }
    
    mapping(address => uint256) public balances;
    mapping(address => Game[]) public gameHistory;
    
    event GameResult(address indexed player, Move playerMove, Move opponentMove, bool playerWon, uint256 reward);

    function play(Move _playerMove) external payable {
        require(msg.value >= 0.0001 ether, "Insufficient bet amount");
        require(_playerMove >= Move.Rock && _playerMove <= Move.Scissors, "Invalid move");
        
        Move opponentMove = Move(random() % 3 + 1); // 1: Rock, 2: Paper, 3: Scissors
        
        bool playerWon = (_playerMove == Move.Rock && opponentMove == Move.Scissors) ||
                         (_playerMove == Move.Paper && opponentMove == Move.Rock) ||
                         (_playerMove == Move.Scissors && opponentMove == Move.Paper);
        
        uint256 reward = 0;
        if (playerWon) {
            reward = msg.value * 2;
            balances[msg.sender] += reward;
        }
        
        gameHistory[msg.sender].push(Game(msg.sender, _playerMove, opponentMove, msg.value, true, playerWon));
        emit GameResult(msg.sender, _playerMove, opponentMove, playerWon, reward);
    }
    
    function getGameCount(address _player) external view returns (uint256) {
        return gameHistory[_player].length;
    }

    function random() private view returns (uint256) {
        return uint256(keccak256(abi.encodePacked(block.difficulty, block.timestamp, block.number)));
    }
}
