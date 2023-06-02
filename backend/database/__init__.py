from sqlalchemy import create_engine, exc, text
from dotenv import load_dotenv
from os import getenv

# loading all environmental variable in script
load_dotenv()

try:
    # creating the database engine
    db = create_engine(
        f"""mysql+pymysql://{getenv("DB_USER")}:{getenv("DB_PASS")}@localhost/{getenv("DB_DBNAME")}?charset=utf8mb4""",
        isolation_level="AUTOCOMMIT",
    )
    # with db.connect() as conn:
    #     print(conn.execute(text("SHOW TABLES")).all())

# catching error if occur
except exc.SQLAlchemyError as e:
    print("Error in Database", e)
