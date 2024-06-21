from app import app
from app.get_data import get_all_coords, get_coord, get_temp, get_humidity, get_pressure
from flask_cors import CORS, cross_origin

@app.route("/data", methods=['GET'])
@cross_origin()
def get_coords():
    data = get_all_coords()
    return data



@app.route("/data/<idd>", methods=['GET'])
@cross_origin()
def get_data(idd):
    return get_coord(idd)


@app.route("/data/temp/<iddq>", methods=['GET'])
@cross_origin()
def get_temp_route(iddq):
    return get_temp(iddq)

@app.route("/data/humidity/<iddq>", methods=['GET'])
@cross_origin()
def get_humidity_route(iddq):
    return get_humidity(iddq)

@app.route("/data/pressure/<iddq>", methods=['GET'])
@cross_origin()
def get_pressure_route(iddq):
    return get_pressure(iddq)