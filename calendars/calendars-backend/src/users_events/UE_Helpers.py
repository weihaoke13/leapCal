import psycopg2

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

class UE_Helpers:
    # function to help with getting the events a specific userid is signed up to within a given month.
    def get_users_events(self, month, userid):
        connection = user_events = None
        final_list = []

        # double checking in case month or userid somehow get through initial checks.
        if month is None or userid is None:
            return False
        
        # string of query to be made.
        query = "select eventid from signup where userid = " + str(userid) + " and eventid in (select eventid from events where start_date like '" + str(month)+ "%')"

        try:
            connection    = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor        = connection.cursor()

            cursor.execute(query)

            user_events = cursor.fetchall()

            cursor.close()
        except (Exception, psycopg2.DatabaseError) as error:
            print("DB Error.")
            print(error)
            connection.close()
        finally:
            # checks to see if the connection was already closed, if it were, then there was an error and returns false, otherwise returns a list
            # of user events signed up for.
            if connection.closed == 0:
                connection.close()
                if user_events is None:
                    return user_events

                # create a single list.
                for event in user_events:
                    final_list.append(event[0])
                return final_list
            return False

    def is_valid_userid(self, userid):
        connection = temp = None

        if userid is None:
            return False

        query = "select uid from users where uid = " + str(userid)

        try:
            connection    = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor        = connection.cursor()

            cursor.execute(query)

            temp = cursor.fetchone()

            cursor.close()
        
        except (Exception, psycopg2.DatabaseError) as error:
            print("DB Error.")
            print(error)
            connection.close()
        finally:
            if connection.closed == 0:
                connection.close()
                if temp is None:
                    return False
                if userid == temp[0]:
                    return True
            else:
                return -1
