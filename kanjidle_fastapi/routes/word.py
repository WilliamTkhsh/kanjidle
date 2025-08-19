from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from kanjidle_fastapi.schemas.word import WordResponse
from kanjidle_fastapi.crud.word import get_word_of_the_day
from kanjidle_fastapi.db.database import SessionLocal

router = APIRouter()

# Dependência para abrir/fechar sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/word-of-the-day", response_model=WordResponse)
def read_word_of_the_day(db: Session = Depends(get_db)):
    word = get_word_of_the_day(db)
    if not word:
        raise HTTPException(status_code=404, detail="Palavra do dia não encontrada")

    return {
        "kanji": word.kanji,
        "gloss": word.gloss,
        "onyomi": word.onyomi,
        "answer": word.answer,
        "date_of_play": word.date_of_play.strftime("%d/%m/%Y")
    }
