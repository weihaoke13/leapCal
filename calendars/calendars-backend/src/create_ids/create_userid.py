import psycopg2, time

hostname = 'localhost'
username = 'admin'
password = 'admin12345'
database = 'ccg'
port     = str(5432)

class Create_UserID:
    admin_pw = 'ccg_admin'
    def create_userid(self):
        cuid  = Create_UserID()
        count = cuid.get_user_count()
        print(count)
        next_id = int(count[0]) + 1
        return next_id

    def admin_password(self, password):
        if password == self.admin_pw:
            return True
        return False

    def create_token(self, next_userid):
        return_value = str(next_userid) + "a"
        return return_value

    # this function gets the current count of the database.
    def get_user_count(self):
        connection = None
        try:
            connection = psycopg2.connect(user = username, password = password, host = hostname, port = port, database = database)
            cursor     = connection.cursor()

            cursor.execute("select count(*) from users")
            count = cursor.fetchone()

        except (Exception, psycopg2.DatabaseError) as error:
            print(error)
        finally:
            if connection is not None:
                connection.close()
                cursor.close()
                return count

