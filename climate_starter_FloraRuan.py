

# 1. import Flask
from flask import Flask, jsonify
import sqlite3

# 2. Create an app, being sure to pass __name__
app = Flask(__name__)


# 3. Define what to do when a user hits the index route
@app.route("/")
def home():
    return (
        f"Welcome to the Climate API!<br/>"
        f"Available Routes:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/<start><br/>"
        f"/api/v1.0/<start>/<end><br/>"

    )


# 4. Define what to do when a user hits the /precipitation route
@app.route("/api/v1.0/precipitation")
def precipitation():
    
    import sqlite3
    #create connection with hawaii database
    conn = sqlite3.connect("Resources/hawaii.sqlite")
    #obtain a cursor - something to loop through via database connection
    cur = conn.cursor()
    # execute statement via cursor-print rows of table named measurement
    sqlstate = "select date,prcp from measurement"

    cur.execute(sqlstate )
    # fetch the cursor above
    rows = cur.fetchall()
    #create list to save each column
    date_ls = []
    prcp_ls = []

    # print all results
    for row in rows:
        date_ls.append(row[0])
        prcp_ls.append(row[1])


    msrdata = dict()

    msrdata['date']=date_ls
    msrdata['precipitation']=prcp_ls

    return jsonify(msrdata)
    

# 5. Define what to do when a user hits the /stations route
@app.route("/api/v1.0/stations")
def stations():
    
    import sqlite3
    #create connection with hawaii database
    conn = sqlite3.connect("Resources/hawaii.sqlite")
    #obtain a cursor - something to loop through via database connection
    cur = conn.cursor()
    # execute statement via cursor-print rows of table named station
    sqlstate = "select * from station"
    cur.execute(sqlstate )
    # fetch the cursor above
    rows = cur.fetchall()
    #create list to save each column
    id_ls = []
    station_ls = []
    name_ls = []
    latitude_ls = []
    longitude_ls = []
    elevation_ls = []
    #print all results
    for row in rows:
        id_ls.append(row[0])
        station_ls.append(row[1])
        name_ls.append(row[2])
        latitude_ls.append(row[3])
        longitude_ls.append(row[4])
        elevation_ls.append(row[5])

    stationdata = dict()
    stationdata['id'] =id_ls
    stationdata['station'] =station_ls
    stationdata['name'] =name_ls
    stationdata['latitude'] =latitude_ls
    stationdata['longitude'] =longitude_ls
    stationdata['elevation'] =elevation_ls
    return jsonify(stationdata)


# 6. Define what to do when a user hits the /tobs route
@app.route("/api/v1.0/tobs")
def tobs():
    
    import sqlite3
    import datetime
    #create connection with hawaii database
    conn = sqlite3.connect("Resources/hawaii.sqlite")
    #obtain a cursor - something to loop through via database connection
    cur = conn.cursor()
    # find the last and first date
    sqlstate = "select date from measurement order by date desc limit 1"
    cur.execute(sqlstate )
    # fetch the cursor above
    rows = cur.fetchall()
    for row in rows:
        last_date_str = row[0]
        last_date_dt = datetime.date(*(int(s) for s in last_date_str.split('-')))
        first_date_dt = last_date_dt - datetime.timedelta(days=365)
        first_date_str = str(first_date_dt)
    # execute statement via cursor-print rows of table named measurement
    sqlstate = "select date,prcp from measurement where date between '"+first_date_str+"' and '"+last_date_str+"' order by date"

    cur.execute(sqlstate )
    # fetch the cursor above
    rows = cur.fetchall()
    #create list to save each column
    # date_ls = []
    prcp_ls = []
        
    # print all results
    for row in rows:
        # date_ls.append(row[0])
        prcp_ls.append(row[1])


    msrdata_12month = dict()

    # msrdata_12month['date']=date_ls
    msrdata_12month['prcp']=prcp_ls
    return jsonify(msrdata_12month)

# 7. Define what to do when a user hits the /<start> route
@app.route("/api/v1.0/<start>")
def start(start):
    
    import sqlite3
    #create connection with hawaii database
    conn = sqlite3.connect("Resources/hawaii.sqlite")
    #obtain a cursor - something to loop through via database connection
    cur = conn.cursor()
# execute statement via cursor-print rows of table named measurement
    # sqlstate = "select tobs from measurement where date between '"+start_date+"' and '"+end_date+"' o"
    sqlstate = "select min(tobs),max(tobs),avg(tobs) from measurement where date > '"+start+"' and tobs IS NOT NULL"
    cur.execute(sqlstate )
    # fetch the cursor above
    rows = cur.fetchall()
    #create list to save each column
    statistic_start = dict()
    for row in rows:
        statistic_start["min,max,average"]=row

    return jsonify(statistic_start)

# 8. Define what to do when a user hits the /<start>/<end> route
@app.route("/api/v1.0/<start>/<end>")
def start_end(start,end):
    
    import sqlite3
    #create connection with hawaii database
    conn = sqlite3.connect("Resources/hawaii.sqlite")
    #obtain a cursor - something to loop through via database connection
    cur = conn.cursor()
    # execute statement via cursor-print rows of table named measurement
    sqlstate = "select min(tobs),max(tobs),avg(tobs) from measurement where date between '"+start+"' and '"+end+"' and tobs IS NOT NULL"
    cur.execute(sqlstate )
    # fetch the cursor above
    rows = cur.fetchall()
    #create list to save each column
    statistic_se = dict()
    for row in rows:
        statistic_se["min,max,average"]=row
        
    return jsonify(statistic_se)

# @app.route("/api/v1.0/user_smart/<input_column>")
# def mycolumn(input_column):
#     conn = sqlite3.connect("sharks.sqlite")
#     cur = conn.cursor()
#     cur.execute("SELECT " + str(input_column) + " from sharks")
#     rows = cur.fetchall()
#     column_list = []
#     for row in rows:
#         column_list.append(row[0])

#     columndata = dict()
#     columndata["column name"] = input_column
#     columndata["result"] = column_list
#     return jsonify(columndata)


if __name__ == "__main__":
    app.run(debug=True)