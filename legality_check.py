import numpy as np
import colorama
from colorama import Fore
from colorama import Style
import sys

colorama.init()

zeros = np.zeros((4, 4, 4), dtype='str')  # initializes the board state
board = np.array((('1', '1', '1', '1'), ('0', '0', '2', '0'), ('0', '0', '0', '0'), ('2', '2', '2', '2')))
board = np.core.defchararray.add(zeros, board)

unit_vectors = np.array([[0, 1, 0], [0, 0, 1], [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, 0], [0, 0, -1],
                         [0, -1, -1]])  # defines the legal vectors for stone movement up to two spaces
viable_vectors = np.concatenate((unit_vectors, unit_vectors * 2))


def obtain_board_pos(stone,board=board):
    if stone[1] not in [0, 1, 2, 3] or stone[2] not in [0, 1, 2,
                                                        3]:  # checks if position is out of bounds and returns '0'
        position = '0'
    else:
        position = board[stone[0]][stone[1]][stone[2]]
    return position

def update_board_pos(stone,input,board_update):
    out_of_bounds=False
    if stone[1] not in [0, 1, 2, 3] or stone[2] not in [0, 1, 2,
                                                        3]:  # checks if position is out of bounds
        out_of_bounds = True
        return out_of_bounds
    board_update[stone[0]][stone[1]][stone[2]]=input
    return out_of_bounds

def generate_unit_vector(vector):
    unit_vector = [0, 0, 0]
    for i in (1, 2):
        if vector[i] in (1, 2):
            unit_vector[i] = 1
        if vector[i] in (-1, -2):
            unit_vector[i] = -1
        if vector[i] == 0:
            unit_vector[i] = 0
    return unit_vector


def check_if_pushes(board, stone, vector):  # checks if there is a stone in the vector path of the aggressive move
    if board[stone[0]][stone[1] + vector[1]][stone[2] + vector[2]] != '0' or \
            board[stone[0]][stone[1] + int(round(vector[1] / 2 + 0.1))][
                stone[2] + int(round(vector[2] / 2 + 0.1))] != '0':
        return True
    else:
        return False


def get_vector(stone_coordinate, move_coordinate):
    return (0, move_coordinate[1] - stone_coordinate[1], move_coordinate[2] - stone_coordinate[2])


def passive_move(color, stone_coordinate, move_coordinate, vector):
    if color == '1':
        homeboard = ('0', '1')
    if color == '2':
        homeboard = ('2', '3')

    if str(stone_coordinate[0]) not in homeboard:  # checks if passive move is on homeboard
        print("Error11")
        return False

    if obtain_board_pos(stone_coordinate) != color:  # checks if you're selecting your own stone
        print("Error12")
        return False

    if stone_coordinate[0] != move_coordinate[0]:
        print("Error13")
        return False

    if vector not in viable_vectors:  # checks if stone movement is legal
        print("Error14")
        return False

    if check_if_pushes(board, stone_coordinate, vector):
        print("Error16")
        return False

    return True  # , vector, stone_coordinate[0]


def aggressive_move(color, opponent, passive_board, stone_coordinate, vector, unit_vector):
    move_position = np.array(stone_coordinate) + np.array(vector)

    if move_position[1] not in [0, 1, 2, 3] or move_position[2] not in [0, 1, 2, 3]:
        print("Error1")
        return False

    if obtain_board_pos(stone_coordinate) != color:  # checks if you're selecting your own stone
        print("Error2")
        return False

    if stone_coordinate[0] % 2 == passive_board % 2:
        print("Error3")
        return False

    if board[stone_coordinate[0]][stone_coordinate[1]][
        stone_coordinate[2]] != color:  # checks if you're selecting your own stone
        print("Error4")
        return False

    if obtain_board_pos(move_position) == color or obtain_board_pos(
            np.array(stone_coordinate) + np.array(unit_vector)) == color:
        print("Error5")
        return False

    if obtain_board_pos(move_position) == opponent and (
            obtain_board_pos(move_position + unit_vector) != '0' or obtain_board_pos(
            move_position - unit_vector) == opponent):
        print("Error6")
        return False  # if moved onto opponent stone, checks if there is an opponent stone 1 unit ahead or behind of stone

    if obtain_board_pos(move_position) == '0' and obtain_board_pos(
            move_position - unit_vector) == opponent and obtain_board_pos(move_position + unit_vector) != '0':
        print("Error7")
        return False  # if moved onto empty space, checks if there is an opponent stone both 1 unit behind and ahead of stone

    return True


