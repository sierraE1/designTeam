#Stuff to do with tasks!
from app.schemas import TaskCreate, TaskUpdate, TaskResponse
from app.models import Task
from app.database import get_database_url

#First i'm going to make a helper to get the db connection
def get_db():
    db = get_database_url()
    try:
        yield db
    finally:
        db.close()

#Now create a task
def create_task(user_id: int, task: TaskCreate) -> TaskResponse:
    db = next(get_db()) #Get session
    new_task = Task(user_id=user_id, title=task.title, description=task.description) #create my new task
    db.add(new_task) #add a row to the database
    db.commit() #save the changes to the database
    db.refresh(new_task) #refresh to fetch back the fields like id
    return TaskResponse(id=new_task.id, title=new_task.title, description=new_task.description)

#Update a task
def update_task(user_id: int, task_id: int, task: TaskUpdate) -> TaskResponse:
    db = next(get_db()) #Get session
    #find the EXACT task
    existing_task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first() #find the task
    if not existing_task:
        raise Exception("Task not found") #if it doesn't exist, raise an error
    existing_task.title = task.title #update the title
    existing_task.description = task.description #update the description
    db.commit() #save changes
    db.refresh(existing_task) #refresh to get updated fields
    return TaskResponse(id=existing_task.id, title=existing_task.title, description=existing_task.description)

#Delete a task
def delete_task(user_id: int, task_id: int) -> bool:
    db = next(get_db()) #Get session
    existing_task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first() #find the task
    if not existing_task:
        raise Exception("Task not found") #if it doesn't exist, raise an error
    db.delete(existing_task) #delete the task
    db.commit() #save changes
    return True