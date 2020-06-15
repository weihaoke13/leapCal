import psycopg2, time

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

class Create_EventID:
    def create_eventid(self):
        ceid    = Create_EventID()
        count   = ceid.get_event_count()
        next_id = str(int(count[0]) + 1) + "a"
        return next_id

    def get_event_count(self):
        connection = None
        try:
            connection = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor     = connection.cursor()

            cursor.execute("select count(*) from events")
            count = cursor.fetchone()

        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if connection is not None:
                connection.close()
                cursor.close()
                return count

    