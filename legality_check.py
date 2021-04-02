import numpy as np
import colorama
from colorama import Fore
from colorama import Style
import sys

colorama.init()

unit_vectors = np.array([[0, 1, 0], [0, 0, 1], [0, 1, 1], [0, 1, -1], [0, -1, 1], [0, -1, 0], [0, 0, -1],
                         [0, -1, -1]])  # defines the legal vectors for stone movement up to two spaces
viable_vectors = np.concatenate((unit_vectors, unit_vectors * 2))


def obtain_board_pos(stone):
        if stone[1] not in [0,1,2,3] or stone[2] not in [0,1,2,3]:      #checks if position is out of bounds and returns '0'
            position='0'
        else:
            position= board[stone[0]][stone[1]][stone[2]]
        return position
    
def update_board_pos( stone,input,board_update):
    out_of_bounds=False
    if stone[1] not in [0, 1, 2, 3] or stone[2] not in [0, 1, 2, 3]:  # checks if position is out of bounds
        out_of_bounds = True
        return out_of_bounds
    board_update[stone[0]][stone[1]][stone[2]]=input
    return out_of_bounds

def generate_unit_vector( vector):
    unit_vector=[0,0,0]
    for i in (1,2):
        if vector[i] in (1,2):
            unit_vector[i]=1
        if vector[i] in (-1,-2):
            unit_vector[i]=-1
        if vector[i]==0:
            unit_vector[i]=0
    return unit_vector

def check_if_pushes(stone,vector):                                       #checks if there is a stone in the vector path of the aggressive move
    if board[stone[0]][stone[1]+vector[1]][stone[2]+vector[2]]!='0' or( 2 in vector and board[stone[0]][stone[1]+int(round(vector[1]/2+0.5))][stone[2]+int(round(vector[2]/2+0.5))]!='0'):
        return True
    else:
        return False

def get_vector( stone_coordinate,move_coordinate):
    return (0,move_coordinate[1] - stone_coordinate[1], move_coordinate[2] - stone_coordinate[2])

def passive_move( color,stone_coordinate,move_coordinate, vector):

    if color == "1":
        homeboard = ('0', '1')
    if color == "2":
        homeboard = ('2', '3')

    if str(stone_coordinate[0]) not in homeboard:                          #checks if passive move is on homeboard
        print("Error: Board selected is not a homeboard")
        return False

    if obtain_board_pos(stone_coordinate)!=color:                          #checks if you're selecting your own stone
        print("Error: no '"+ str(color)+"' stone at "+ str(stone_coordinate))
        return False

    if stone_coordinate[0]!=move_coordinate[0]:
        print("Error: Stone coordinate and Move coordinate not on same board")
        return False

    if vector not in viable_vectors:                                        #checks if stone movement is legal
        print('Error: Movement not orthogonally or diagonally adjacent with a scale up to two.')
        return False

    if check_if_pushes(stone_coordinate,vector):
        print(board, stone_coordinate, vector)
        print("Error: Cannot push a stone on a passive move.")
        return False

    return True

