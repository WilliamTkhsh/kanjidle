from sqlalchemy import Column, Integer, String, DateTime, Index
from sqlalchemy.dialects.postgresql import ARRAY
from .database import Base

class Word(Base):
    __tablename__ = "tb_kanjidle"

    id = Column(Integer, primary_key=True, index=True)
    kanji = Column(String, nullable=False)
    gloss = Column(ARRAY(String), nullable=False)
    onyomi = Column(ARRAY(String), nullable=False)
    answer = Column(String, nullable=False)
    date_of_play = Column(DateTime, nullable=True, index=True)  # index para query por data

# índice extra para consultas por date_of_play
Index("idx_date_of_play", Word.date_of_play)
