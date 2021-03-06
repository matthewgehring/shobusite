// # README
// #  Board coordinates respond to list index follows:
// #   0  1  2  3      16 17 18 19
// #   4  5  6  7      20 21 22 23
// #   8  9  10 11     24 25 26 27
// #   12 13 14 15     28 29 30 31
// #
// #   32 33 34 35     48 49 50 51
// #   36 37 38 39     52 53 54 55
// #   40 41 42 43     56 57 58 59
// #   44 45 46 47     60 61 62 63
// #
// #   Thus, the movement vector for moving vertically up 1 space would be -4, for moving to the right +1, to the left -1, etc.
// #   input1 is the initial passive stone coordinate, input2 is the passive stones desired location, and input3 is the aggressive stone coordinate.
// #   'b' is a black stone, 'w' is a white stone, 'x' is an empty space. x is a placeholder, it looks really ugly as a space

class Rules {
    constructor(board) {
        this.board = board;
        this.two_space_moves=[10,-10,8,-8,6,-6,2,-2];
        this.one_space_moves=[5,-5,4,-4,3,-3,1,-1];
    }

    initialize_homeboard(color){
    if (color == "b"){
        var homeboard = [0, 1];
        }
    if (color == "w"){
        var homeboard = [2, 3];
        }
    return homeboard;
    }

    check_if_valid(input1, input2, color){
        var invertboard = [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15];
        var invertmoves = {'1': 4, '-1': -4, '5': 5, '-5': -5, '4': 1, '-4': -1, '-3': 3, '3': -3, '2': 8, '-2': -8, '10': 10, '-10': -10, '8': 2, '-8': -2, '-6': 6, '6': -6};            
        //# dictionary mapping coordinates to an inverted matrix to detect move legality
        var valid_moves = [1, -1, 5, -5, 4, -4, 3, -3, 2, -2, 10, -10, 8, -8, 6, -6, 4, -4];     //#all valid movement vectors

        if (this.board[input1] != color){      //#must select your own color stone
            return false;
        }
        if (~~(input1/16) != ~~(input2/16)){        //# division to see if both inputs are in 4x4 grids
            console.log('input1 and input2 not on same subboard');
            return false;
        }

        var input1 = input1 % 16;
        var input2 = input2 % 16;
        var move = input2 % 16 - input1 % 16;
        if (!(valid_moves.includes(move))){     //#detects if illegal move like a knights move, or something
            console.log('just illegal')
            return false;
        }
        if ((move > 0) && ((input1 + move) % 16 < input1)){  //#if in valid moves, checks if goes off the board for top and bottom edges
            console.log('top')
            return false;
        }
        if (((invertboard[input1 % 16] + invertmoves[move]) % 16) < invertboard[input2 % 16]){   //#checks if goes off the board for left and right edges
            console.log('left') 
            return false;
        }
        if ((move < 0) && (input1 + move) % 16 > input1){
            console.log('bottom')
            return false;
        }
        if (((invertboard[input1 % 16]+ invertmoves[move]) % 16) > invertboard[input2 % 16]){
            console.log('check 5')
            return false;
        }
        else{
            return true;
        }
     }
     
    check_if_pushes(input1,input2,color){          //#checks if a stone is being pushed, returns the location of the stone being pushed
        var move = input2 - input1
        var opponent = (color == "w" ? "b" : "w")
        if (this.two_space_moves.includes(move)){
            if ((this.board[parseInt(input1+move/2)] != 'x') && (this.board[input2]=='x')){
                return input1+move/2;    //#if stone moves past another stone, returns location of the stone being jumped over
            }     
            if ((this.board[parseInt(input1 + move/2)] == 'x') && (this.board[input2] != 'x')){
                return input2;           //# if stone moves onto other stone, returns location of stone being moved onto
            }
            if ((this.board[parseInt(input1+(move/2))] != 'x') && (this.board[input2]!='x')){
                return false;          //# if move both jumps over a stone and lands on a stone, returns false
            }
            if ((this.board[input2] !='x') && (!(this.check_if_valid(input2,(parseInt(input2+(move/2))),opponent)))){ //#checks if pushed stone falls off board
                return input2;
            }
        }
        if (this.one_space_moves.includes(move)){
            if ((this.board[input2] !='x') && (this.board[input2 + move] == 'x')){ //#checks if one space move lands on enemy stone
                return input2;
            }
            if ((this.board[input2] != 'x') && (this.check_if_valid(input2,parseInt(input2+move),opponent))){ //#checks if pushes two stones in a row
                return false
            }
            if ((this.board[input2] !='x') && (!(this.check_if_valid(input2,parseInt(input2+move),opponent)))){ //#checks if pushed stone falls off board
                return input2;
            }
        }
        return 'x'      //#shows nothing has been pushed
    }

