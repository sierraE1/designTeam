from dataclasses import dataclass


@dataclass
class User:
	id: int
	email: str


@dataclass
class Task:
	id: int
	title: str
	description: str | None = None


@dataclass
class Mood:
	id: int
	user_id: int
	value: str
