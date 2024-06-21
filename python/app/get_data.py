import pymysql
from config import host, user, password,db_name

def get_connection():
    return pymysql.connect(
        host=host,
        port=3306,
        user=user,
        password=password,
        database=db_name,
        cursorclass=pymysql.cursors.DictCursor
    )
def get_all_coords():
    try:
        connection = get_connection()
        d = []
        try:
            #select all data from table point
            with connection.cursor() as cursor:
                select_all_rows = "SELECT c.id_points, c.Name1 AS Station, c.CoordX, c.CoordY , MAX((SELECT d.value FROM Data d WHERE d.id_sensor = s.id AND s.id_parametr = 1 ORDER BY d.date DESC LIMIT 1)) AS Temperature, MAX((SELECT d.value FROM Data d WHERE d.id_sensor = s.id AND s.id_parametr = 2 ORDER BY d.date DESC LIMIT 1)) AS Humidity, MAX((SELECT d.value FROM Data d WHERE d.id_sensor = s.id AND s.id_parametr = 3 ORDER BY d.date DESC LIMIT 1)) AS Pressure FROM Complex c JOIN Sensor s ON c.id_points = s.id_complex GROUP BY c.id_points, c.Name1, c.CoordX, c.CoordY;"
                cursor.execute(select_all_rows)
                rows = cursor.fetchall()
                for row in rows:
                    d.append(row)

        finally:
            connection.close
            return d
    except Exception as ex:
        print("Connection refused...")
        print(ex)


def get_coord(idd):
    idd = int(idd)
    try:
        connection = get_connection()
        d = []
        data = {

        }
        try:
            #select all data from table point
            with connection.cursor() as cursor:
                select_all_rows = (f"SELECT c.id_points, c.Name1, c.CoordX, c.CoordY, d_temp.value AS 'Temperature', d_temp.date AS 'date_temperature', d_humidity.value AS 'humidity', d_humidity.date AS 'date_humidity', d_pressure.value AS 'pressure', d_pressure.date AS 'date_pressure' FROM Complex c LEFT JOIN (SELECT s.id_complex, d.value, d.date FROM Sensor s INNER JOIN Data d ON s.id = d.id_sensor WHERE s.id_parametr = 1 AND d.date = (SELECT MAX(date) FROM Data WHERE id_sensor = s.id)) AS d_temp ON c.id_points = d_temp.id_complex LEFT JOIN (SELECT s.id_complex, d.value, d.date FROM Sensor s INNER JOIN Data d ON s.id = d.id_sensor WHERE s.id_parametr = 2 AND d.date = (SELECT MAX(date) FROM Data WHERE id_sensor = s.id)) AS d_humidity ON c.id_points = d_humidity.id_complex LEFT JOIN (SELECT s.id_complex, d.value, d.date FROM Sensor s INNER JOIN Data d ON s.id = d.id_sensor WHERE s.id_parametr = 3 AND d.date = (SELECT MAX(date) FROM Data WHERE id_sensor = s.id)) AS d_pressure ON c.id_points = d_pressure.id_complex WHERE c.id_points = {idd};")
                cursor.execute(select_all_rows)
                rows = cursor.fetchall()
                for row in rows:
                    d.append(row)

        finally:
            connection.close
            return d
    except Exception as ex:
        print("Connection refused...")
        print(ex)


def get_temp(iddq):
    iddq = int(iddq)
    try:
        connection = get_connection()
        d = []
        data = {

        }
        try:
            with connection.cursor() as cursor:
                select_temp = f"SELECT c.id_points AS id_station, c.Name1 AS Station_Name, d.value AS Temperature, d.date AS Measurement_Date FROM Complex c JOIN Sensor s ON c.id_points = s.id_complex JOIN Data d ON s.id = d.id_sensor WHERE s.id_parametr = 1 AND c.id_points = {iddq} ORDER BY d.date;"
                cursor.execute(select_temp)
                rows = cursor.fetchall()
                for row in rows:
                    d.append(row)
        finally:
            connection.close()
            return d
    except Exception as ex:
        print("Connection refused...")
        print(ex)


def get_humidity(iddq):
    iddq = int(iddq)
    try:
        connection = get_connection()
        d = []
        data = {

        }
        try:
            with connection.cursor() as cursor:
                select_temp = f"SELECT c.id_points AS id_station, c.Name1 AS Station_Name, d.value AS Humidity, d.date AS Measurement_Date FROM Complex c JOIN Sensor s ON c.id_points = s.id_complex JOIN Data d ON s.id = d.id_sensor WHERE s.id_parametr = 2 AND c.id_points = {iddq} ORDER BY d.date;"
                cursor.execute(select_temp)
                rows = cursor.fetchall()
                for row in rows:
                    d.append(row)
        finally:
            connection.close()
            return d
    except Exception as ex:
        print("Connection refused...")
        print(ex)

def get_pressure(iddq):
    iddq = int(iddq)
    try:
        connection = get_connection()
        d = []
        data = {

        }
        try:
            with connection.cursor() as cursor:
                select_temp = f"SELECT c.id_points AS id_station, c.Name1 AS Station_Name, d.value AS Pressure, d.date AS Measurement_Date FROM Complex c JOIN Sensor s ON c.id_points = s.id_complex JOIN Data d ON s.id = d.id_sensor WHERE s.id_parametr = 3 AND c.id_points = {iddq} ORDER BY d.date;"
                cursor.execute(select_temp)
                rows = cursor.fetchall()
                for row in rows:
                    d.append(row)
        finally:
            connection.close()
            return d
    except Exception as ex:
        print("Connection refused...")
        print(ex)