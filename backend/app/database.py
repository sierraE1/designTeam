import os

from dotenv import load_dotenv

load_dotenv()


def get_database_url() -> str:
	database_url = os.getenv("DATABASE_URL")
	if database_url:
		return database_url

	db_user = os.getenv("DB_USER", "postgres")
	db_password = os.getenv("DB_PASSWORD", "postgres")
	db_host = os.getenv("DB_HOST", "localhost")
	db_name = os.getenv("DB_NAME", "postgres")
	db_port = os.getenv("DB_PORT", "5432")

	return f"postgresql+psycopg://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
