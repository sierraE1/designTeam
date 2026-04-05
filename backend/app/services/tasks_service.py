#Stuff to do with tasks!
from app.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.database import get_database_connection
from datetime import date
from typing import Optional

#First i'm going to make a helper to get the db connection
def get_db():
    return get_database_connection()
#Now create a task
def create_task(user_id: int, task: TaskCreate) -> TaskResponse:
    db = get_db() #Get session
    with db.cursor() as cur:
        cur.execute( #Check if it exists
            "INSERT INTO tasks (user_id, title, description) VALUES (%s, %s, %s) RETURNING id",
            (user_id, task.title, task.description)
        )
        new_task_id = cur.fetchone()[0]  #grab just the generated id which is the first value
        db.commit()
        return TaskResponse(id=new_task_id, title=task.title, description=task.description)

#Update a task
def update_task(user_id: int, task_id: int, task: TaskUpdate) -> TaskResponse:
    db = get_db() #Get session
    with db.cursor() as cur:
        cur.execute( #Check if it exists
            "SELECT id FROM tasks WHERE id = %s AND user_id = %s",
            (task_id, user_id)
        )
        existing_task = cur.fetchone() #Grab one row
        if not existing_task:
            raise Exception("Task not found") #if it doesn't exist
        #Actual update logic
        cur.execute(
            "UPDATE tasks SET title = %s, description = %s WHERE id = %s AND user_id = %s", 
            (task.title, task.description, task_id, user_id)
        )
        db.commit()
        return TaskResponse(id=task_id, title=task.title, description=task.description)

#Delete a task
def delete_task(user_id: int, task_id: int) -> bool:
    db = get_db() #Get session
    with db.cursor() as cur:
            cur.execute(
                "SELECT id FROM tasks WHERE id = %s AND user_id = %s",
                (task_id, user_id)
            )
            existing_task = cur.fetchone()
            if not existing_task:
                raise Exception("Task not found")
            #Delete logic
            cur.execute(
                "DELETE FROM tasks WHERE id = %s AND user_id = %s",
                (task_id, user_id)
            )
            db.commit()
            return True #i dont think delete has to return anything, just make sure it went through

def list_tasks_for_user(user_id: int) -> list[TaskResponse]:
    db = get_db()
    with db.cursor() as cur:
        cur.execute(
            "SELECT id, title, description FROM tasks WHERE user_id = %s ORDER BY id DESC",
            (user_id,),
        )
        rows = cur.fetchall()
    return [TaskResponse(id=r[0], title=r[1], description=r[2]) for r in rows]


def get_task_by_id(user_id: int, task_id: int) -> Optional[TaskResponse]:
    db = get_db()
    with db.cursor() as cur:
        cur.execute(
            "SELECT id, title, description FROM tasks WHERE id = %s AND user_id = %s",
            (task_id, user_id),
        )
        row = cur.fetchone()
    if not row:
        return None
    return TaskResponse(id=row[0], title=row[1], description=row[2])


def get_today_tasks_service(user_id: int):
    due_date = date.today() #Asking for a new date object that represents today
    db = get_database_connection()
    try:
        tasks_list = []
        with db.cursor() as cur:
            cur.execute(
                "SELECT id, title, description FROM tasks WHERE due_date = %s AND user_id = %s", #This time i need all 3 of those cols
                (due_date, user_id)
            )
            rows = cur.fetchall() #This is fetch all because there might be multiple tasks due that day
            #Returns list of rows so I need to loop over that ?
            for row in rows:
                newTask = TaskResponse(id=row[0], title=row[1], description=row[2]) #Each row is a ... tuple ..?
                tasks_list.append(newTask)        
    finally:
        db.close()
    return {"tasks": tasks_list}