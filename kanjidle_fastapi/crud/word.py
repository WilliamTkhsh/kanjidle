from sqlalchemy.orm import Session
from datetime import datetime
from kanjidle_fastapi.db.models import Word

def get_word_of_the_day(db: Session):
    today = datetime.now().date()
    return db.query(Word).filter(Word.date_of_play == today).first()

def get_unplayed_words(db: Session):
    return db.query(Word).filter(Word.date_of_play.is_(None)).all()
