from pydantic import BaseModel

class WordResponse(BaseModel):
    kanji: str
    gloss: list[str]
    onyomi: list[str]
    answer: str
    date_of_play: str | None  # pode ser null se ainda não foi jogada

    class Config:
        orm_mode = True
