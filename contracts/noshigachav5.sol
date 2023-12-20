// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Lottery {
    address public Owner;
    address public manager;
    address payable[] public participants; //index start 0
    uint public winnings;
    address payable public winner;
    uint public lotteryId;
    mapping(uint => address payable) public lotteryHistory;
    mapping(uint => address payable[]) public participantsHistory;

    constructor() {
        Owner = address(msg.sender);
        manager = address(0);
        //  owner = msg.sender;
        // admin = address(0); // Initialize admin address as empty
    }

    modifier onlyOwner() {
        require(msg.sender == Owner, "Only owner can access this function");
        _;
    }

    modifier onlymanager() {
        require(msg.sender == manager, "Only manager can access this function");
        _;
    }

    modifier onlyOwnerOrmanager() {
        require(
            msg.sender == Owner || msg.sender == manager,
            "Only owner or manager can access this function"
        );
        _;
    }

    function setmanager(address _manager) external onlyOwner {
        manager = _manager;
    }
}

//enter and pay
function enter() public payable {
    payable(manager).transfer(0.01 ether);
    participants.push(payable(msg.sender));
}

//pick winner and pay and owner keep 0.01 for gasfees
//owner
// function pickWinner() public payable OnlyOwnerormanager {
//    winningnum = block.timestamp % participants.length;
//    winner = payable(participants[winningnum]);
//    payable(winner).transfer((participants.length - 1) * 0.01 ether);
//    participants = new address payable[](0);
// }

// function enter() public payable {
//        require(msg.value > 0.01 ether, "Minimum entry fee is 0.01 ether");
//        players.push(msg.sender);
//   }

function random() private view returns (uint) {
    return
        uint(
            keccak256(
                abi.encodePacked(block.difficulty, block.timestamp, players)
            )
        );
}

function pickWinner() public payable OnlyOwnerormanager {
    require(participants.length > 0, "No participants in the lottery");
    uint index = random() % participants.length;
    address payable winner = participants[index];
    address payable winnerAddress = payable(winner);
    winnerAddress.transfer((address(this).balance * 75) / 100);
    payable(manager).transfer(address(this).balance);
    uint winnings = ((address(this).balance * 75) / 100);
    lotteryHistory[lotteryId] = participants[index];
    lotteryId++;

    // Store participants for the current lottery
    participantsHistory[lotteryId] = participants;

    participants = new address[](0); // Reset the players array for the next round
}

function getWinnerInfo() public view returns (address, uint) {
    return (winner, winnings);
}

//  function getPlayers() public view returns (address[] memory) {
//     return players;
//   }
// }

//getParticipants
function getParticipants() public view returns (address payable[] memory) {
    return participants;
}

/*set new manager
function setManager(address payable _manager) public payable OnlyOwner {
    manager = payable(_manager);
    payable(manager).transfer((participants.length - 1) * 0.01 ether);
}
*/