    passive_move(input1,input2,color){
        var subboard=this.initialize_homeboard(color);
        if ((this.board[input1] != color) || (this.board[input2] != 'x')){  //#checks if you select your own color or if you push another stone
            return false;
        }
        if (!(subboard.includes(~~(input1/16)))){                    //#checks if passive move not on passive board
            console.log('move not on ' + color + ' homeboard');
            return false;
        }
        if (!(this.check_if_valid(input1,input2,color))){    //#checks if movement is valid
            console.log('Error: Movement not orthogonally or diagonally adjacent with a scale up to two.');
            return false;
        }
        if (this.check_if_pushes(input1,input2,color)!='x'){  //#checks if a stone is being pushed
            console.log('cannot push a stone on your passive move');
            return false;
        }
        return true;
    }

    aggressive_move(input3,move,color,passive_board){
        var opponent = (color == "w" ? "b" : "w")
        var pushed_stone = this.check_if_pushes(input3, input3 + move, color);  //#returns the coordinate of the pushed stone, or 'x' if nothing pushed
        if (this.board[input3] != color){
            console.log('must select your own stone');
            return false;
        }
        if ((passive_board % 2) == ((~~(input3/16)) % 2)){     //#checks if aggressive move on same parity board of passive move
            console.log('move not on opposite colored board');
            return false;
        }
        if (!(this.check_if_valid((input3), (input3 + move), color))){ //#checks if aggressive move pushes off board
            console.log('Error: aggressive move out of bounds');
            return false;
        }
        if (this.board[input3+move] == color){
            console.log('you cannot push your own stone');
            return false;
        }
        if (pushed_stone === false){       //#check_if_pushes returns false if two stones are pushed
            console.log('cant push 2 stones');
            return false;
        }
        if (pushed_stone != 'x'){         //#if a stone is being pushed, checks if the stone is your own color
            var pushed_stone = parseInt(pushed_stone);
            if (this.board[pushed_stone]==color){
                console.log('cant push your own stone');
                return false;
            }
            console.log(this.check_if_pushes(pushed_stone,pushed_stone+move,opponent))
            if ((this.check_if_pushes(pushed_stone,pushed_stone+move,opponent) != 'x') && (this.check_if_valid(pushed_stone,parseInt(pushed_stone+move),opponent))){ //the pushed stone can't push another stone
                return false;
            }
        }
        return true;
    }
    
    passive_aggressive(input1, input2, input3, color){
        var move = input2 - input1;
        var passive_board = ~~(input1/16);
        if (!(this.passive_move(input1, input2, color))){
            console.log('passive move false');
            return false;
        }
        if (!(this.aggressive_move(input3,move,color,passive_board))){
            console.log('aggressive move false');
            return false;
        }
        return true;
    }