def print_statements(init_stone, init_move, aggro_stone, aggressive_moved, aggro_legal, passive_legal, unit_vector,
                     opponent):
    print('stone selected: ' + str([obtain_board_pos(init_stone)]) + ' at ' + str(init_stone))
    print('move position: ' + str([obtain_board_pos(init_move)]) + ' at ' + str(init_move))
    print('aggressive stone selected: ' + str([obtain_board_pos(aggro_stone)]) + ' at ' + str(aggro_stone))
    print('aggressive stone moved to: ' + str([obtain_board_pos(aggressive_moved)]) + ' at ' + str(aggressive_moved))

    if aggro_legal == True and passive_legal == True:
        legal = True
    if legal == True and obtain_board_pos(aggressive_moved) == opponent:
        print(opponent + ' stone pushed from ' + str(aggressive_moved) + ' to ' + str(aggressive_moved + unit_vector))
        if -1 in aggressive_moved + unit_vector or 4 in aggressive_moved + unit_vector:
            print(opponent + ' stone removed from the board')
    if legal == True and obtain_board_pos(aggressive_moved) == '0' and obtain_board_pos(
            aggressive_moved - unit_vector) == opponent:
        print(str([opponent]) + ' stone pushed from ' + str(aggressive_moved - unit_vector) + ' to ' + str(
            aggressive_moved + unit_vector))
        if -1 in aggressive_moved + unit_vector or 4 in aggressive_moved + unit_vector:
            print(opponent + ' stone removed from the board')


def passive_aggressive(color, init_stone, init_move, aggro_stone):
    # this does the same thing as what you had in aggresive_move
    # its called a "ternary operator" all languages have this ability but usually with different syntax
    legality = False
    opponent = '1' if color == '2' else '2'
    vector = get_vector(init_stone, init_move)
    unit_vector = np.array(generate_unit_vector(vector))
    sub_board = init_stone[0]

    passive_legal = passive_move(color, init_stone, init_move, vector)

    if not passive_legal:
        return legality

    aggro_legal = aggressive_move(color, opponent, sub_board, aggro_stone, vector,
                                  unit_vector)  # using the vector from passive move, applies to aggressive stone and determines if legal

    if not aggro_legal:
        return legality

    aggressive_moved = (aggro_stone[0], aggro_stone[1] + vector[1],
                        aggro_stone[2] + vector[2])  # records position of newly moved aggressive stone

    legality=True
    return legality,color,opponent,vector,unit_vector,init_stone,init_move,aggro_stone


def unit_tests():
    # test for legal move
    print(Fore.GREEN + "\ntest for legal move" + Style.RESET_ALL)
    passive_aggressive('1', (1, 0, 3), (1, 2, 1), (2, 0, 2))
    print(Fore.GREEN + "\ntest for legal move white" + Style.RESET_ALL)
    passive_aggressive('2', (2, 3, 0), (2, 1, 2), (1, 3, 1))

    print(Fore.RED + "\ntest for same board passive aggro move" + Style.RESET_ALL)
    passive_aggressive('1', (1, 0, 3), (1, 2, 1), (1, 0, 2))

    print(Fore.RED + "\ntest for illegal board passive move legal board aggro move" + Style.RESET_ALL)
    passive_aggressive('1', (2, 0, 3), (2, 2, 1), (3, 0, 2))

    print(Fore.RED + "\ntest for legal board passive move illegal board aggro move" + Style.RESET_ALL)
    passive_aggressive('1', (0, 0, 3), (0, 2, 1), (2, 0, 2))

    print(Fore.RED + "\ntest for legal boards but illegal move" + Style.RESET_ALL)
    passive_aggressive('1', (1, 0, 3), (1, 3, 0), (2, 0, 2))

    print(Fore.RED + "\ntest for wrong stone" + Style.RESET_ALL)
    passive_aggressive('2', (2, 0, 3), (2, 2, 1), (1, 3, 1))

def update_board(board,color, init_stone, init_move, aggro_stone,board_history):
        updated_board=np.copy(board)
        legal,color,opponent,vector,unit_vector,init_stone,init_move,aggro_stone = passive_aggressive(color,init_stone, init_move,aggro_stone)
        aggressive_moved = (aggro_stone[0], aggro_stone[1] + vector[1], aggro_stone[2] + vector[2])
        if legal==True:
            update_board_pos(init_stone, '0', updated_board)
            update_board_pos(init_move, color, updated_board)
            update_board_pos(aggro_stone, '0', updated_board)
            update_board_pos(aggressive_moved, color, updated_board)
            if obtain_board_pos(aggressive_moved) == opponent:
                out_of_bounds=update_board_pos(aggressive_moved+unit_vector, opponent, updated_board)
            if obtain_board_pos(aggressive_moved) == '0' and obtain_board_pos(
                aggressive_moved - unit_vector) == opponent:
                update_board_pos(aggressive_moved-unit_vector,'0', updated_board)
                out_of_bounds=update_board_pos(aggressive_moved+unit_vector,opponent,updated_board)
            #board_history+=updated_board
            board_history.append(updated_board)
        else:
            print("Error9")

        return updated_board,board_history

def move(string):
    return tuple(map(int, string.split(', ')))

def boardToString(board):
    rowStrings = []
    strings = []
    for region in board:
        for row in region:
            rowStrings.append(''.join(row))
        strings.append(''.join(rowStrings))
        rowStrings = []
    stringBoard = '$'.join(strings)
    return stringBoard
    
board_history=[board]
#board,board_history=update_board(board,'1',(0,0,0),(0,2,2),(1,0,1),board_history)
sys.argv = [ 'junk', '2','2, 3, 3', '2, 2, 3', '3, 3, 3' ]
board,board_history=update_board(board,sys.argv[1], move(sys.argv[2]), move(sys.argv[3]), move(sys.argv[4]), board_history)
board = boardToString(board.tolist())
print(board)
#TODO: make board less shit (convert to strings)
#print(board)