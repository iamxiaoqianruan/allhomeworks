import os
import csv

csvpath = os.path.join('test_data.csv')

with open(csvpath, 'r', newline='') as csvfile:

    # CSV reader specifies delimiter and variable that holds contents
    csvreader = csv.reader(csvfile)
    next(csvreader)

    # Read each row of data after the header
    for row in csvreader:
        print(row)

    #store candidates in a list
    candidates = []
    vote=[]
    for row in csvreader:
        if row[2] in candidates:
            pass
        else:
            candidates.append(row[2])
    #test candidates list
    for row in candidates:
        print(row)

    # # Read each row of data after the header
    # for row in csvreader:
    #     print(row)

