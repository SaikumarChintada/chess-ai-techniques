

function test(){
    var board = ChessBoard('board', {
        draggable: true,
        dropOffBoard: 'trash',
    });
    resetHandlers();
};


$(document).ready(function(){
    // test();
    // initBoard();
    // randomOne();
    randomRandom();
});


function randomRandom()
{
    var board,
    game = new Chess();
    var makeRandomMove = function() {
        
        var possibleMoves = game.moves();
        // exit if the game is over
        if (game.game_over() === true ||
            game.in_draw() === true ||
            possibleMoves.length === 0) 
        return;

        var randomIndex = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIndex]);
        board.position(game.fen());
        // window.setTimeout(makeRandomMove, 500);
    };
    board = ChessBoard('board', 'start');
    
    $('<input type="button" id="startRand" value="startRandomPlay" />').insertAfter('#resetBtn');

    $('#startRand').on('click',function(){
        window.setTimeout(makeRandomMove, 500);        
    });
    resetHandlers();
}

function initBoard(){
    var board,
    game = new Chess(),
    statusEl = $('#status'),
    fenEl = $('#fen'),
    pgnEl = $('#pgn');

    // do not pick up pieces if the game is over
    // only pick up pieces for the side to move
    var onDragStart = function(source, piece, position, orientation) {
        if  (game.game_over() === true ||
            (game.turn() === 'w' && piece.search(/^b/) !== -1) ||
            (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
            return false;
        }
    };

    var onDrop = function(source, target) {
        // see if the move is legal
        var move = game.move({
            from: source,
            to: target,
            promotion: 'q' // NOTE: always promote to a queen for example simplicity
        });

        // illegal move
        if (move === null) return 'snapback';
        updateStatus();
    };

    // update the board position after the piece snap 
    // for castling, en passant, pawn promotion
    var onSnapEnd = function() {
        board.position(game.fen());
    };

    var updateStatus = function() {
        var status = '';

        var moveColor = 'White';
        if (game.turn() === 'b') {
            moveColor = 'Black';
        }

        // checkmate?
        if (game.in_checkmate() === true) {
            status = 'Game over, ' + moveColor + ' is in checkmate.';
        }

        // draw?
        else if (game.in_draw() === true) {
            status = 'Game over, drawn position';
        }

        // game still on
        else {
            status = moveColor + ' to move';

            // check?
            if (game.in_check() === true) {
                status += ', ' + moveColor + ' is in check';
            }
        }

        statusEl.html(status);
        fenEl.html(game.fen());
        pgnEl.html(game.pgn());
    };

    var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
    };
    board = ChessBoard('board', cfg);

    updateStatus();
    

    $('#startBtn').on('click', function(){
        board.start();
        game = new Chess();
    });
    $('#clearBtn').on('click', function(){
        board.clear();
    });

    resetHandlers();

}

function resetHandlers()
{
    $('#startBtn').on('click', function(){
        board.start();
        game = new Chess();
    });
    $('#clearBtn').on('click', function(){
        board.clear();
    });

    $('#resetBtn').on('click',function(){
        board.clear();
        board.start();
        game = new Chess();
    });
}
