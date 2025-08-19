from fastapi import FastAPI
from kanjidle_fastapi.db import models, database
from kanjidle_fastapi.routes import word

# Criar tabelas
# models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Incluir rotas
app.include_router(word.router)