def aggressive_move( color, opponent, passive_board, stone_coordinate, vector, unit_vector):

    move_position=np.array(stone_coordinate)+np.array(vector)

    if move_position[1] not in [0,1,2,3] or move_position[2] not in [0,1,2,3]:
        print('Error: Aggressive move out of 4x4 bounds')
        return False

    if obtain_board_pos(stone_coordinate)!=color:                          #checks if you're selecting your own stone
        print("Error: no '"+ str(color)+"' stone at "+ str(stone_coordinate) + '  (aggressive move)')
        return False
        
    if stone_coordinate[0] % 2 == passive_board % 2:
        print('Error: stone must be played on opposite colored board as your passive move')                 #must play on boards of opposite parity
        return False
        
    if board[stone_coordinate[0]][stone_coordinate[1]][stone_coordinate[2]]!=color:    #checks if you're selecting your own stone
        print("Error: no '"+ str(color)+"' stone at "+ str(stone_coordinate))
        return False
        
    if obtain_board_pos(move_position)==color or obtain_board_pos(np.array(stone_coordinate)+np.array(unit_vector))==color:
        print('Error: Cannot push your own stones')         #if vector length = 2, checks both spots. if length = 1, only checks destination
        return False
        
    if obtain_board_pos(move_position)==opponent and (obtain_board_pos(move_position+unit_vector)!= '0' or obtain_board_pos(move_position-unit_vector)== opponent):
        print('Error: Cannot push more than one stone (Case 1)')
        return False               #if moved onto opponent stone, checks if there is an opponent stone 1 unit ahead or behind of stone
        
    if obtain_board_pos(move_position)=='0' and obtain_board_pos(move_position-unit_vector)==opponent and obtain_board_pos(move_position+unit_vector)!='0':
        print('Error: Cannot push more than one stone (Case 2)')
        return False               #if moved onto empty space, checks if there is an opponent stone both 1 unit behind and ahead of stone
        
    return True

def passive_aggressive( color, init_stone,init_move,aggro_stone, vector, unit_vector, opponent, sub_board):

    passive_legal = passive_move(color, init_stone, init_move, vector)

    if not passive_legal:
        return False

    aggro_legal = aggressive_move(color, opponent, sub_board, aggro_stone, vector, unit_vector)  #using the vector from passive move, applies to aggressive stone and determines if legal

    if not aggro_legal:
        return False

    aggressive_moved=(aggro_stone[0],aggro_stone[1]+vector[1],aggro_stone[2]+vector[2]) #records position of newly moved aggressive stone

    return True

def update_board(board, color, init_stone, init_move, aggro_stone,board_history=[]):
        updated_board=np.copy(board)
        opponent= '1' if color == '2' else '2'
        vector = get_vector(init_stone, init_move)
        unit_vector = np.array(generate_unit_vector(vector))
        sub_board = init_stone[0]
        legal = passive_aggressive(color,init_stone, init_move,aggro_stone, vector, unit_vector, opponent, sub_board)
        aggressive_moved = (aggro_stone[0], aggro_stone[1] + vector[1], aggro_stone[2] + vector[2])
        if legal==True:
            update_board_pos(init_stone, '0', updated_board)
            update_board_pos(init_move, color, updated_board)
            update_board_pos(aggro_stone, '0', updated_board)
            update_board_pos(aggressive_moved, color, updated_board)
            if obtain_board_pos(aggressive_moved) == opponent:
                out_of_bounds=update_board_pos(aggressive_moved+unit_vector, opponent, updated_board)
            if obtain_board_pos(aggressive_moved) == '0' and obtain_board_pos(aggressive_moved - unit_vector) == opponent:
                update_board_pos(aggressive_moved-unit_vector,'0', updated_board)
                out_of_bounds= update_board_pos(aggressive_moved+unit_vector,opponent,updated_board)
            #board_history+=updated_board
            board_history.append(updated_board)
        else:
            print('Error: illegal move')

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

def stringToList(string):
    lst = string.split(",")
    return [lst[i:i + 4] for i in range(0, len(lst), 4)]
    
#board_history=[board]
#board,board_history=update_board(board,'1',(0,0,0),(0,2,2),(1,0,1),board_history)
# sys.argv = [
#   'legality_check.py',
#   '1',
#   '0, 0, 0',
#   '0, 1, 0',
#   '1, 0, 0',
#   '1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2',
#   '1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2',
#   '1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2',
#   '1,1,1,1,0,0,0,0,0,0,0,0,2,2,2,2'
# ]

board = [stringToList(sys.argv[5]),stringToList(sys.argv[6]),stringToList(sys.argv[7]),stringToList(sys.argv[8])]
board,board_history=update_board(board, sys.argv[1], move(sys.argv[2]), move(sys.argv[3]), move(sys.argv[4]))
board = boardToString(board.tolist())
print(board)
#TODO: make board less shit (convert to strings)
#print(board)