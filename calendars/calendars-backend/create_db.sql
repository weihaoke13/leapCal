CREATE TABLE Users (
    uid             INTEGER PRIMARY KEY,
    username        VARCHAR(255) UNIQUE NOT NULL,
    useremail       VARCHAR(255) UNIQUE NOT NULL,
    firstname       VARCHAR(255) NOT NULL,
    lastname        VARCHAR(255) NOT NULL,
    is_admin        BOOLEAN DEFAULT 'False',
    password        VARCHAR(255) NOT NULL,
    jwt_token       VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Events (
    eventID         VARCHAR (64)  PRIMARY KEY,
    event_title     VARCHAR (64)  NOT NULL,
    start_date      VARCHAR (64)  NOT NULL,
    end_date        VARCHAR (64)  NOT NULL,
    description     VARCHAR (512) NOT NULL,
    location        VARCHAR (256)  NOT NULL,
    all_day         BOOLEAN DEFAULT 'False'
);

CREATE TABLE Signup (
    userID          INTEGER NOT NULL,
    eventID         VARCHAR(20) NOT NULL,
    PRIMARY KEY     (userID, eventID)
);