    updateBoard(input1,input2,input3,color,input_board){
        if (color == 'w'){
        var opponent = 'b';
         }
        else{
        var opponent = 'w';
        }
        var updated_board = input_board.slice(0);
        var move = (input2 % 16 - input1 % 16);
        var halfmove = move;
        
        if (!(this.passive_aggressive(input1,input2,input3,color))){     //#verifies the move is legal
            return false;
        }
        updated_board[input1] = 'x';
        updated_board[input2] = color;
        updated_board[input3] = 'x';
        updated_board[input3 + move] = color;
        var pushed_stone = this.check_if_pushes(input3, (input3 + move), color)
        console.log("Pushed " + pushed_stone)
        if (pushed_stone != 'x'){
            var pushed_stone = parseInt(pushed_stone);
            if (this.two_space_moves.includes(move)){  //#if move is 2 spaces, creates a 1 space move of same vector
                move = parseInt((move / 2)); // changed input1 to input 3 for the correct vector
                if (this.board[this.check_if_pushes(input3, parseInt(input3 + move), color)] == opponent){ // Checks to see if the move pushes in the first space of the 2 space move vector
                updated_board[pushed_stone] = 'x'
                }
                if (!(this.check_if_valid(pushed_stone, parseInt(input3 + (move+halfmove)), opponent))){ //#checks if stone was pushed off board
                    console.log('opponent ' + opponent + ' stone pushed off board from position ' + pushed_stone.toString());
                }
                else{
                    updated_board[input3 + move + halfmove] = opponent;
                    // console.log(convert_to_string(updated_board))
                    return updated_board
                }
            }
            if (!(this.check_if_valid(pushed_stone, parseInt(input3 + (move*2)), opponent))){ //#checks if stone was pushed off board
                console.log('opponent ' + opponent + ' stone pushed off board from position ' + pushed_stone.toString());
            }
            else{
                updated_board[input3 + move + halfmove] = opponent;
            }
        }
        // console.log(convert_to_string(updated_board))
        return updated_board
        }
    
    // posiblepassivemoves(square, board){
    //     var color = board[square];
    //     if (color == 'x') {
    //         return console.log("Empty square, no possible moves");
    //     }
    //     var passivemoves = [];
    //     for (var ele in this.two_space_moves){
    //         var checkspace = parseInt(ele) + parseInt(square);
    //         console.log(ele)
    //         if (!(this.passive_move(square,checkspace,color))){   //Iterates through all possible 2 space moves and adds them if possible
    //             passivemoves.push(checkspace);
    //         }
    //     }
    //     for (var ele in this.one_space_moves){
    //         var checkspace = parseInt(ele) + parseInt(square);
    //         if (!(this.passive_move(square,checkspace,color))){   //Iterates through all possible 1 space moves and adds them if possible
    //             passivemoves.push(checkspace);
    //         }
    //     }
    //     return passivemoves // returns list of possible squares that you can move to "passively" for a given square
    //     }

    // posibleaggromoves(passivestone,move,color,board){
    //     var passive_board = ~~(passivestone/16);
    //     aggrostonesavailable = []
    //     for (ele in board){
    //         if (this.aggressive_move(ele,move,color,passive_board)){
    //             aggrostonesavailable.push(ele)
    //         }
    //     }
    // }
    }


    function convert_to_string(board){ //#converts the board back from a list into a string for readability
        string = board[0];
        for (i=1; i<board.length; i++){
            if (i % 4 == 0){
                string += "\n";
            }
            if (i % 16 == 0){
                string += "\n \n";
            }
            string += board[i].toString();
            
        }
        return string;
        }

   



module.exports = {
    Rules:Rules
}

// let start = 'bbbbxxxxxxxbwwwwbbbbxxxxxxxxwwwwbbbbxxxxxxxxwwwwbbbbxxxxxxbxwwww'
// const board = start.split("")
// //#testing
// const game = new Rules(board);
// var update2 = game.updateBoard(60,52,15,'w',game.board);
// try{
//     console.log(convert_to_string(update2));
// }
// catch (err){
//     console.log(err);
// }

// # README
// #  Board coordinates respond to list index follows:
// #   0  1  2  3      16 17 18 19
// #   4  5  6  7      20 21 22 23
// #   8  9  10 11     24 25 26 27
// #   12 13 14 15     28 29 30 31
// #
// #   32 33 34 35     48 49 50 51
// #   36 37 38 39     52 53 54 55
// #   40 41 42 43     56 57 58 59
// #   44 45 46 47     60 61 62 63