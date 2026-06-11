import os
from models import User, Conversation, Message, AiModel, PromptSystem, SenderRole
from sqlmodel import SQLModel, Session, create_engine, select
from security import hash_password

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL, echo=True)

def sender_role_init(session: Session, role: str):
    statement = select(SenderRole).where(SenderRole.role == role)
    result = session.exec(statement).first()
    
    if not result:
        session.add(
            SenderRole(
                role=role,
            )
        )
        session.commit()
        print(f"Default sender role {role} created successfully")    


def init_db():
    SQLModel.metadata.create_all(engine)
    print("Database initialized successfully")

    # Creating a default user
    default_email = "test@test.com"
    default_password = "test"

    with Session(engine) as session:
        statement = select(User).where(User.email == default_email)
        user = session.exec(statement).first()

        if not user:
            session.add(
                User(
                    email=default_email,
                    hashed_password=hash_password(default_password),
                )
            )
            session.commit()
            print("Default user created successfully with correct password hash format")

        sender_role_init(session, "user")
        sender_role_init(session, "assistant")
    
def get_db():
    with Session(engine) as session:
        yield session
